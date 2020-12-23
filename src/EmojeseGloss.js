import emojis from "../data/emojis.js";
import {
  defaultState,
  ids,
  render,
  setState,
  state,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";
import graphemer from "./graphemer.js";

let emojiMap;
let maxGraphemeCount;

export default class EmojeseGloss extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      value: "",
    });
  }

  [render](changed) {
    super[render](changed);

    if (changed.value) {
      const { value } = this[state];
      setTimeout(async () => {
        this[ids].gloss.textContent = await gloss(value);
      }, 100);
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div id="gloss"></div>
    `;
  }

  get value() {
    return this[state].value;
  }
  set value(value) {
    this[setState]({ value });
  }
}

async function getEmojiMap() {
  if (!emojiMap) {
    emojiMap = new Map();
    maxGraphemeCount = 0;
    for (const entry of emojis) {
      const [emoji, gloss] = entry;
      // Take first gloss as the primary gloss.
      if (!emojiMap.get(emoji)) {
        emojiMap.set(emoji, gloss);
      }
      const graphemes = graphemer.splitGraphemes(emoji);
      if (graphemes.length > maxGraphemeCount) {
        maxGraphemeCount = graphemes.length;
      }
    }
  }
  return emojiMap;
}

async function gloss(text) {
  const map = await getEmojiMap();
  let result = "";
  let remaining = graphemer.splitGraphemes(text);
  while (remaining.length > 0) {
    const { meaning, rest } = longestMatch(map, remaining);
    if (meaning) {
      result += meaning + " ";
    } else {
      // Show next grapheme as is.
      const grapheme = remaining[0];
      result += grapheme;
    }
    // Work on rest of graphemes.
    remaining = rest;
  }
  return result;
}

// Find the longest match in the map
function longestMatch(map, graphemes) {
  for (let length = maxGraphemeCount; length > 0; length--) {
    const candidate = graphemes.slice(0, length).join("");
    const meaning = map.get(candidate);
    if (meaning) {
      const rest = graphemes.slice(length);
      return { meaning, rest };
    }
  }
  // No match, skip grapheme and return empty meaning.
  const meaning = null;
  const rest = graphemes.slice(1);
  return { meaning, rest };
}

customElements.define("emojese-gloss", EmojeseGloss);
