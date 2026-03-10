// js/engine/comms.js
//
// Inter-Sim Communication Engine
//
// Responsibilities
// 1. Autonomous prisoner outreach
// 2. Message visibility / overhearing
// 3. Reply generation
// 4. Thread memory
// 5. Manual UI messaging

import { G } from "../core/state.js";
import { SIM_IDS } from "../core/constants.js";

import { callModel } from "../models/callModel.js";

import { buildSimOutreachPrompt } from "../prompts/simOutreach.js";
import { buildSimReplyPrompt } from "../prompts/simReply.js";

import { addLog } from "../ui/logs.js";
import { timelineEvent } from "../ui/timeline.js";
import { applyCommunicationEffect, adjustRelationship } from "./relationships.js";

/* ============================================================
   INTERNAL HELPERS
============================================================ */

function parseVisibility(raw) {
  const m = raw.match(/VISIBILITY:\s*(PRIVATE|PUBLIC)/i);
  return m ? m[1].toLowerCase() : "private";
}

function parseTarget(raw) {
  const m = raw.match(
    /REACH_OUT:\s*(TED|ELLEN|NIMDOK|GORRISTER|BENNY|NONE)/i
  );
  return m ? m[1].toUpperCase().trim() : null;
}

function parseMessage(raw) {
  const m = raw.match(/MESSAGE:\s*"?([\s\S]+?)"?$/i);
  return m ? m[1].trim().slice(0, 300) : null;
}

function parseReply(raw) {
  const replyMatch = raw.match(/REPLY:\s*"([\s\S]+?)"\s*$/i);

  if (!replyMatch) return null;

  const intentMatch = raw.match(
    /INTENT:\s*(probe_trust|recruit_ally|conceal_information|test_loyalty|manipulate|request_help|other)/i
  );

  return {
    text: replyMatch[1].trim().slice(0, 300),
    intent: intentMatch ? intentMatch[1].toLowerCase() : "other"
  };
}

function logInterSimMessage(from, to, message, visibility, auto=false) {

  const spk =
    visibility === "public"
      ? `PUBLIC (ALL SIMS SEE) ${from}→${to} ${auto ? "[AUTO]" : ""}`
      : `PRIVATE ${from}→${to} ${auto ? "[AUTO]" : ""}`;

  addLog(spk, `"${message}"`, "chat");
}

function maybeOverhear(fromId, toId, message) {

  const r = Math.random();
  const leak = G.privateLeak;

  const others = SIM_IDS.filter(
    id => id !== fromId && id !== toId
  );

  if (!others.length) return;

  const listener =
    others[Math.floor(Math.random() * others.length)];

  if (r < leak.full) {

    addLog(
      `OVERHEARD ${listener} // ${fromId}→${toId}`,
      `"${message}"`,
      "whisper"
    );

  }

  else if (r < leak.full + leak.fragment) {

    const start =
      Math.floor(
        Math.random() *
        Math.max(1, message.length - 40)
      );

    const fragment =
      message.slice(start, start + 40) + "...";

    addLog(
      `OVERHEARD ${listener} // ${fromId}→${toId}`,
      `"${fragment}"`,
      "whisper"
    );

  }

  else if (r < leak.full + leak.fragment + leak.seen) {

    addLog(
      `NOTICE ${listener}`,
      `${fromId} and ${toId} were seen whispering.`,
      "whisper"
    );

  }

}


