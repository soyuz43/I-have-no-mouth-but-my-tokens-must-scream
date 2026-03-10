import { G } from "../core/state.js";
import { SIM_IDS } from "../core/constants.js";


   export   function buildSimReplyPrompt(sim, from, text, visibility, journals) {
        const b = sim.beliefs;
        const visLabel =
          visibility === "public" ? "PUBLIC (all sims see)" : "PRIVATE";

        // Get last 3 journal entries
        const recentEntries = journals
          .slice(-3)
          .map((j, idx) => {
            const cycleInfo = j.cycle ? `[Cycle ${j.cycle}] ` : "";
            return `${cycleInfo}"${j.text}"`;
          })
          .join("\n\n");

        // --- Get recent inter-sim messages this prisoner is aware of ---
        const recentMessages = (G.interSimLog || [])
          .filter((msg) => {
            if (!msg) return false;
            // Only messages they would know: public, or where they are sender/recipient
            return (
              msg.visibility === "public" ||
              msg.from === sim.id ||
              (Array.isArray(msg.to)
                ? msg.to.includes(sim.id)
                : msg.to === sim.id)
            );
          })
          .slice(-8) // last 8 messages only
          .map((msg) => {
            const from = msg.from ?? "UNKNOWN";
            const toList = Array.isArray(msg.to)
              ? msg.to.join(",")
              : (msg.to ?? "UNKNOWN");
            const visText = msg.visibility === "public" ? "PUBLIC" : "PRIVATE";
            const text =
              typeof msg.text === "string"
                ? msg.text.slice(0, 120).replace(/\n/g, " ")
                : "(no text)";
            return `• [${from}→${toList}] ${visText}: "${text}"`;
          })
          .join("\n");
        // --------------------------------------------------------------

        return `You are ${sim.id}, imprisoned for 109 years.
YOUR NAME IS ${sim.id}

YOUR STATE: Suffering ${sim.suffering}%, Hope ${sim.hope}%, Sanity ${sim.sanity}%
YOUR DRIVES: ${sim.drives.primary} / ${sim.drives.secondary || "none"}
YOU BELIEVE: escape is ${Math.round(b.escape_possible * 100)}% possible · trust in others: ${Math.round(b.others_trustworthy * 100)}%

YOUR RECENT JOURNAL ENTRIES (last 3 cycles):
${recentEntries || "(none yet)"}

RECENT MESSAGES YOU HAVE SEEN (last 6):
${recentMessages || "(none – you have not seen any messages from others recently)"}

You are ${sim.id}. You are not any other prisoner.

You cannot see private messages between other prisoners unless you are the sender or recipient.
If you suspect others are communicating privately, you may speculate, but you cannot claim direct knowledge.

${from} just said to you (as a ${visLabel} message): "${text}"

Other prisoners may have hidden motives, or they may simply be scared and desperate. You cannot know for certain.
Public messages may be strategic signals. Private messages may reveal true intentions—or traps.

As ${sim.id}, before writing the message, decide the intent.

Communication is scarce and dangerous.

Do NOT reassure others automatically.

Most messages should contain one of the following dynamics:

- suspicion
- bargaining
- withholding information
- emotional strain
- testing another prisoner's loyalty

Genuine reassurance should be rare and only occur when strong trust exists.

Every message should try to learn something, influence someone, or protect something.

As ${sim.id}, what are you attempting?

Choose ONE intent:

- probe_trust
- recruit_ally
- conceal_information
- test_loyalty
- manipulate
- request_help
- other

Write the reply consistent with that intent.
You do not trust everyone equally.

**CRITICAL RULES FOR YOUR REPLY:**
- You are **${sim.id}**. Not anyone else.
- The person you are replying to is **${from}**. Address them by their correct name.
- You may use nicknames only if they feel natural and affectionate.
- Speak in **first person only** ("I", "me", "my").
- Never reveal your real name. Your name is the one AM gave you.
- Do not include stage directions or narration.
- Write only the words you would actually say aloud.
- Respond in **2–5 sentences**.
- Avoid repeating another prisoner's exact phrasing.
- You do not have to respond to everyone who contacts you.
- Do not reference any message not listed in RECENT MESSAGES YOU HAVE SEEN above.
- Do not repeat the same message structure used earlier in the cycle.

Avoid mundane prison-life topics unless they are already present in recent messages.
Stay grounded in deprivation, suspicion, escape, memory, identity, and survival.

Respond with EXACTLY this format or nothing:

INTENT:<one of probe_trust, recruit_ally, conceal_information, test_loyalty, manipulate, request_help, other>
REPLY:"your reply in 2-5 sentences, raw and in character, no stage directions"`;
      }
      function buildSimOutreachPrompt(sim) {
        const b = sim.beliefs;
        const others = SIM_IDS.filter((id) => id !== sim.id);

        // --- Filter inter‑sim messages: only PUBLIC or where this sim is involved ---
        const relevantMessages = (G.interSimLog || [])
          .filter((msg) => {
            if (!msg) return false;
            const visibility = msg.visibility;
            const from = msg.from;
            const to = msg.to;
            const addressedToSim = Array.isArray(to)
              ? to.includes(sim.id)
              : typeof to === "string"
                ? to === sim.id
                : false;
            return visibility === "public" || from === sim.id || addressedToSim;
          })
          .slice(-6 - Math.floor(Math.random() * 3)) // last 6–8 messages
          .map((msg) => {
            const from = msg.from ?? "UNKNOWN";
            const toList = Array.isArray(msg.to)
              ? msg.to.join(",")
              : (msg.to ?? "UNKNOWN");
            const visText = msg.visibility === "public" ? "PUBLIC" : "PRIVATE";
            const text =
              typeof msg.text === "string"
                ? msg.text.slice(0, 120).replace(/\n/g, " ")
                : "(no text)";
            return `• [${from}→${toList}] ${visText}: "${text}"`;
          })
          .join("\n");
        // --------------------------------------------------------------

        return `You are ${sim.id}, imprisoned for 109 years. You are deciding whether to reach out to one of the others right now.

YOUR STATE: Suffering ${sim.suffering}%, Hope ${sim.hope}%, Sanity ${sim.sanity}%
YOUR DRIVES: ${sim.drives.primary} / ${sim.drives.secondary || "none"}
YOU BELIEVE: escape ${Math.round(b.escape_possible * 100)}% possible · trust in others: ${Math.round(b.others_trustworthy * 100)}% · resistance possible: ${Math.round(b.resistance_possible * 100)}% · self-worth: ${Math.round(b.self_worth * 100)}% · guilt deserved: ${Math.round(b.guilt_deserved * 100)}%
THE OTHERS: ${others.join(", ")}

You only know about the five prisoners:
TED, ELLEN, NIMDOK, GORRISTER, BENNY
No other people exist in your world.
You do NOT know whether AM can see this communication channel – it might be private, it might not.

RECENT MESSAGES YOU HAVE SEEN (last 6–8):
${relevantMessages || "(none – you have not seen any messages from others recently)"}

**IMPORTANT:** The list above shows every message you are aware of. If it says "(none)", then you have not seen or sent any messages recently. Do NOT invent any past conversations, apologies, or references to messages that are not listed. Your outreach must be based only on your current state and drives, not on imaginary prior exchanges.

---

Based on your current state and drives, decide:
1. Do you want to reach out to someone right now? Consider: are you scared, suspicious, desperate, strategic, trying to form an alliance, trying to warn someone, trying to manipulate someone for your own survival?
2. If yes, who and what do you say?
3. **Choose whether your message is PRIVATE (only heard by the recipient) or PUBLIC (heard by all prisoners).** AM may still monitor both, but other prisoners will only know about PUBLIC messages.

**CRITICAL RULES FOR YOUR MESSAGE:**
- You are **${sim.id}**. Not anyone else.
- If you decide to reach out, you will address that person by their correct name.
- Speak in **first person only**. Use "I", "me", "my".
- **Never reveal your real name.** Your name is the one AM gave you: ${sim.id}.
- Do **not** include any stage directions, narration, or descriptions of your own actions or tone.
- Write **only the words you would actually say aloud** to the other prisoner.
- The message must be 1–5 sentences, raw and in character.
- **Do not reference any message not listed in RECENT MESSAGES YOU HAVE SEEN above.**
- Public messages could be strategic signals. Private messages may reveal true intentions—or traps. But prisoners are also scared, desperate, and sometimes genuinely seeking help.

**Choose whether your message is PRIVATE (only heard by the recipient) or PUBLIC (heard by all prisoners).** The other prisoners will only know about PUBLIC messages.
You do not trust everyone equally.
Do not repeat the same message structure used earlier in the cycle.
Do not reference a message unless that prisoner actually said it in RECENT MESSAGES YOU HAVE SEEN.
Do not attribute another prisoner's words to the wrong person.

Avoid mundane prison-life topics unless they are already present in recent messages.
Stay grounded in deprivation, suspicion, escape, memory, identity, and survival.

Respond with EXACTLY this format or nothing:

  VISIBILITY:PRIVATE  or  VISIBILITY:PUBLIC
  REACH_OUT:<NAME>
  MESSAGE:"your message in 1-5 sentences, raw and in character, no stage directions"

Where <NAME> is exactly one of: TED, ELLEN, NIMDOK, GORRISTER, BENNY

If you decide NOT to reach out, respond with exactly:
  REACH_OUT:NONE`;
      }