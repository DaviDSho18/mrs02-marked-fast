import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { parse } from './parse.js';

const inputDir = process.env.MAKEFUN_INPUT_DIR || './practice';
const cases = JSON.parse(readFileSync(`${inputDir}/cases.json`, 'utf8'));
let checksum = 0;
const start = performance.now();
for (const item of cases) checksum += parse(item.markdown).length;
const elapsed = performance.now() - start;
console.log(`${cases.length} cases: ${elapsed.toFixed(2)} ms wall; checksum ${checksum}`);
