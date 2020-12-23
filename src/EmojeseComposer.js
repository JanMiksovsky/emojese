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
import EmojeseGloss from "./EmojeseGloss.js";
import EmojeseGrid from "./EmojeseGrid.js";
import EmojeseIntroDialog from "./EmojeseIntroDialog.js";
import EmojeseTextarea from "./EmojeseTextarea.js";

// Force recognition of imports.
if (EmojeseGloss || EmojeseGrid || EmojeseTextarea) {
}

export default class EmojeseComposer extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItem: null,
      filter: "",
      text: "",
      viewportHeight: null,
      viewportWidth: null,
    });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].input.addEventListener("click", (event) => {
        this[raiseChangeEvents] = true;
        this[setState]({ currentItem: null });
        this[raiseChangeEvents] = false;
      });

      this[ids].input.addEventListener("input", () => {
        this[raiseChangeEvents] = true;
        updateValueFromInput(this);
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

      this[ids].input.addEventListener("prefixchange", (event) => {
        this[raiseChangeEvents] = true;
        const prefix = this[ids].input.prefix;
        const filter = prefix.replaceAll(" ", "");
        this[setState]({ filter });
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

      this[ids].helpButton.addEventListener("click", async () => {
        this[raiseChangeEvents] = true;
        const dialog = new EmojeseIntroDialog();
        await dialog.open();
        this[raiseChangeEvents] = false;
      });

      this[ids].grid.addEventListener("currentindexchange", () => {
        this[raiseChangeEvents] = true;
        const currentItem = this[ids].grid.currentItem;
        this[setState]({ currentItem });
        this[raiseChangeEvents] = false;
      });
      this[ids].grid.addEventListener("emojese-click", (event) => {
        addToInput(this, event.detail.emoji, event.detail.gloss);
      });
      this[ids].grid.addEventListener("mousedown", (event) => {
        event.preventDefault(); // Keep focus on input.
      });

      window.visualViewport.addEventListener("resize", () => {
        viewportResized(this);
      });
    }

    if (changed.currentItem) {
      const { currentItem } = this[state];
      this[ids].grid.currentItem = currentItem;
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

      this[ids].input.focus();
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

        button:disabled {
          opacity: 0.25;
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
        <emojese-textarea id="input"></emojese-textarea>
        <div id="commands">
          <button id="shareButton">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>          </button>
          <button id="copyButton">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
          <button id="helpButton">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
          </button>
        </div>
        <emojese-gloss id="gloss"></emojese-gloss>
      </div>
      <emojese-grid id="grid"></emojese-grid>
    `;
  }
}

function addToInput(element, emoji, gloss) {
  element[ids].input.insertEmoji(emoji);
  element[setState]({ filter: "" });
  updateValueFromInput(element);
  updateCurrentItemFromGrid(element);
}

function addItemToInput(element, item) {
  const emoji = item.querySelector(".emoji").textContent;
  const gloss = item.querySelector(".gloss")?.textContent;
  addToInput(element, emoji, gloss);
}

function handleInputKeydown(element, event) {
  let handled;
  const grid = element[ids].grid;

  // Ignore Left/Right keys when metaKey or altKey modifier is also pressed,
  // as the user may be trying to navigate back or forward in the browser.
  switch (event.key) {
    case "ArrowDown":
      handled = grid.goNext();
      updateCurrentItemFromGrid(element);
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
      updateCurrentItemFromGrid(element);
      break;

    case "End":
      handled = grid.goLast();
      updateCurrentItemFromGrid(element);
      break;

    case "Home":
      handled = grid.goFirst();
      updateCurrentItemFromGrid(element);
      break;

    case " ":
    case ",":
    case ";":
    case ":":
    case "!":
    case "?":
    case ".":
    case "(":
    case ")":
    case "Enter":
      const { currentItem } = element[state];
      if (currentItem) {
        addItemToInput(element, currentItem);
        // We also want to add the character that was typed, so we generally
        // don't mark the event as handled. However, if the Enter key results in
        // adding a character, we *don't* want to add a return, so we do mark
        // the event as handled.
        handled = event.key === "Enter";
      }
      break;
  }

  return handled;
}

function updateCurrentItemFromGrid(element) {
  const currentItem = element[ids].grid.currentItem;
  element[setState]({ currentItem });
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
