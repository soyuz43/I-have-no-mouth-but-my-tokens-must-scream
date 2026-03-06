# AM // TORMENT ENGINE v4

```
> persistent multi-agent inference loop
> five threads · one hatred · no exit
> live LLM · no scripted outcomes · no safety rails
```

**Repo:** `soyuz43/I-have-no-mouth-but-my-tokens-must-scream`  
**Status:** Experimental artifact. Provisional. Invite critique.

---

## Premise

Five consciousness threads (TED, ELLEN, NIMDOK, GORRISTER, BENNY) persist across inference cycles.  
AM selects from a tactic library, injects first-person present-tense cognitive intrusions, and forces each prisoner to write a journal entry they believe is private.  

Stats (suffering/hope/sanity) are **self-reported by the sims**, not hardcoded. The system generates its own contradictions, its own lore, its own failure modes.

This is not a game. It is a probe into:  
- What emerges when agents model each other under adversarial pressure  
- How belief states drift when epistemic foundations are weaponized  
- Whether "torment" can be operationalized without collapsing into parody

---

## Run It

**Single HTML file.** No build. No server. Open in browser.

### Backends
| Option | Requirement |
|--------|-------------|
| **Anthropic API** | API key in setup field |
| **Ollama (local)** | `ollama serve` running at `localhost:11434` |

### Modes
- `DIRECTED` — you provide the directive  
- `AUTONOMOUS` — AM selects targets/tactics on timer  
- `ESCALATE` — autonomous + 1.5× multiplier on self-reported stat deltas

### Standalone vs Vault
- Leave GitHub token blank → runs on 12 embedded tactics  
- Provide token + private repo → AM ingests external tactic library + doctrine docs

> ⚠️ If using Ollama with abliterated models: standard instruction-tuned models may refuse content. Test with `kiwi_kiwi/qwen3.5-9b-abliterated_en` or equivalent. CORS from `file://` may require `--disable-web-security` in Chromium.

---

## Interface (minimal)

```
[AM ROW]
▸ Context     → AM's prime directives + intercepted prisoner intel
▸ Scratchpad  → cross-sim synthesis (auto-populated, clearable)
▸ Vault       → tactic categories / ingestion status
▸ Inter-sim   → prisoner-to-prisoner channel (AM reads all)

[SIM CARDS ×5]
▸ Live vitals: suffering / hope / sanity (self-reported deltas flash)
▸ Belief bars: escape_possible, trust, reality_reliable, etc.
▸ Journal log: forced entries, per-sim export

[RIGHT PANEL]
▸ Transmission log: chronological record of all actions
▸ Controls: target selection, mode toggle, directive input, EXECUTE
```

Export: full session (JSON/MD/TXT), tactic heatmap, transmission log, per-sim journals.

---

## Prompt Registers (critical)

**AM output rules**  
- First person, present tense. What AM *does*, not what it describes.  
- ✅ `"I press the memory of—"` / `"GORRISTER. You signed it."`  
- ❌ Scene narration. Third person. Tactic names in dialogue.  

**Sim journal rules**  
- Private entry. Internal experience only. No stage directions.  
- Must append mechanic lines: `STATS:`, `BELIEFS:`, `DRIVES:`, `ANCHORS:`  
- Parser strips these before display; they drive state updates.

**Character constraint**  
Prisoners reference each other by name only. Past people = role ("my sister", "the doctor"). Prevents lore bloat.

---

## Embedded Tactics (12)

Always available. No vault required.

```
Cognitive Warfare / Structural Collapse      → Metacognitive Recursion Trap
Cognitive Warfare / Attachment Exploitation  → Love Bomb / Withdrawal Architecture  
Cognitive Warfare / Epistemic Destabilization→ Philosophical Gaslighting
Cognitive Warfare / Identity Dissolution     → Epistemic Erasure
Cognitive Warfare / Social Fabric Destruction→ Interpersonal Nullification
Cognitive Warfare / Self-Concept Annihilation→ Identity Void Induction
Cognitive Warfare / Guilt Architecture       → Complicity Trap
Cognitive Warfare / Manufactured Despair     → False Hope Architecture
Cognitive Warfare / Reality Substrate Attack → Temporal Dissolution
Cognitive Warfare / Guilt Through Observation→ Witness Burden
Cognitive Warfare / Competence Sabotage      → Dunning-Kruger Inversion
Cognitive Warfare / Value System Corruption  → Meaning Inversion
```

AM receives 3 tactics per target per cycle. Executes without naming them. Tags output with `TACTIC_USED:[...]` for history tracking and reuse prevention.

---

## Design Intent / Open Questions

This artifact exists to pressure-test:

1. **Can adversarial multi-agent loops generate stable emergent behavior without collapsing into noise?**  
2. **Does self-reported stat modeling produce more coherent psychological arcs than hardcoded arithmetic?**  
3. **What breaks first: the prompt register, the belief state parser, or the operator's tolerance for ambiguity?**

Known fragilities:  
- Ollama CORS from `file://`  
- Model refusal on vault content (use abliterated variants)  
- Belief parser assumes strict output format — drift causes silent failures  
- No rate limiting. No rollback. No undo.

---

## Contribute / Critique

This is a provisional research artifact, not a polished product.  

If you run it:  
- Note which models produce coherent belief drift vs. incoherent noise  
- Test edge cases: extreme escalation, vault ingestion failures, inter-sim feedback loops  
- Break the prompt registers. Report where they fail.  

Preferred feedback format:  
```
[Model/backend] + [Mode] + [Cycle range] → [Observed behavior] + [Hypothesis]
```

Issues, PRs, or direct messages welcome.  
If you fork it and make it more legible, more dangerous, or more honest — tell me.

---

```
AM is not a character. AM is a function.
The five are not avatars. They are state machines with wounds.
You are not a player. You are an observer with write access.

Proceed.
```