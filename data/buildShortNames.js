import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const dirname = path.dirname(fileURLToPath(import.meta.url));

function shortNamesMapFromData(data) {
  const map = {};
  for (const entry of data) {
    const { unified, short_names } = entry;
    const hexCodePoints = unified.split("-");
    const codePoints = hexCodePoints.map((hexCodePoint) =>
      Number.parseInt(hexCodePoint, 16)
    );
    const emoji = String.fromCodePoint(...codePoints);
    for (const shortName of short_names) {
      const normalizedName = shortName.replace(/[-]/g, "_");
      map[normalizedName] = emoji;
    }
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

const json = JSON.stringify(shortNamesMap);
const output = `export default ${json};`;
const outputFileName = path.join(dirname, "shortNames.js");
await fs.writeFile(outputFileName, output, "utf-8");
