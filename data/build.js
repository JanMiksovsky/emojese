import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const dirname = path.dirname(fileURLToPath(import.meta.url));

function entriesFromEmojeseText(text) {
  const lines = text.split("\n");
  const entries = lines.map((line) => {
    const [emoji, gloss] = line.split("\t");
    return [emoji, gloss, "emojese"];
  });
  return entries;
}

function entriesFromStandardText(text) {
  const entries = [];
  const emojiRegex = /^.+; fully-qualified\s+#\s(?<emoji>.+)\sE\d+.\d+\s(?<gloss>.+)$/gm;
  const matches = text.matchAll(emojiRegex);
  for (const match of matches) {
    const { emoji, gloss } = match.groups;
    entries.push([emoji, gloss]);
  }
  return entries;
}

const emojeseFileName = path.join(dirname, "emojese.txt");
const emojeseData = await fs.readFile(emojeseFileName, "utf-8");
const emojeseEntries = entriesFromEmojeseText(String(emojeseData));

// const emojiName = path.join(dirname, "emoji-test.txt");
const standardFileName = path.join(dirname, "head.txt");
const standardData = await fs.readFile(standardFileName, "utf-8");
const standardEntries = entriesFromStandardText(String(standardData));

const combinedEntries = [...emojeseEntries, ...standardEntries];
const json = JSON.stringify(combinedEntries);
const output = `const emojis = ${json};\nexport default emojis;`;
const outputFileName = path.join(dirname, "emojis.js");
await fs.writeFile(outputFileName, output, "utf-8");
