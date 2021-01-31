import emojis from "../data/emojis.js";
import {
  defaultState,
  ids,
  render,
  setState,
  state,
  stateEffects,
  template,
} from "../node_modules/elix/src/base/internal.js";
import ResizeMixin from "../node_modules/elix/src/base/ResizeMixin.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";
import customEmoji from "./customEmoji.js";
import graphemer from "./graphemer.js";

let emojiMap;
let maxGraphemeCount;

const punctuation = [" ", ",", ";", "!", "?", ".", "(", ")"];

export default class EmojeseGloss extends ResizeMixin(ReactiveElement) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      enableCustomEmoji: false,
      fontSize: "",
      value: "",
    });
  }

  get enableCustomEmoji() {
    return this[state].enableCustomEmoji;
  }
  set enableCustomEmoji(enableCustomEmoji) {
    this[setState]({ enableCustomEmoji });
  }

  [render](changed) {
    super[render](changed);

    if (changed && (changed.fontSize || changed.value)) {
      setTimeout(() => {
        // Apply gloss and font size at same time.
        const { fontSize, value } = this[state];
        this[ids].gloss.innerHTML = gloss(value, this[state].enableCustomEmoji);
        this[ids].gloss.style.fontSize = fontSize;
      }, 100);
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects]
      ? super[stateEffects](state, changed)
      : {};

    if (changed.clientHeight || changed.clientWidth || changed.value) {
      const fontSize = pickFontSize(state.clientWidth, state.value);
      Object.assign(effects, { fontSize });
    }

    return effects;
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          align-items: center;
          display: grid;
        }

        #gloss {
          display: flex;
          flex-wrap: wrap;
          font-size: 40px;
          justify-content: center;
          row-gap: 0.2em;
        }

        .word {
          display: inline-grid;
          grid-template-rows: auto auto;
          justify-items: center;
        }

        .base {
          line-height: 1em;
          height: 1em;
        }

        .base img {
          height: 100%;
          /* Want to use object-fit, but Mobile Safari has problems with it. */
          /* object-fit: contain; */
          /* object-position: center; */
          width: 1em;
        }

        /* SVGs from The Noun Project are a little short */
        .base img[src$=".svg"] {
          /*
           * We want to set fill: #444 on the SVG in the img.
           * We can approximate that with a CSS filter using the tool at
           * https://codepen.io/sosuke/pen/Pjoqqp
           */
          filter: invert(25%) sepia(23%) saturate(20%) hue-rotate(326deg) brightness(93%) contrast(93%);
          transform: scale(1.25);
          transform-origin: top;
        }

        .ruby {
          color: #666;
          font-size: 0.45em;
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

// Heuristic to pick font size for the given client width and text. Up to a
// point, the narrower the window and/or the longer the text, the smaller the
// font will be.
function pickFontSize(width, text) {
  const removeSpaces = text.replaceAll(" ", "");
  const length = graphemer.splitGraphemes(removeSpaces).length;
  const averageGraphemeWidth = 50; // Just a guess, in pixels
  const graphemesPerLine = width / averageGraphemeWidth;
  const maxFontSize = 40; // In pixels
  const minFontSize = 28;
  const beginRampLength = graphemesPerLine; // When do we start reducing size?
  const endRampLength = 3 * graphemesPerLine; // When do we stop reducing size?
  if (length <= graphemesPerLine || length <= beginRampLength) {
    return ""; // Let CSS define font size.
  } else if (length >= endRampLength) {
    return `${minFontSize}px`;
  } else {
    const rampFactor =
      (length - beginRampLength) / (endRampLength - beginRampLength);
    const fontSize = maxFontSize - rampFactor * (maxFontSize - minFontSize);
    return `${fontSize}px`;
  }
}

function createRuby(base, ruby, showCustomEmoji) {
  const custom = showCustomEmoji && customEmoji[base];
  const resolvedBase = custom || base;
  return `<div class="word">
    <div class="base">${resolvedBase || "&nbsp;"}</div>
    <div class="ruby">${ruby || "&nbsp;&nbsp;"}</div>
  </div>`;
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

function gloss(text, showCustomEmoji) {
  if (!text) {
    // Return default item.
    return createRuby("🖼️💬", "Emojese", showCustomEmoji);
  }

  const map = getEmojiMap();
  let unrecognized = "";
  let result = "";
  let remaining = graphemer.splitGraphemes(text);

  while (remaining.length > 0) {
    const match = longestMatch(map, remaining);
    if (match) {
      if (unrecognized) {
        result += createRuby(unrecognized, "", showCustomEmoji);
        unrecognized = "";
      }

      const { text, meaning, rest } = match;
      result += createRuby(text, meaning, showCustomEmoji);

      // Work on rest of graphemes.
      remaining = rest;
    } else {
      // No match; add to unrecognized text under construction.
      unrecognized += remaining[0];
      remaining = remaining.slice(1);
    }
  }

  if (unrecognized) {
    result += createRuby(unrecognized, "", showCustomEmoji);
  }

  return result;
}

// Find the longest match in the map
function longestMatch(map, graphemes) {
  for (let length = maxGraphemeCount; length > 0; length--) {
    const text = graphemes.slice(0, length).join("");
    const glosses = map.get(text);
    if (glosses) {
      const [gloss, preferred] = glosses.split("/");
      const meaning = preferred || gloss;
      const rest = graphemes.slice(length);
      return { text, meaning, rest };
    }
  }
  return null;
}

customElements.define("emojese-gloss", EmojeseGloss);
