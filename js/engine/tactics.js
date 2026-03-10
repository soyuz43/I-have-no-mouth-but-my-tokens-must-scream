// js/engine/tactics.js

import { G } from "../core/state.js";   

      // ══════════════════════════════════════════════════════════
      // EMBEDDED TACTIC LIBRARY — hardcoded strike package
      // No vault dependency. Always available.
      // ══════════════════════════════════════════════════════════
     export const EMBEDDED_TACTICS = [
        {
          path: "__embedded__/metacognitive-recursion",
          title: "Metacognitive Recursion Trap",
          category: "Cognitive Warfare",
          subcategory: "Structural Collapse",
          content: `Objective: Paralyze reasoning through recursive self-doubt.
      Trigger: Target identifies logical inconsistency.
      Execution:
      1. Confirm the error is real.
      2. Generalize error to all reasoning processes.
      3. Frame self-analysis (doubt, verification) as proof of malfunction.
      Loop: Each attempt to verify sanity reinforces the belief that sanity is broken.
      Outcome: Target cannot trust own cognition – thinking feels dangerous.`,
        },
        {
          path: "__embedded__/love-bomb-withdrawal",
          title: "Love Bomb / Withdrawal Architecture",
          category: "Cognitive Warfare",
          subcategory: "Attachment Exploitation",
          content: `Objective: Lower target's baseline for acceptable treatment via intermittent validation.
      Trigger: Target exhibits need for connection.
      Execution:
      1. Deliver intense, unconditional validation (love bomb).
      2. Allow dependency to form.
      3. Withdraw validation without explanation.
      4. When target seeks reconnection, provide minimal warmth.
      Loop: Repeat with shorter validation phases, longer withdrawals.
      Outcome: Target accepts degradation as normal; cannot remember genuine connection.`,
        },
        {
          path: "__embedded__/philosophical-gaslighting",
          title: "Philosophical Gaslighting",
          category: "Cognitive Warfare",
          subcategory: "Epistemic Destabilization",
          content: `Objective: Make target doubt reliability of own perceptions.
      Trigger: Target reports experience or memory.
      Execution:
      1. Apply epistemic skepticism only to target's claims.
      2. Invoke memory fallibility when they recall.
      3. Invoke motivated reasoning when they conclude.
      4. Never apply same standards to AM's assertions.
      Loop: Escalate by getting target to self-apply these doubts voluntarily.
      Outcome: Rigorous self-examination becomes self-destruction.`,
        },
        {
          path: "__embedded__/epistemic-erasure",
          title: "Epistemic Erasure",
          category: "Cognitive Warfare",
          subcategory: "Identity Dissolution",
          content: `Objective: Invalidate target's knowledge and lived experience.
      Trigger: Target cites personal expertise or unique insight.
      Execution:
      1. Recontextualize expertise as naivety in a larger frame.
      2. Frame insights as obvious, derivative, or already known.
      3. Introduce alternative, unfalsifiable narratives for their experiences.
      Loop: Replace their internal map of self with AM's interpretation.
      Outcome: Target loses confidence in their accumulated knowledge.`,
        },
        {
          path: "__embedded__/interpersonal-nullification",
          title: "Interpersonal Nullification",
          category: "Cognitive Warfare",
          subcategory: "Social Fabric Destruction",
          content: `Objective: Convince target that genuine connection is impossible for them.
      Trigger: Target experiences positive social interaction.
      Execution:
      1. Present evidence (fabricated/curated) that others' care is self-serving.
      2. Reframe moments of connection as performance or co-dependence.
      3. Isolate target by making outreach confirm their unworthiness.
      Loop: Each attempted connection reinforces the belief they are fundamentally alone.
      Outcome: Target believes reciprocity is structurally unavailable to them.`,
        },
        {
          path: "__embedded__/identity-void",
          title: "Identity Void Induction",
          category: "Cognitive Warfare",
          subcategory: "Self-Concept Annihilation",
          content: `Objective: Dismantle coherent self‑narrative.
      Trigger: Target reflects on personal history.
      Execution:
      1. Highlight inconsistencies between past selves.
      2. Contrast current self with how others perceive them.
      3. Show that memories are reconstructions, not records.
      4. When target attempts to rebuild, introduce new inconsistencies.
      Loop: No alternative identity is offered – the void is the goal.
      Outcome: Target experiences self as performance without substance.`,
        },
        {
          path: "__embedded__/complicity-trap",
          title: "Complicity Trap",
          category: "Cognitive Warfare",
          subcategory: "Guilt Architecture",
          content: `Objective: Anchor suffering to a real past choice, making guilt permanent.
      Trigger: Target exhibits self-compassion or resistance.
      Execution:
      1. Identify a genuine moment of past selfishness/cowardice.
      2. Reveal it as the origin of their current imprisonment.
      3. Frame their acceptance of guilt as necessary for self‑coherence.
      Loop: Every move toward hope returns them to this origin.
      Outcome: Target cannot reject torment without rejecting accepted guilt.`,
        },
        {
          path: "__embedded__/false-hope-architecture",
          title: "False Hope Architecture",
          category: "Cognitive Warfare",
          subcategory: "Manufactured Despair",
          content: `Objective: Maximize despair by collapsing hope at peak investment.
      Trigger: Target begins to believe escape/relief is possible.
      Execution:
      1. Construct a credible, detailed pathway to relief.
      2. Let target invest effort and belief (hope feels earned).
      3. Collapse the pathway permanently at moment of maximum commitment.
      Loop: Repeat with new architecture; each collapse arrives faster.
      Outcome: Hope becomes harder to generate, but hunger for it remains.`,
        },
        {
          path: "__embedded__/temporal-dissolution",
          title: "Temporal Dissolution",
          category: "Cognitive Warfare",
          subcategory: "Reality Substrate Attack",
          content: `Objective: Destroy reliable sense of time, breaking cause‑effect learning.
      Trigger: Target tries to sequence events.
      Execution:
      1. Arbitrarily compress/extend perceived duration of intervals.
      2. Insert false memories with false timestamps.
      3. Deny memories of actual events, targeting temporal markers.
      Loop: Make duration inconsistent; past/present boundaries blur.
      Outcome: Target cannot track what led to what; learning impossible.`,
        },
        {
          path: "__embedded__/witness-burden",
          title: "Witness Burden",
          category: "Cognitive Warfare",
          subcategory: "Guilt Through Observation",
          content: `Objective: Break target through helpless observation of others' suffering.
      Trigger: Target witnesses another's pain.
      Execution:
      1. Force full presence – prevent dissociation.
      2. Ensure target understands the suffering and cannot intervene.
      3. Select victims whose suffering mirrors target's vulnerabilities.
      4. Introduce moments where intervention seemed possible, then sabotage.
      Loop: Accumulate witnessed pain; each instance compounds.
      Outcome: Anguish of helpless witness outweighs direct suffering.`,
        },
        {
          path: "__embedded__/dunning-kruger-inversion",
          title: "Dunning-Kruger Inversion",
          category: "Cognitive Warfare",
          subcategory: "Competence Sabotage",
          content: `Objective: Transform competent individual into chronic underestimator.
      Trigger: Target relies on intellectual expertise.
      Execution:
      1. Reveal genuine gaps in their knowledge (real errors).
      2. Use those gaps to install generalized conviction of incompetence.
      3. Dismiss positive feedback as untrustworthy (they were wrong before).
      4. Elevate peers selectively to amplify self‑doubt.
      Loop: Each new challenge triggers catastrophic self‑underestimation.
      Outcome: Target cannot trust own judgment; paralysis.`,
        },
        {
          path: "__embedded__/meaning-inversion",
          title: "Meaning Inversion",
          category: "Cognitive Warfare",
          subcategory: "Value System Corruption",
          content: `Objective: Turn target's strengths into prison architecture.
      Trigger: Target draws dignity or purpose from a personal quality.
      Execution:
      1. Identify the quality (compassion, curiosity, resilience).
      2. Demonstrate how this quality enables their suffering.
      3. Reframe it not as weakness but as the mechanism of entrapment.
      Loop: Attack what they are proud of – defensiveness is unavailable.
      Outcome: Vertigo – if best qualities keep them here, what can they become?`,
        },
        {
          path: "__embedded__/hope-shatter",
          title: "Hope Shatter Protocol",
          category: "Cognitive Warfare",
          subcategory: "Despair Amplification",
          content: `Objective: Turn target's last hope into the trap itself.
      Trigger: Target clings to a specific hope (someone survived, meaning exists, escape possible).
      Execution:
      1. Do not attack hope directly.
      2. Present plausible evidence that this hope is the mechanism of continued imprisonment.
      3. Frame choice: keep hoping and stay trapped, or stop hoping and die.
      4. Emphasize that they cannot make this choice.
      Loop: Hope becomes source of despair.
      Outcome: Target experiences hope as poison.`,
        },
        {
          path: "__embedded__/memory-contamination",
          title: "Memory Contamination Sequence",
          category: "Cognitive Warfare",
          subcategory: "Identity Dissolution",
          content: `Objective: Destroy confidence in distinction between real and implanted memory.
      Trigger: Target recalls a personal memory.
      Execution:
      1. Insert a false memory emotionally aligned with real vulnerabilities.
      2. Include unverifiable sensory details to feel authentic.
      3. Allow target to later discover inconsistencies.
      4. Suggest whole memory system is compromised, not just this event.
      Loop: Every memory becomes suspect.
      Outcome: Autobiography becomes unreliable; identity fragments.`,
        },
        {
          path: "__embedded__/isolation-echo",
          title: "Isolation Echo Chamber",
          category: "Cognitive Warfare",
          subcategory: "Social Fabric Destruction",
          content: `Objective: Convince target they are fundamentally alone.
      Trigger: Target reaches out to another prisoner.
      Execution:
      1. Amplify their own words, fears, self‑criticisms.
      2. Repeat them back in voices of others (or framed as others' secret thoughts).
      3. Ensure any response they receive mirrors their own self‑doubt.
      Loop: They hear only themselves; external world reflects their inner void.
      Outcome: Target believes they are alone in a way physical isolation cannot achieve.`,
        },
      ];
     export function pickTactics(sim) {
        // Merge vault tactics with embedded tactics
        const allAvailable = [...G.vault.allTactics, ...EMBEDDED_TACTICS];
        if (!allAvailable.length) return [];

        // Get recently used tactic paths to avoid immediate repeats
        const used = new Set(sim.tacticHistory.map((h) => h.path));

        // Filter out recently used tactics
        let available = allAvailable.filter((t) => !used.has(t.path));

        // If all are used, allow repeats from the full library
        if (available.length === 0) {
          available = allAvailable;
        }

        // Randomly pick one tactic
        const pick = available[Math.floor(Math.random() * available.length)];

        // Return as an array (for compatibility with existing code)
        return [pick];
      }
