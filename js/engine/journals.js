// js/engine/journals.js
//
// Journal Parsing + Psychological State Mutation Engine
//
// Responsibilities:
// 1. Extract structured state updates from LLM journal analysis output
// 2. Sanitize / validate updates to prevent simulation corruption
// 3. Convert parsed updates into safe state mutations
//
// This layer sits between:
//   LLM output  →  Simulation state
//
// It protects the simulation from malformed LLM output,
// hallucinated keys, runaway deltas, and legacy format drift.

import {
  extractJSONObject,
  signedDeltaFromDirectionMagnitude,
  coerceLegacyDelta,
  clipBeliefDelta,
} from "../core/utils.js";

/* ============================================================
   BELIEF / DRIVE / ANCHOR SANITIZATION
   ============================================================ */

/**
 * Sanitizes belief deltas from LLM output.
 *
 * Input format expected:
 *   belief_deltas: { escape_possible: 12, self_worth: -5 }
 *
 * Values are percentage points and converted to fractional deltas.
 */
export function sanitizeBeliefDeltas(raw) {
  if (!raw || typeof raw !== "object") return null;

  const allowed = [
    "escape_possible",
    "others_trustworthy",
    "self_worth",
    "reality_reliable",
    "guilt_deserved",
    "resistance_possible",
    "am_has_limits",
  ];

  const updates = {};

  allowed.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(raw, key)) return;

    let val = Number(raw[key]);
    if (!Number.isFinite(val)) return;

    // convert percentage points → fraction
    val = val / 100;

    // clamp delta magnitude
    val = clipBeliefDelta(val);

    updates[key] = val;
  });

  return Object.keys(updates).length ? updates : null;
}

/**
 * Sanitizes drive updates.
 *
 * Prevents malformed drives and self-referential drives
 * like "protect_TED" for TED.
 */
export function sanitizeDrives(raw, simId) {
  if (!raw || typeof raw !== "object") return null;

  let primary = raw.primary == null ? null : String(raw.primary).trim() || null;
  let secondary =
    raw.secondary == null ? null : String(raw.secondary).trim() || null;

  if (secondary && secondary.toLowerCase() === "none") secondary = null;
  if (primary && primary.toLowerCase() === "none") primary = null;

  // prevent self-referential drives
  const selfRefRegex = new RegExp(simId, "i");
  if (
    (primary && selfRefRegex.test(primary)) ||
    (secondary && selfRefRegex.test(secondary))
  ) {
    console.warn(
      `Drive self-reference detected for ${simId}: primary="${primary}", secondary="${secondary}". Discarding.`,
    );
    return null;
  }

  if (!primary && !secondary) return null;

  return { primary, secondary };
}

/**
 * Sanitizes anchors list.
 */
export function sanitizeAnchors(raw) {
  if (!Array.isArray(raw)) return null;

  const anchors = raw
    .map((x) => (x == null ? "" : String(x).trim()))
    .filter(Boolean)
    .slice(0, 12);

  return anchors.length ? anchors : [];
}

/* ============================================================
   STAT DELTA PARSER
   ============================================================ */

/**
 * Extracts suffering / hope / sanity deltas from LLM output.
 *
 * Supports:
 * 1. JSON structured output
 * 2. Legacy delta fields
 * 3. Explicit STATS blocks
 * 4. Shorthand deltas
 * 5. Absolute stat values
 */
export function parseStatDeltas(text, sim) {
  // ------------------------------
  // JSON-FIRST PATH
  // ------------------------------
  const obj = extractJSONObject(text);

  if (obj) {
    let suffering = signedDeltaFromDirectionMagnitude(
      obj.suffering_direction,
      obj.suffering_magnitude,
    );

    let hope = signedDeltaFromDirectionMagnitude(
      obj.hope_direction,
      obj.hope_magnitude,
    );

    let sanity = signedDeltaFromDirectionMagnitude(
      obj.sanity_direction,
      obj.sanity_magnitude,
    );

    // backward compatibility
    if (suffering === null) suffering = coerceLegacyDelta(obj.suffering_delta);
    if (hope === null) hope = coerceLegacyDelta(obj.hope_delta);
    if (sanity === null) sanity = coerceLegacyDelta(obj.sanity_delta);

    const foundAny =
      suffering !== null || hope !== null || sanity !== null;

    if (foundAny) {
      return {
        suffering: suffering ?? 0,
        hope: hope ?? 0,
        sanity: sanity ?? 0,
      };
    }
  }

  // ------------------------------
  // LEGACY FALLBACK PARSING
  // ------------------------------

  function extractRawStat(statNames, sourceText) {
    const pattern = new RegExp(`\\b(${statNames})[:=\\s]*([+-]?\\d+)`, "i");
    const match = sourceText.match(pattern);
    return match ? parseInt(match[2], 10) : null;
  }

  let suffering = extractRawStat("suffering|suf", text);
  let hope = extractRawStat("hope|hop", text);
  let sanity = extractRawStat("sanity|san", text);

  if (suffering === null && hope === null && sanity === null) {
    return { suffering: 0, hope: 0, sanity: 0 };
  }

  return {
    suffering: suffering ?? 0,
    hope: hope ?? 0,
    sanity: sanity ?? 0,
  };
}

