import AutoSizeTextarea from "../node_modules/elix/src/base/AutoSizeTextarea.js";
import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  rendered,
  state,
  stateEffects,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { fragmentFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import emojiFromShortNames from "./emojiFromShortNames.js";
import graphemer from "./graphemer.js";

export default class EmojeseTextarea extends AutoSizeTextarea {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      prefix: "",
    });
  }

  insertEmoji(emoji) {
    const { prefix } = this[state];
    // We want to preserve spaces at the end of the prefix.
    const endSpaceCount = prefix.length - prefix.trimRight().length;
    const endSpaces = endSpaceCount > 0 ? prefix.slice(-endSpaceCount) : "";
    const end = this.selectionStart;
    const start = end - prefix.length;
    this.setRangeText(emoji + endSpaces, start, end, "end");
  }

  get prefix() {
    return this[state].prefix;
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this.addEventListener("paste", (event) => {
        this[raiseChangeEvents] = true;
        const text = (event.clipboardData || window.clipboardData).getData(
          "text"
        );
        const translated = emojiFromShortNames(text);
        this.setRangeText(
          translated,
          this.selectionStart,
          this.selectionEnd,
          "end"
        );
        event.preventDefault();
        this[raiseChangeEvents] = false;
      });

      this[ids].inner.setAttribute(
        "aria-label",
        "Type a message, or paste one to read it"
      );
    }
  }

  [rendered](changed) {
    super[rendered](changed);

    if (changed.prefix && this[raiseChangeEvents]) {
      this.dispatchEvent(new CustomEvent("prefixchange"));
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects]
      ? super[stateEffects](state, changed)
      : {};

    if (changed.selectionEnd || changed.selectionStart || changed.value) {
      const prefix = getPrefixBeforeInsertionPoint(state);
      if (prefix !== null) {
        Object.assign(effects, { prefix });
      }
    }
    return effects;
  }

  get [template]() {
    const result = super[template];

    result.content.append(fragmentFrom.html`
      <style>
        #inner,
        #copyContainer {
          line-height: 1.3;
        }
      </style>
    `);

    return result;
  }
}

function getPrefixBeforeInsertionPoint(state) {
  const { selectionEnd, selectionStart, value } = state;
  if (selectionEnd === null || selectionStart === null || value === null) {
    return null;
  }
  const text = value.toLowerCase();
  let prefix = "";
  if (selectionStart === selectionEnd) {
    // Selection is an insertion point (not a proper selection).
    // See if we can find letters to the left. Ignore spaces.
    const left = text.substring(0, selectionStart);
    const split = graphemer.splitGraphemes(left);
    let letters = [];
    for (let i = split.length - 1; i >= 0; i--) {
      const c = split[i];
      if ((c >= "a" && c <= "z") || c === " ") {
        letters.unshift(c);
      } else {
        break;
      }
    }
    prefix = letters.join("");
  }
  // Don't count leading spaces in prefix.
  const trimmed = prefix.trimLeft();
  return trimmed;
}

customElements.define("emojese-textarea", EmojeseTextarea);
