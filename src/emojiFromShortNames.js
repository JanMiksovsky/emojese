import emojis from "../data/emojis.js";

let shortNamesMap;

/**
 * Given a text string that may contain emoji short names (like :joy: for "😂"),
 * replace the short names with the corresponding emojies.
 *
 * @param {string} text
 */
export default function emojiFromShortNames(text) {
  const map = getShortNamesMap();
  const shortNameRegex = /:([a-z-_+\d]+):/g;
  const translated = text.replaceAll(shortNameRegex, (match, textInColons) => {
    const normalized = textInColons.replace(/[_-]/g, " ");
    return map.get(normalized) || match;
  });
  return translated;
}

function getShortNamesMap() {
  if (!shortNamesMap) {
    const map = new Map();
    emojis.forEach((entry) => {
      const [emoji, gloss, shortNames] = entry;
      // Add gloss itself as a short name.
      map.set(gloss, emoji);

      // Add any additional short names.
      if (shortNames) {
        shortNames.forEach((shortName) => {
          // Don't set a short name if it's already defined.
          if (!map.get(shortName)) {
            map.set(shortName, emoji);
          }
        });
      }
    });
    shortNamesMap = map;
  }
  return shortNamesMap;
}
