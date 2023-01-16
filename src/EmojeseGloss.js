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
import experimental from "./experimentalEmoji.js";
import graphemer from "./graphemer.js";

let emojiMap;
let maxGraphemeCount;

export default class EmojeseGloss extends ResizeMixin(ReactiveElement) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      experimentalEmoji: false,
      fontSize: "",
      value: "",
    });
  }

  get experimentalEmoji() {
    return this[state].experimentalEmoji;
  }
  set experimentalEmoji(experimentalEmoji) {
    this[setState]({ experimentalEmoji });
  }

  [render](changed) {
    super[render](changed);

    if (changed.experimentalEmoji || changed.fontSize || changed.value) {
      setTimeout(() => {
        // Apply gloss and font size at same time.
        const { fontSize, value } = this[state];
        this[ids].gloss.innerHTML = gloss(value, this[state].experimentalEmoji);
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

        .word.noRuby {
          margin-left: 0.2em;
          margin-right: 0.2em;
        }

        .base {
          line-height: 1em;
          height: 1em;
        }

        .base div {
          display: inline-block;
          height: 100%;
          vertical-align: top;
        }

        .base img {
          height: 100%;
          /* Want to use object-fit, but Mobile Safari has problems with it. */
          /* object-fit: contain; */
          /* object-position: center; */
          width: 1em;
        }

        .base img[src$=".svg"]:not(.color) {
          /*
          * We want to set fill: #444 on the SVG in the img.
          * We can approximate that with a CSS filter using the tool at
          * https://codepen.io/sosuke/pen/Pjoqqp
          */
          filter: invert(25%) sepia(23%) saturate(20%) hue-rotate(326deg) brightness(93%) contrast(93%);
          /* SVGs from The Noun Project are a little short */
          transform: scale(1.1);
          transform-origin: top;
        }

        .ruby {
          color: #666;
          font-size: 0.45em;
        }
      </style>
      <div id="gloss">
        <!-- Preload with default text. -->
        <div class="word hasRuby">
          <div class="base">🖼️💬</div>
          <div class="ruby">Emojese</div>
        </div>        
      </div>
    `;
  }

  get value() {
    return this[state].value;
  }
  set value(value) {
    this[setState]({ value });
  }
}

function applyExperimentalEmoji(text) {
  // HACK: To avoid applying experimental "day" emoji in words like "Monday" ("1 Day"),
  // don't apply emoji if the text starts with a digit.
  // if (text.match(/^\d/)) {
  //   return text;
  // }

  // For now, assume there is no more than one experimental emoji in the text.
  for (const key in experimental) {
    const index = text.indexOf(key);
    if (index >= 0) {
      // Found an experimental emoji.
      const value = experimental[key];
      const start = text.slice(0, index);
      const end = text.slice(index + key.length);
      let result = "";
      if (start) {
        result += `<div>${start}</div>`;
      }
      result += `<div>${value}</div>`;
      if (end) {
        result += `<div>${end}</div>`;
      }
      return result;
    }
  }
  return text;
}

function createRuby(base, ruby, showExperimentalEmoji) {
  const displayBase = showExperimentalEmoji
    ? applyExperimentalEmoji(base)
    : base;

  // If there's no ruby, add space afterwards so the next word doesn't run into
  // this one.
  const wordClass = ruby ? "hasRuby" : "noRuby";

  return `<div class="word ${wordClass}">
    <div class="base">${displayBase || "&nbsp;"}</div>
    <div class="ruby">${ruby || "&nbsp;"}</div>
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

customElements.define("emojese-gloss", EmojeseGloss);
