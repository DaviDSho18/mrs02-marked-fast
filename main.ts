import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from './parse.js';

const inputRoot = process.env.MAKEFUN_INPUT_DIR || '/input';
const outputRoot = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const inputs = JSON.parse(readFileSync(join(inputRoot, 'cases.json'), 'utf8')) as Array<{ id: string; markdown: string }>;
const rendered: string[] = new Array(inputs.length);

for (let index = 0; index < inputs.length; index++) {
  rendered[index] = parse(inputs[index].markdown);
}

writeFileSync(join(outputRoot, 'html.json'), JSON.stringify(rendered));
