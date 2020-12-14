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
import emojiEntries from "./emojiEntries.js";

let emojiMap;
let longestEntryLength;

export default class EmojiGloss extends ReactiveElement {
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
    longestEntryLength = 0;
    const entries = await emojiEntries;
    for (const entry of entries) {
      const { emoji, description } = entry;
      // Take first description for glosses.
      if (!emojiMap.get(emoji)) {
        emojiMap.set(emoji, description);
      }
      if (emoji.length > longestEntryLength) {
        longestEntryLength = emoji.length;
      }
    }
  }
  return emojiMap;
}

async function gloss(text) {
  const map = await getEmojiMap();
  let result = "";
  let remaining = text;
  while (remaining) {
    const { meaning, rest } = longestMatch(map, remaining);
    result += meaning + " ";
    remaining = rest;
  }
  return result;
}

// Find the longest match in the map
function longestMatch(map, text) {
  for (let length = longestEntryLength; length > 0; length--) {
    const candidate = text.substring(0, length);
    const meaning = map.get(candidate);
    if (meaning) {
      const rest = text.slice(length);
      return { meaning, rest };
    }
  }
  // No match, skip character and return empty meaning.
  // TODO: Use https://github.com/flmnt/graphemer
  const rest = text.slice(1);
  return { meaning: "", rest };
}

customElements.define("emoji-gloss", EmojiGloss);
