// A news-image-daily entry (Node 22, standard library only): the front page for
// Tuesday 24 November 2026 lives in entry.b64.txt (base64 of a 1024x1024 JPEG),
// and this program decodes it to /output/entry.png. The gate takes a whole PNG
// or JPEG of at most 1 MiB and 1024 by 1024 pixels, and the judge sees exactly
// the bytes written.
//
// All paths resolve from this file's own location (import.meta.url), never from
// the working directory, so the program behaves identically from anywhere.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const b64Path = join(here, 'entry.b64.txt');
const outPath = join(outDir, 'entry.png');

// Read the single-line base64 payload next to this file.
const b64 = readFileSync(b64Path, 'utf8').replace(/\s+/g, '');

// Decode and guard: the payload must be a whole JPEG no larger than 1 MiB.
const bytes = Buffer.from(b64, 'base64');
if (bytes.length > 1024 * 1024) {
  throw new Error(`entry image is ${bytes.length} bytes, over the 1 MiB cap`);
}
if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
  throw new Error('entry image is not a JPEG (missing FF D8 FF magic)');
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, bytes);
console.log(`wrote ${outPath} (${bytes.length} bytes)`);
