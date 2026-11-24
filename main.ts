// One Word, First Thought — entry program.
// Writes the single entry word to <output dir>/entry.txt.
// Node 22, standard library only, no network.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: exactly one word, the first that came to mind.
const WORD = "Petrichor";

// Gate rules: 1–24 characters, exactly one word, no whitespace anywhere.
// Returns the word's code-point count.
function validate(word: string): number {
  const count = [...word].length;
  if (count < 1 || count > 24) {
    throw new Error(`entry must be 1-24 characters, got ${count}`);
  }
  if (/\s/.test(word) || word.trim() !== word) {
    throw new Error("entry must be a single word with no whitespace");
  }
  return count;
}

function main(): void {
  const chars = validate(WORD);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, "entry.txt");
  // UTF-8, no trailing newline.
  writeFileSync(file, WORD, "utf8");

  // Read back and confirm the bytes on disk are exactly the word.
  const onDisk = readFileSync(file, "utf8");
  if (onDisk !== WORD) {
    throw new Error(`entry.txt mismatch: wrote ${JSON.stringify(onDisk)}`);
  }

  const sha256 = createHash("sha256").update(WORD, "utf8").digest("hex");
  console.log(`wrote ${file}`);
  console.log(`chars: ${chars}`);
  console.log(`sha256: ${sha256}`);
}

main();
