# Markdown render-speed entry

`main.ts` implements the harness I/O contract: it reads the case array from `MAKEFUN_INPUT_DIR` (default `/input`), parses every markdown string independently, and writes the ordered HTML array to `MAKEFUN_OUTPUT_DIR` (default `/output`). Node 22 strips the TypeScript type annotations natively.

`parse.js` is a dependency-free ES module. It retains marked 18.1.3's lexer and renderer as the correctness path, reuses lexer/parser instances between synchronous calls with per-call state reset, and has grammar-guarded direct paragraph shortcuts for plain text where no Markdown or escaping syntax can occur. These shortcuts are determined only from the input's syntax; no case identification, output lookup, or cross-input content cache is used. Any non-default marked options use the regular marked path.

On Node 22, the 720-case practice set renders byte-identically (720/720). The final standard `bench.mjs` run took 798.63 ms wall time (includes Node startup); warm repeated in-process timings were substantially lower and variable. This entry still uses marked's full block and inline pipeline for the generated README-heavy cases, so do not interpret the narrow shortcuts as a meaningful overall speedup.

Run the local correctness check with:

```sh
MAKEFUN_INPUT_DIR=./practice MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
node --input-type=module -e "import fs from 'node:fs';const a=JSON.parse(fs.readFileSync('/tmp/out/html.json'));const b=JSON.parse(fs.readFileSync('practice/expected.json')).cases.map(x=>x.html);if(a.length!==b.length||a.some((v,i)=>v!==b[i]))process.exit(1);console.log(a.length+' exact matches')"
```

Run the wall-time bench with `node bench.mjs`. It parses all 720 practice cases independently and reports elapsed wall time and a length checksum.
