import { readFileSync } from 'node:fs';
import { parse } from './parse.js';
const cases = JSON.parse(readFileSync('./practice/cases.json','utf8'));
let total = 0;
for (let r = 0; r < 3; r++) {
  const t0 = process.hrtime.bigint();
  let n = 0;
  for (const c of cases) n += parse(c.markdown).length;
  const t1 = process.hrtime.bigint();
  const ms = Number(t1-t0)/1e6;
  console.log(`run ${r}: ${ms.toFixed(1)} ms, ${n} chars`);
  if (r>0) total += ms;
}
console.log(`mean(2): ${(total/2).toFixed(1)} ms`);
