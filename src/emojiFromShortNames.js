import shortNamesMap from "../data/shortNames.js";

/**
 * Given a text string that may contain emoji short names (like :joy: for "😂"),
 * replace the short names with the corresponding emojies.
 *
 * @param {string} text
 */
export default function emojiFromShortNames(text) {
  const shortNameRegex = /:([a-z-_+\d]+):/g;
  const translated = text.replace(shortNameRegex, (match, textInColons) => {
    const normalized = textInColons.replace(/[-]/g, "_");
    return shortNamesMap[normalized] || match;
  });
  return translated;
}
