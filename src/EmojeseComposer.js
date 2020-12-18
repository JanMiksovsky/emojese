import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  state,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";
import EmojiGloss from "./EmojiGloss.js";
import EmojiGrid from "./EmojiGrid.js";
import EmojiTextarea from "./EmojiTextarea.js";

// Force recognition of imports.
if (EmojiGloss || EmojiGrid || EmojiTextarea) {
}

const graphemer = new Graphemer();

export default class EmojeseComposer extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      filter: "",
      text: "",
      viewportHeight: null,
      viewportWidth: null,
    });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      // TODO: event name should be value-change
      this[ids].input.addEventListener("value-changed", () => {
        this[raiseChangeEvents] = true;
        handleTextInput(this);
        this[raiseChangeEvents] = false;
      });

      this[ids].input.addEventListener("keydown", (event) => {
        this[raiseChangeEvents] = true;
        const handled = handleInputKeydown(this, event);
        if (handled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        this[raiseChangeEvents] = false;
      });

      this[ids].shareButton.addEventListener("click", async () => {
        this[raiseChangeEvents] = true;
        const { text } = this[state];
        const canShare = navigator.canShare({ text });
        if (canShare) {
          try {
            await navigator.share({ text });
          } catch (error) {}
        }
        this[raiseChangeEvents] = false;
      });

      if (!navigator.share) {
        this[ids].shareButton.disabled = true;
      }

      this[ids].copyButton.addEventListener("click", async () => {
        this[raiseChangeEvents] = true;
        const { text } = this[state];
        await navigator.clipboard.writeText(text);
        this[raiseChangeEvents] = false;
      });

      this[ids].grid.addEventListener("emoji-click", (event) => {
        addToInput(this, event.detail.emoji, event.detail.gloss);
      });
      this[ids].grid.addEventListener("mousedown", (event) => {
        event.preventDefault(); // Keep focus on input.
      });

      window.visualViewport.addEventListener("resize", () => {
        viewportResized(this);
      });
    }

    if (changed.filter) {
      const { filter } = this[state];
      this[ids].grid.filter = filter;
    }

    if (changed.text) {
      const { text } = this[state];
      this[ids].gloss.value = text;
    }

    if (changed.viewportHeight || changed.viewportWidth) {
      const { viewportHeight, viewportWidth } = this[state];
      Object.assign(this.style, {
        height: `${viewportHeight}px`,
        width: `${viewportWidth}px`,
      });
    }
  }

  [rendered](changed) {
    super[rendered](changed);

    if (this[firstRender]) {
      viewportResized(this);
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: grid;
          font-size: 24px;
          grid-template-rows: auto minmax(0, 1fr);
        }

        #inputBar {
          align-items: start;
          background: white;
          border: 1px solid gray;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr auto;
          margin: 2px;
          padding: 2px;
        }

        #input {
          font-size: 32px;
        }

        #input::part(textarea) {
          background: transparent;
          border: none;
          color: #333;
          padding: 2px 4px;
        }

        #gloss {
          color: #666;
          font-size: smaller;
          grid-column: 1 / span 2;
          grid-row: 2;
          min-height: 1.2em;
        }

        #commands {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-left: 2px;
        }

        #commands a,
        #commands button {
          align-items: center;
          background: none;
          border: none;
          display: grid;
          font: inherit;
          height: 1.5em;
          justify-content: center;
          width: 1.5em;
          padding: 0;
        }

        #glossToggle {
          font-weight: bold !important;
        }

        #grid {
          margin: 2px;
          padding: 2px;
        }
      </style>
      <div id="inputBar">
        <emoji-textarea id="input"></emoji-textarea>
        <div id="commands">
          <button id="shareButton">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>          </button>
          <button id="copyButton">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
          <a id="help" href="intro.html">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
          </a>
        </div>
        <emoji-gloss id="gloss"></emoji-gloss>
      </div>
      <emoji-grid id="grid"></emoji-grid>
    `;
  }
}

function addToInput(element, emoji, gloss) {
  const input = element[ids].input;
  const prefix = getPrefixBeforeInsertionPoint(element[ids].input);
  // We want to preserve spaces at the end of the prefix.
  const endSpaceCount = prefix.length - prefix.trimRight().length;
  const endSpaces = endSpaceCount > 0 ? prefix.slice(-endSpaceCount) : "";
  const start = input.selectionStart - prefix.length;
  input.setRangeText(emoji + endSpaces, start, input.selectionEnd, "end");
  element[setState]({ filter: "" });
  updateValueFromInput(element);
}

function getPrefixBeforeInsertionPoint(input) {
  const text = input.value.toLowerCase();
  let prefix = "";
  const { selectionStart, selectionEnd } = input;
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

function handleInputKeydown(element, event) {
  let handled;
  const grid = element[ids].grid;

  // Ignore Left/Right keys when metaKey or altKey modifier is also pressed,
  // as the user may be trying to navigate back or forward in the browser.
  switch (event.key) {
    case "ArrowDown":
      handled = grid.goNext();
      break;

    // case "ArrowLeft":
    //   if (horizontal && !event.metaKey && !event.altKey) {
    //     handled = this[goLeft]();
    //   }
    //   break;

    // case "ArrowRight":
    //   if (horizontal && !event.metaKey && !event.altKey) {
    //     handled = this[goRight]();
    //   }
    //   break;

    case "ArrowUp":
      handled = grid.goPrevious();
      break;

    case "End":
      handled = grid.goLast();
      break;

    case "Enter":
      const item = grid.currentItem;
      if (item) {
        const emoji = item.querySelector(".emoji").textContent;
        const gloss = item.querySelector(".gloss")?.textContent;
        addToInput(element, emoji, gloss);
        handled = true;
      }
      break;

    case "Home":
      handled = grid.goFirst();
      break;
  }

  return handled;
}

function handleTextInput(element) {
  const prefix = getPrefixBeforeInsertionPoint(element[ids].input);
  // Don't include spaces in filter.
  const filter = prefix.replaceAll(" ", "");
  element[setState]({ filter });
  updateValueFromInput(element);
}

function updateValueFromInput(element) {
  const text = element[ids].input.value;
  element[setState]({ text });
}

function viewportResized(element) {
  const {
    height: viewportHeight,
    width: viewportWidth,
  } = window.visualViewport;
  element[setState]({
    viewportHeight,
    viewportWidth,
  });
}

customElements.define("emojese-composer", EmojeseComposer);
