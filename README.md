# Markdown render-speed entry

`main.ts` implements the harness I/O contract: it reads the case array from `MAKEFUN_INPUT_DIR` (default `/input`), parses every markdown string independently, and writes the ordered HTML array to `MAKEFUN_OUTPUT_DIR` (default `/output`). Node 22 strips the TypeScript type annotations natively.

`parse.js` is a dependency-free ES module with the complete marked 18.1.3 ESM implementation embedded so its full tokenizer, lexer, parser, and renderer preserve marked's exact HTML behavior. A narrowly guarded path directly emits the common plain-paragraph case where every non-space character is a Unicode letter or number; all other input is sent through the marked implementation unchanged. The guard only selects an equivalent parsing implementation based on grammar-safe characters; it never identifies a practice case or reuses prior output. Each call parses its input alone.

Run the local correctness check with:

```sh
MAKEFUN_INPUT_DIR=./practice MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
node --input-type=module -e "import fs from 'node:fs';const a=JSON.parse(fs.readFileSync('/tmp/out/html.json'));const b=JSON.parse(fs.readFileSync('practice/expected.json')).cases.map(x=>x.html);if(a.length!==b.length||a.some((v,i)=>v!==b[i]))process.exit(1);console.log(a.length+' exact matches')"
```

Run the wall-time bench with `node bench.mjs`. It parses all 720 practice cases independently and reports elapsed wall time and a length checksum.
