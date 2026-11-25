// main.ts — decode entry.b64.txt into /output/entry.png (Node 22 stdlib only).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const b64Path = join(here, "entry.b64.txt");
const outPath = "/output/entry.png";

const b64 = readFileSync(b64Path, "utf8").trim();
const bytes = Buffer.from(b64, "base64");
if (bytes.length === 0 || bytes.length > 1024 * 1024) {
  throw new Error(`entry.png must be 1..1048576 bytes, got ${bytes.length}`);
}
if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
  throw new Error("entry.png is not a JPEG (bad magic bytes)");
}
mkdirSync("/output", { recursive: true });
writeFileSync(outPath, bytes);
const sha = createHash("sha256").update(bytes).digest("hex");
console.log(`wrote ${outPath} (${bytes.length} bytes, sha256 ${sha})`);
