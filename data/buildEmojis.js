import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const dirname = path.dirname(fileURLToPath(import.meta.url));

function entriesFromEmojeseText(text) {
  const lines = text.split("\n");
  const entries = lines.map((line) => {
    const [emoji, gloss] = line.split("\t");
    const shortNames = getShortNames(emoji, gloss);
    return [emoji, gloss, shortNames, "*"];
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
    const entry = [emoji, gloss];
    const shortNames = getShortNames(emoji, gloss);
    if (shortNames.length > 0) {
      entry.push(shortNames);
    }
    entries.push(entry);
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

// Add any short names for this emoji to the entry. If the existing gloss
// appears in the list of short names (with spaces replaced by hyphens or
// underscores), remove it from the list to avoid duplication.
function getShortNames(emoji, gloss) {
  const shortNames = [];
  const lowercaseGloss = gloss.toLowerCase();
  const shortNamesForEmoji = shortNamesMap.get(emoji) || [];
  shortNamesForEmoji.forEach((shortName) => {
    const normalizedName = shortName.replace(/[_-]/g, " ");
    if (
      normalizedName !== lowercaseGloss &&
      !shortNames.includes(normalizedName)
    ) {
      shortNames.push(normalizedName);
    }
  });
  return shortNames;
}

function shortNamesMapFromData(data) {
  const map = new Map();
  for (const entry of data) {
    const { unified, short_names } = entry;
    const hexCodePoints = unified.split("-");
    const codePoints = hexCodePoints.map((hexCodePoint) =>
      Number.parseInt(hexCodePoint, 16)
    );
    const emoji = String.fromCodePoint(...codePoints);
    map.set(emoji, short_names);
  }
  return map;
}

// We use the emoji-datasource package at https://github.com/iamcal/emoji-data
// to obtain short names for the emojis.
const shortNameFileName = path.join(
  dirname,
  "../node_modules/emoji-datasource/emoji.json"
);
const shortNameText = await fs.readFile(shortNameFileName, "utf-8");
const shortNameData = JSON.parse(shortNameText);
const shortNamesMap = shortNamesMapFromData(shortNameData);

// Our own emojese.txt contains the canonical Emojese definitions.
const emojeseFileName = path.join(dirname, "emojese.txt");
const emojeseData = await fs.readFile(emojeseFileName, "utf-8");
const emojeseEntries = entriesFromEmojeseText(String(emojeseData));

// We use the emoji-test.txt file from https://unicode.org/Public/emoji/13.1/
// as the definitive source for the standard emojis and their names.
const standardFileName = path.join(dirname, "emoji-test.txt");
const standardData = await fs.readFile(standardFileName, "utf-8");
const standardEntries = entriesFromStandardText(String(standardData));

const combinedEntries = [...emojeseEntries, ...standardEntries];
const json = JSON.stringify(combinedEntries);
const output = `const emojis = ${json};\nexport default emojis;`;
const outputFileName = path.join(dirname, "emojis.js");
await fs.writeFile(outputFileName, output, "utf-8");
