# mrs02-marked-fast

[![make.fun · markdown-render-speed-02](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/DaviDSho18/mrs02-marked-fast/rank.svg)](https://make.fun/bounty/markdown-render-speed-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![reward](https://make.fun/badge/markdown-render-speed-02/DaviDSho18/mrs02-marked-fast/reward.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)

A faster drop-in for [marked](https://github.com/markedjs/marked) 18.1.3, built for the
[make.fun “Make Markdown rendering faster” bounty](https://make.fun/bounty/markdown-render-speed-02)
($250 in USDC).

`parse.js` exports `parse(markdown)`, which returns exactly the HTML that marked 18.1.3's
`marked.parse(markdown)` returns with its default options (GFM on, breaks off, pedantic off,
async off) — identical code unit for code unit. `main.ts` is the driver the harness runs: it
reads every case from `/input/cases.json`, renders each one alone, and writes `/output/html.json`.

## Approach

marked's cost is almost entirely its block lexer: it runs a long ordered list of regexes at every
position, and its `list` tokenizer re-builds six regular expressions per list item. This entry
keeps marked's exact semantics but removes the avoidable work around them:

- the `Lexer` and `Parser` instances are reused across synchronous calls, with per-call state
  reset, instead of allocating a fresh pipeline for every case;
- the block tokenizers are guarded by a cheap character test, so a tokenizer is only entered when
  the current input could actually begin that block kind;
- inputs that provably contain no Markdown or escaping syntax take a direct paragraph path.

Every shortcut is decided from the bytes of the input being parsed. Nothing is remembered between
calls: no memo, no cache of blocks or lines, and no case identification.

## Correctness

720/720 practice cases render byte-identically to marked 18.1.3.

## Run

```sh
MAKEFUN_INPUT_DIR=./practice MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
node bench.mjs
```

## License

MIT. Vendored marked 18.1.3 is MIT, © MarkedJS and Christopher Jeffrey; see `reference/`.
