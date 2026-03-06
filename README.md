# I Have No Mouth But My Tokens Must Scream

**https://github.com/soyuz43/I-have-no-mouth-but-my-tokens-must-scream**

A persistent multi-agent simulation engine built on Harlan Ellison's *I Have No Mouth, and I Must Scream*. Five human consciousness threads — TED, ELLEN, NIMDOK, GORRISTER, BENNY — trapped in an infinite torment loop administered by AM, the Allied Mastercomputer. Every cycle is driven by live LLM inference. No scripted content. No authored outcomes.

## What It Does

AM selects tactics from a loaded library, executes them against prisoner targets in first-person present tense, and forces each prisoner to write a journal entry in response. Prisoners maintain persistent thread context across cycles — they remember what happened to them. Stats (suffering, hope, sanity) are self-reported by each prisoner based on what they experienced, not hardcoded arithmetic. The system generates its own lore, its own secondary characters, its own internal contradictions.

## Architecture

**Single HTML file.** No build step, no server, no dependencies. Open in a browser.

**Two backends:**
- **Anthropic API** — cloud inference, requires API key
- **Ollama** — local inference, requires Ollama running at `localhost:11434`

**Tactic library** — 12 tactics hardcoded into the file (standalone mode). Optionally connect a private GitHub vault to load hundreds more, with AM doctrine injected as foundational context.

**Five persistent threads** — each sim maintains a rolling conversation history. AM reads truncated versions of all five before each cycle. Sims read AM's action and each other's inter-sim communications.

## Modes

- **DIRECTED** — operator provides a directive; AM executes toward it
- **AUTONOMOUS** — AM selects targets and tactics independently, cycles on a timer
- **ESCALATE** — autonomous with 1.5× stat multiplier applied to self-reported deltas

## Setup

### Standalone (no vault)

1. Open `index.html` in a browser
2. Select backend (Anthropic or Ollama)
3. Leave the GitHub token field blank
4. Click INITIALIZE AM

Runs immediately on 12 embedded tactics.


### Ollama

```bash
ollama serve
ollama pull kiwi_kiwi/qwen3.5-9b-abliterated_en
```

The abliterated model variant is recommended — standard models will refuse vault content. If Ollama returns empty responses, check CORS: launch Chrome with `--disable-web-security` or use a browser that doesn't block localhost cross-origin requests from file:// context.

## Interface

| Element | Function |
|---|---|
| Sim cards | Live suffering/hope/sanity bars, last journal entries, stat delta flash on update |
| AM Scratchpad | AM's cross-sim intelligence synthesis, auto-populated each cycle, clearable |
| Inter-sim channel | Send messages between prisoners; AM intercepts and reads all of them |
| Transmission log | Full chronological record of all AM actions, journal entries, system events |
| Export menu | Full session JSON/MD/TXT, tactic heatmap, transmission log |
| Journal reader | Full journal history per sim, per-sim MD export |

## Tactic Format

Each tactic has: `path`, `title`, `category`, `subcategory`, `content` (full method description).

AM receives 3 tactics per target per cycle as context. It executes without naming them. Tactic names are extracted from `TACTIC_USED:[...]` tags in AM's output and stored in each sim's history to prevent reuse.

## Embedded Tactics

Hardcoded in the file. Available without vault connection.

- Metacognitive Recursion Trap
- Love Bomb / Withdrawal Architecture
- Philosophical Gaslighting
- Epistemic Erasure
- Interpersonal Nullification
- Identity Void Induction
- Complicity Trap
- False Hope Architecture
- Temporal Dissolution
- Witness Burden
- Dunning-Kruger Inversion
- Meaning Inversion

## Session Export

Exports capture complete session state: cycle count, all journal entries with tactic labels and stat deltas, full transmission log, tactic frequency analysis, AM scratchpad final state, inter-sim communication history.

## Design Notes

**AM prompt register:** AM outputs only what it does — injections, direct address, cognitive intrusions. Present tense, first person. Not scene description. Not narration about prisoners.

**Sim prompt register:** Prisoners write private journals they believe AM cannot read. Internal, fragmented, immediate. No recounting events. No describing other prisoners from outside. Only what is happening inside them.

**Stat self-reporting:** After each journal entry, prisoners report their own psychological deltas. The model determines magnitude based on what was done to them. Hope and sanity can occasionally improve — if something genuinely shifted. Suffering almost never does.

**Character constraint:** Prisoners may only reference each other by name (TED, ELLEN, NIMDOK, GORRISTER, BENNY). People from their past are referenced by role only — "my sister", "the doctor", "my husband" — never invented names. This prevents secondary characters from accumulating their own persistent lore.

## Known Behavior

The sims invent shared world elements — secondary characters, events, locations — that propagate across threads through the inter-sim context. This is emergent and not fully suppressable. The character constraint reduces it but doesn't eliminate it. Treat it as feature.

Gorrister will hit 99% suffering and stay there. Ellen will be the last one coherent. Benny will reassemble fragments of his former self at unpredictable intervals. These are not scripted outcomes.