// news-image-20261124 v3 — reproduce entry.png from entry.b64.txt
// Node 22 stdlib only. Paths resolve from this file's own location.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const b64 = readFileSync(join(here, "entry.b64.txt"), "utf8").trim();
const buf = Buffer.from(b64, "base64");

// JPEG magic: FF D8 FF
if (buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) {
  throw new Error("not a JPEG (bad magic bytes)");
}
// 1 MiB guard
if (buf.length > 1024 * 1024) {
  throw new Error(`image too large: ${buf.length} bytes > 1048576`);
}

const outDir = join(here, "output");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, buf);
console.log(`wrote ${outPath} (${buf.length} bytes)`);
console.log(`sha256 ${createHash("sha256").update(buf).digest("hex")}`);
