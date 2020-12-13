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
    const entries = await emojiEntries;
    for (const entry of entries) {
      const { emoji, description } = entry;
      // Take first description for glosses.
      if (!emojiMap.get(emoji)) {
        emojiMap.set(emoji, description);
      }
    }
  }
  return emojiMap;
}

async function gloss(text) {
  const map = await getEmojiMap();
  const mapped = [...text].map((character) => {
    const description = map.get(character);
    return description || character;
  });
  const result = mapped.join(" ");
  return result;
}

customElements.define("emoji-gloss", EmojiGloss);