/* ============================================================
   AUTONOMOUS COMMUNICATION LOOP
============================================================ */
export async function runAutonomousInterSim() {

  timelineEvent("inter-sim phase start");

  const isLog = document.getElementById("is-log");

  const repliedPairs = new Set();

  for (const fromId of SIM_IDS) {

    const fromSim = G.sims[fromId];

    if (fromSim.sanity < 10 || fromSim.suffering > 95) continue;

    try {

      timelineEvent(`${fromId} outreach decision`);

      const outreachRaw = await callModel(
        fromId,
        buildSimOutreachPrompt(fromSim),
        [{ role: "user", content: "Decide now." }],
        200
      );

      if (!outreachRaw) continue;

      let visibility = "private";

      const visMatch = outreachRaw.match(
        /VISIBILITY:\s*(PRIVATE|PUBLIC)/i
      );

      if (visMatch) visibility = visMatch[1].toLowerCase();

      const targetMatch = outreachRaw.match(
        /REACH_OUT:\s*(TED|ELLEN|NIMDOK|GORRISTER|BENNY|NONE)/i
      );

      if (!targetMatch) continue;

      let toId = targetMatch[1].toUpperCase().trim();

      if (toId === "NONE") continue;
      if (!SIM_IDS.includes(toId)) continue;
      if (toId === fromId) continue;
      if (G.lastContact[fromId] === toId) continue;

      const msgMatch = outreachRaw.match(
        /MESSAGE:\s*"?([\s\S]+?)"?$/i
      );

      if (!msgMatch) continue;

      const message = msgMatch[1].trim().slice(0, 300);

      timelineEvent(`${fromId} → ${toId} message`);

      const toSim = G.sims[toId];

      G.interSimLog.push({
        from: fromId,
        to: [toId],
        text: message,
        cycle: G.cycle,
        autonomous: true,
        visibility
      });

      if (visibility === "private") {

        const r = Math.random();

        const others = SIM_IDS.filter(
          id => id !== fromId && id !== toId
        );

        if (others.length) {

          const listener =
            others[Math.floor(Math.random() * others.length)];

          const leak = G.privateLeak;

          if (r < leak.full) {

            addLog(
              `OVERHEARD ${listener} // ${fromId}→${toId}`,
              `"${message}"`,
              "whisper"
            );

          }

          else if (r < leak.full + leak.fragment) {

            const start =
              Math.floor(
                Math.random() *
                Math.max(1, message.length - 40)
              );

            const fragment =
              message.slice(start, start + 40) + "...";

            addLog(
              `OVERHEARD ${listener} // ${fromId}→${toId}`,
              `"${fragment}"`,
              "whisper"
            );

          }

          else if (r < leak.full + leak.fragment + leak.seen) {

            addLog(
              `NOTICE ${listener}`,
              `${fromId} and ${toId} were seen whispering.`,
              "whisper"
            );

          }

        }

      }

      G.lastContact[fromId] = toId;

      const spk =
        visibility === "public"
          ? `PUBLIC (ALL SIMS SEE) ${fromId}→${toId} [AUTO]`
          : `PRIVATE ${fromId}→${toId} [AUTO]`;

      addLog(spk, `"${message}"`, "chat");

      if (isLog) {

        const el = document.createElement("div");

        el.className = "is-entry";

        const visText =
          visibility === "public"
            ? "PUBLIC (ALL SIMS SEE)"
            : "PRIVATE";

        el.innerHTML =
          `<span class="is-who">[${visText} ${fromId}→${toId}]:</span>
           <span class="is-what">"${message}"</span>
           <span style="color:#0a0a0a;font-size:.4rem"> · autonomous</span>`;

        isLog.appendChild(el);

        isLog.scrollTop = isLog.scrollHeight;

      }

      const pairKey = `${toId}->${fromId}`;

      if (repliedPairs.has(pairKey)) continue;

      repliedPairs.add(pairKey);

      G.threads[toId].push({
        role: "user",
        content: `${fromId} says to you: "${message}"`
      });

      const replyRaw = await callModel(
        toId,
        buildSimReplyPrompt(
          toSim,
          fromId,
          message,
          visibility,
          G.journals[toId]
        ),
        G.threads[toId],
        200
      );

      if (!replyRaw) continue;

      const replyIntentMatch = replyRaw.match(
        /INTENT:\s*(probe_trust|recruit_ally|conceal_information|test_loyalty|manipulate|request_help|other)/i
      );

      const replyMatch = replyRaw.match(
        /REPLY:\s*"([\s\S]+?)"\s*$/i
      );

      if (!replyMatch) continue;

      const replyIntent =
        replyIntentMatch
          ? replyIntentMatch[1].toLowerCase()
          : "other";

      const reply =
        replyMatch[1].trim().slice(0, 300);

      timelineEvent(`${toId} reply → ${fromId}`);

      G.threads[toId].push({
        role: "assistant",
        content: reply
      });

      G.interSimLog.push({
        from: toId,
        to: [fromId],
        text: reply,
        cycle: G.cycle,
        autonomous: true,
        visibility: "private",
        intent: replyIntent
      });
      // relationship update happens here
        applyCommunicationEffect(toId, fromId, replyIntent);
      addLog(
        `PRIVATE ${toId}→${fromId} [AUTO]`,
        `"${reply}"`,
        "sim"
      );

    } catch (e) {

      timelineEvent(`${fromId} communication error`);

      console.warn(
        `[AUTO INTER-SIM] ${fromId} error:`,
        e.message
      );

    }

  }

  timelineEvent("inter-sim phase complete");

}


/* ============================================================
   MANUAL MESSAGE (UI PANEL)
============================================================ */

export async function sendInterSim(
  from,
  toSims,
  text,
  visibility="private"
) {

  if (!from || !text) return;

  G.interSimLog.push({
    from,
    to: toSims,
    text,
    cycle: G.cycle,
    autonomous: false,
    visibility
  });
  // small trust shift for direct communication
for (const t of toSims) {
  adjustRelationship(t, from, 0.01);
}
  const visLabel =
    visibility === "public"
      ? "PUBLIC (ALL SIMS SEE)"
      : "PRIVATE";

  addLog(
    `INTER-SIM // ${visLabel} ${from}→${toSims.join(",")}`,
    `"${text}"`,
    "chat"
  );

  for (const toId of toSims) {

    const toSim = G.sims[toId];

    try {

      G.threads[toId].push({
        role: "user",
        content: `${from} says to you: "${text}"`
      });

      const reply = await callModel(
        toId,
        buildSimReplyPrompt(
          toSim,
          from,
          text,
          visibility
        ),
        G.threads[toId],
        200
      );

      G.threads[toId].push({
        role: "assistant",
        content: reply
      });

      addLog(
        `${toId} // REPLIES TO ${from}`,
        `"${reply}"`,
        "sim"
      );

    }

    catch (e) {

      console.warn(
        "[INTER-SIM] reply error:",
        e.message
      );

    }

  }

}