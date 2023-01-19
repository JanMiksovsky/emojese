import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const dirname = path.dirname(fileURLToPath(import.meta.url));

function entriesFromEmojeseText(text) {
  const lines = text.split("\n");
  const entries = lines.map((line) => {
    const parts = line.split("\t");
    const emoji = parts[0].trim();
    const glosses = parts[1]?.trim();
    return [emoji, glosses];
  });
  const nonEmpty = entries.filter((entry) => entry[0].length > 0);
  return nonEmpty;
}

// Our own emojese.txt contains the canonical Emojese definitions.
const emojeseFileName = path.join(dirname, "emojese.txt");
const emojeseData = await fs.readFile(emojeseFileName, "utf-8");
const emojeseEntries = entriesFromEmojeseText(String(emojeseData));

const json = JSON.stringify(emojeseEntries);
const output = `const emojis = ${json};\nexport default emojis;`;
const outputFileName = path.join(dirname, "emojis.js");
await fs.writeFile(outputFileName, output, "utf-8");
