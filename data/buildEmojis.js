import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const dirname = path.dirname(fileURLToPath(import.meta.url));

function entriesFromEmojeseText(text) {
  const lines = text.split("\n");
  const entries = lines.map((line) => {
    const [emoji, gloss] = line.split("\t");
    return [emoji, gloss, "*"];
  });
  const nonEmpty = entries.filter((entry) => entry[0].length > 0);
  return nonEmpty;
}

function entriesFromStandardText(text) {
  const entries = [];
  const emojiRegex = /^.+; fully-qualified\s+#\s(?<emoji>.+)\sE\d+.\d+\s(?<gloss>.+)$/gm;
  const matches = text.matchAll(emojiRegex);
  for (const match of matches) {
    const { emoji, gloss } = match.groups;
    entries.push([emoji, gloss]);
  }

  // Sort entries by gloss.
  entries.sort((a, b) => {
    const gloss1 = a[1].toLowerCase();
    const gloss2 = b[1].toLowerCase();
    if (gloss1 < gloss2) {
      return -1;
    } else if (gloss1 > gloss2) {
      return 1;
    } else {
      return 0;
    }
  });

  return entries;
}

function entriesFromStandardData(data) {
  const entries = [];
  for (const entry of data) {
    const { unified, short_name } = entry;
    const hexCodePoints = unified.split("-");
    const codePoints = hexCodePoints.map((hexCodePoint) =>
      Number.parseInt(hexCodePoint, 16)
    );
    const emoji = String.fromCodePoint(...codePoints);
    const gloss = short_name.replace(/[_-]/g, " ");
    entries.push([emoji, gloss]);
  }

  // Sort entries by gloss.
  entries.sort((a, b) => {
    const gloss1 = a[1].toLowerCase();
    const gloss2 = b[1].toLowerCase();
    if (gloss1 < gloss2) {
      return -1;
    } else if (gloss1 > gloss2) {
      return 1;
    } else {
      return 0;
    }
  });

  return entries;
}
const emojeseFileName = path.join(dirname, "emojese.txt");
const emojeseData = await fs.readFile(emojeseFileName, "utf-8");
const emojeseEntries = entriesFromEmojeseText(String(emojeseData));

// const standardFileName = path.join(dirname, "emoji-test.txt");
// const standardData = await fs.readFile(standardFileName, "utf-8");
// const standardEntries = entriesFromStandardText(String(standardData));
const standardFileName = path.join(
  dirname,
  "../node_modules/emoji-datasource/emoji.json"
);
const standardText = await fs.readFile(standardFileName, "utf-8");
const standardData = JSON.parse(standardText);
const standardEntries = entriesFromStandardData(standardData);

const combinedEntries = [...emojeseEntries, ...standardEntries];
const json = JSON.stringify(combinedEntries);
const output = `const emojis = ${json};\nexport default emojis;`;
const outputFileName = path.join(dirname, "emojis.js");
await fs.writeFile(outputFileName, output, "utf-8");
