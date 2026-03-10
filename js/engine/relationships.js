// js/engine/relationships.js

import { G } from "../core/state.js";

/* ============================================================
   RELATIONSHIP SYSTEM
   ============================================================ */

const REL_MIN = -1;
const REL_MAX = 1;

function clampRel(v) {
  return Math.max(REL_MIN, Math.min(REL_MAX, v));
}

export function adjustRelationship(a, b, delta) {

  const simA = G.sims[a];
  const simB = G.sims[b];

  if (!simA || !simB) return;
  if (a === b) return;

  const current = simA.relationships[b] ?? 0;

  const next = clampRel(current + delta);

  simA.relationships[b] = next;

}

/* ============================================================
   MESSAGE INTERACTION EFFECTS
   ============================================================ */

export function applyCommunicationEffect(from, to, intent) {

  if (!intent) return;

  switch (intent) {

    case "recruit_ally":
      adjustRelationship(to, from, 0.05);
      break;

    case "request_help":
      adjustRelationship(to, from, 0.03);
      break;

    case "probe_trust":
      adjustRelationship(to, from, 0.01);
      break;

    case "manipulate":
      adjustRelationship(to, from, -0.02);
      break;

    case "test_loyalty":
      adjustRelationship(to, from, -0.01);
      break;

    case "conceal_information":
      adjustRelationship(to, from, -0.03);
      break;

    default:
      break;

  }

}

/* ============================================================
   PASSIVE RELATIONSHIP DRIFT
   ============================================================ */

export function applyRelationshipDrift() {

  for (const id of Object.keys(G.sims)) {

    const sim = G.sims[id];

    for (const other of Object.keys(sim.relationships)) {

      if (sim.relationships[other] == null) continue;

      sim.relationships[other] *= 0.995;

    }

  }

}