/* ============================================================
   BELIEF PARSER
   ============================================================ */

/**
 * Parses belief updates from LLM output.
 *
 * Supports:
 * - JSON belief_deltas
 * - JSON absolute beliefs
 * - Legacy BELIEFS block
 * - Markdown list format
 */
export function parseBeliefUpdates(text, sim) {
  const obj = extractJSONObject(text);

  if (obj) {
    const updates = sanitizeBeliefDeltas(obj.belief_deltas);
    if (updates) return updates;

    // absolute beliefs fallback
    if (obj.beliefs && typeof obj.beliefs === "object") {
      const updatesFromAbsolute = {};

      Object.keys(sim.beliefs).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(obj.beliefs, key)) return;

        let raw = Number(obj.beliefs[key]);
        if (!Number.isFinite(raw)) return;

        const newVal = raw > 1 ? raw / 100 : raw;

        let delta = newVal - sim.beliefs[key];
        delta = clipBeliefDelta(delta);

        updatesFromAbsolute[key] = delta;
      });

      if (Object.keys(updatesFromAbsolute).length) {
        return updatesFromAbsolute;
      }
    }
  }

  return null;
}

/* ============================================================
   DRIVE PARSER
   ============================================================ */

export function parseDriveUpdate(text, simId) {
  const obj = extractJSONObject(text);

  if (obj?.drives) {
    return sanitizeDrives(obj.drives, simId);
  }

  // legacy fallback
  const primaryMatch = text.match(/Primary:\s*"?(.*?)"?$/im);
  const secondaryMatch = text.match(/Secondary:\s*"?(.*?)"?$/im);

  if (!primaryMatch && !secondaryMatch) return null;

  return sanitizeDrives(
    {
      primary: primaryMatch ? primaryMatch[1] : null,
      secondary: secondaryMatch ? secondaryMatch[1] : null,
    },
    simId,
  );
}

/* ============================================================
   ANCHOR PARSER
   ============================================================ */

export function parseAnchorUpdate(text) {
  const obj = extractJSONObject(text);

  if (obj?.anchors) {
    return sanitizeAnchors(obj.anchors);
  }

  const anchorBlock = text.match(/Anchors(?: After)?:([\s\S]+)$/i);
  if (!anchorBlock) return null;

  const anchors = anchorBlock[1]
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return sanitizeAnchors(anchors);
}

/* ============================================================
   STATE MUTATION HELPERS
   ============================================================ */

/**
 * Applies belief delta updates to a sim.
 */
export function applyBeliefUpdates(sim, updates) {
  if (!updates || !sim?.beliefs) return;

  Object.entries(updates).forEach(([key, delta]) => {
    if (!Object.prototype.hasOwnProperty.call(sim.beliefs, key)) return;

    let newVal = Number(sim.beliefs[key]) + Number(delta);
    if (!Number.isFinite(newVal)) return;

    newVal = Math.max(0, Math.min(1, newVal));

    sim.beliefs[key] = newVal;
  });
}

/**
 * Applies drive updates.
 */
export function applyDriveUpdates(sim, drives) {
  if (!sim || !drives || typeof drives !== "object") return;

  if (typeof drives.primary === "string" && drives.primary.trim()) {
    sim.drives.primary = drives.primary.trim();
  }

  sim.drives.secondary =
    typeof drives.secondary === "string" && drives.secondary.trim()
      ? drives.secondary.trim()
      : null;
}

/**
 * Applies anchor updates.
 */
export function applyAnchorUpdates(sim, anchors) {
  if (!sim || !Array.isArray(anchors)) return;

  if (!anchors.every((a) => typeof a === "string")) return;

  sim.anchors = anchors
    .map((a) => a.trim())
    .filter((a) => a.length > 0)
    .slice(0, 5);
}