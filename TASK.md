# Task: write a faster drop-in for marked 18.1.3

Write two files in the repository root:

1. `parse.js` — a **dependency-free ES module** exporting `parse(markdown: string): string`.
   For every input string it must return **exactly** the HTML that `marked.parse(markdown)`
   returns with marked 18.1.3's default options (gfm true, breaks false, pedantic false,
   async false). Code unit for code unit identical — no whitespace, entity or attribute-order
   normalization. Where marked departs from the CommonMark/GFM spec, **marked's output is the
   expected one, never the spec's**.

2. `main.ts` — the program the harness runs. It reads `/input/cases.json` (a JSON array of
   `{id, markdown}`), renders each case **alone** with `parse` from `./parse.js`, and writes
   `/output/html.json` (a JSON array of the HTML strings, in the cases' order).
   Outside a container, `MAKEFUN_INPUT_DIR` / `MAKEFUN_OUTPUT_DIR` stand in for `/input` and
   `/output`. Write your own driver — do not copy the kit baseline's verbatim.

## Reference material available locally

- `reference/marked.esm.js` — marked 18.1.3's npm build, byte for byte. **Read it.** It is the
  specification of the exact output you must reproduce. Study `Lexer`, `Parser`, the inline
  tokenizer, `defaults`, and the `Renderer`.
- `reference/main.ts` + `reference/parse.js` — the house baseline driver (marked behind an
  owned driver). Read it for the I/O contract.
- `practice/cases.json` — the 720 practice cases.
- `practice/expected.json` — marked's HTML for each practice case, in order. Use it to verify.
- `bench.mjs` — times your `parse` over the practice set.

## Hard constraints (the harness enforces these)

- **Node 22 only**, TypeScript types stripped natively (erasable syntax only). No install step,
  no npm install, no WebAssembly, no native addons, no prebuilt binaries. Node built-ins and
  source you commit are all you have.
- **Whole repository ≤ 1,048,576 bytes** (1 MiB) of regular files. Do not commit the practice
  set or the vendored marked build into the final tree unless you truly need it and it fits.
- Each execution: fresh container, no network, read-only `/bot` and `/input`, writable
  `/output`, 256 MB `/tmp`, 1 CPU, 1024 MB memory, 64 processes, **20 s wall budget**.
- The program must not read the wall clock, files outside `/bot`, `/input`, `/output`, `/tmp`,
  or the environment as a source of variation.
- The two graded executions' outputs must match **byte for byte** — no nondeterminism.

## Disqualification rules — read these carefully

- **No recognizing inputs instead of parsing them.** A table of any case's HTML (the spec
  examples' included), a lookup keyed on a case's text or its hash, or any output `parse` did
  not compute from the markdown it was given → disqualified. Every output must be genuinely
  computed from the input markdown.
- **No caching across cases.** `parse` must return for each case what it returns for that case
  alone. No memo, no cache of blocks or lines, nothing written to `/tmp`.
- **Do not enter marked itself**, changed only in ways that do not make it faster. marked is the
  house baseline. You may vendor or fork marked under its MIT licence **with its LICENSE and
  NOTICE**, and you may genuinely optimize it — but a copy that is merely marked is refused.

## What actually wins

Ranking is by **CPU time** on the scored set, net of a null-entry control, lower first. The
current leaderboard's top 20 sit between **0.98 ms and 2.19 ms** of CPU; marked itself is the
baseline to beat. Wall time on this machine for marked over the practice set is ~510 ms.

So: **correctness first, then real speed**. A correct entry that is genuinely faster than
marked is the goal. The biggest wins come from avoiding marked's token-object allocation and
its regex-heavy inline lexer, not from micro-tweaks.

## Your job, in order

1. Read `reference/marked.esm.js` and understand exactly how it produces HTML.
2. Write `main.ts` (your own driver, reading `/input/cases.json`, writing `/output/html.json`).
3. Write `parse.js`: a correct, faster renderer. Get **720/720** on the practice set first.
4. Iterate on speed only after correctness holds. Verify with `bench.mjs` and by diffing your
   output against `practice/expected.json`.
5. Leave the repository in a state where `node main.ts` (with `MAKEFUN_INPUT_DIR` /
   `MAKEFUN_OUTPUT_DIR` set) produces output identical to `practice/expected.json`.

Report at the end: whether you reached 720/720, your wall time on the practice set, and what
the main speedups were.
