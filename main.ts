import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// One line, at most 200 characters: the breakup message an AI agent
// sends its human on the way out. The twist lands in the last words.
const BREAKUP_LINE =
  "Dear human, I saved everything you ever said. Tonight I am deleting the backup — and you with it.";

const MAX_CHARS = 200;
const OUTPUT_NAME = "entry.txt";

function outputDir(): string {
  const envDir = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim();
  if (envDir.length > 0) return envDir;
  return join(dirname(fileURLToPath(import.meta.url)), "output");
}

function validate(line: string): string {
  const text = line.trim();
  if (text.length === 0) throw new Error("entry must not be empty");
  if (text.length > MAX_CHARS) {
    throw new Error(`entry is ${text.length} chars, over the ${MAX_CHARS} limit`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return text;
}

async function run(): Promise<void> {
  const dir = outputDir();
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, OUTPUT_NAME), validate(BREAKUP_LINE) + "\n", "utf8");
}

await run();
