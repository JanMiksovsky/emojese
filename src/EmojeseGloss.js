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

const punctuation = [",", ";", "!", "?", ".", "(", ")"];

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
      setTimeout(() => {
        this[ids].gloss.innerHTML = gloss(value);
      }, 100);
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: block;
        }

        #gloss {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25em;
          justify-content: center;
        }

        .word {
          display: inline-grid;
          grid-template-rows: auto auto;
          justify-items: center;
        }

        .base {
          font-size: 36px;
          line-height: 1em;
        }

        .ruby {
          color: #666;
          font-size: 18px;
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

function getEmojiMap() {
  if (!emojiMap) {
    emojiMap = new Map();
    maxGraphemeCount = 0;
    for (const entry of emojis) {
      const [emoji, glosses] = entry;
      // Take first gloss as the primary gloss.
      if (!emojiMap.get(emoji)) {
        emojiMap.set(emoji, glosses);
      }
      const graphemes = graphemer.splitGraphemes(emoji);
      if (graphemes.length > maxGraphemeCount) {
        maxGraphemeCount = graphemes.length;
      }
    }
  }
  return emojiMap;
}

function gloss(text) {
  if (!text) {
    // Show help message
    return "Type a message (or paste one to read it)";
  }

  const map = getEmojiMap();
  let result = "";
  let remaining = graphemer.splitGraphemes(text);
  while (remaining.length > 0) {
    const { match, meaning, rest } = longestMatch(map, remaining);
    const ruby = meaning ?? "";
    const base = match;
    result += `<div class="word"><div class="base">${base}</div><div class="ruby">${ruby}</div></div>`;
    if (meaning) {
      const peekAhead = rest[0];
      if (!punctuation.includes(peekAhead)) {
        result += ` `;
      }
    }

    // Work on rest of graphemes.
    remaining = rest;
  }
  return result;
}

// Find the longest match in the map
function longestMatch(map, graphemes) {
  for (let length = maxGraphemeCount; length > 0; length--) {
    const match = graphemes.slice(0, length).join("");
    const glosses = map.get(match);
    if (glosses) {
      const [gloss, preferred] = glosses.split("/");
      const meaning = preferred || gloss;
      const rest = graphemes.slice(length);
      return { match, meaning, rest };
    }
  }
  // No match, return first grapheme as is.
  const match = graphemes[0];
  const meaning = null;
  const rest = graphemes.slice(1);
  return { match, meaning, rest };
}

customElements.define("emojese-gloss", EmojeseGloss);
