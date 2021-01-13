import Toast from "../node_modules/elix/define/Toast.js";
import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  state,
  stateEffects,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";
import EmojeseGloss from "./EmojeseGloss.js";
import EmojeseGrid from "./EmojeseGrid.js";
import EmojeseIntroDialog from "./EmojeseIntroDialog.js";
import EmojeseTextarea from "./EmojeseTextarea.js";

// Force recognition of imports.
if (EmojeseGloss || EmojeseGrid || EmojeseTextarea || Toast) {
}

export default class EmojeseComposer extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItem: null,
      prefix: "",
      showGrid: false,
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
        const prefixWithoutSpaces = prefix.replace(/ /g, "");
        this[setState]({
          prefix: prefixWithoutSpaces,
        });
        this[raiseChangeEvents] = false;
      });

      this[ids].gridToggle.addEventListener("click", () => {});

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

      this[ids].copyButton.addEventListener("click", async () => {
        this[raiseChangeEvents] = true;
        const { text } = this[state];
        await navigator.clipboard.writeText(text);
        this[ids].copyToast.open();
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

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => {
          viewportResized(this);
        });
      }
    }

    if (changed.currentItem) {
      this[ids].grid.currentItem = this[state].currentItem;
    }

    if (changed.prefix) {
      this[ids].grid.filter = this[state].prefix;
    }

    if (changed.showGrid) {
      this[ids].grid.style.display = this[state].showGrid ? "" : "none";
    }

    if (changed.text) {
      const { text } = this[state];
      this[ids].input.value = text;
      this[ids].gloss.value = text;

      const empty = text.length === 0;
      this[ids].shareButton.disabled = empty || !navigator.share;
      this[ids].copyButton.disabled = empty;
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
      if (window.visualViewport) {
        viewportResized(this);
      }

      this[ids].input.focus();

      // Show intro dialog first time app is used.
      const showedIntro = localStorage.getItem("showedIntro");
      if (!showedIntro) {
        const dialog = new EmojeseIntroDialog();
        dialog.open();
        localStorage.setItem("showedIntro", "true");
      }
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects]
      ? super[stateEffects](state, changed)
      : {};

    // Only show grid when we have an active prefix in the textarea.
    // Hiding the grid also implies clearing the selection.
    if (changed.prefix) {
      const showGrid = state.prefix.length > 0;
      Object.assign(effects, { showGrid });
      if (!showGrid && state.currentItem) {
        Object.assign(effects, {
          currentItem: null,
        });
      }
    }

    return effects;
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          box-sizing: border-box;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr);
          padding: 0.5em 0.5em 0 0.5em;
        }

        #gloss {
          margin-bottom: 0.5em;
        }

        #inputBar {
          align-items: center;
          background: white;
          border: 1px solid gray;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr auto;
        }

        #input {
          font-size: 20px;
        }

        #input::part(textarea) {
          background: transparent;
          border: none;
          color: #333;
          padding: 2px 4px;
        }

        #commands {
          align-self: center;
          display: grid;
          font-size: 24px;
          grid-template-columns: repeat(4, 1fr);
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

        #downIcon {
          fill: currentColor;
          height: 0.7em;
          width: 0.7em;
        }

        #toastContent {
          padding: 1em;
        }

        #grid {
          font-size: 24px;
        }

        @media (min-width: 800px) {
          :host {
            padding: 2em 2em 0 2em;
          }

          #gloss {
            margin-bottom: 2em;
          }
          
          #input {
            font-size: 24px;
          }
        }
      </style>
      <elix-toast id="copyToast" duration="750" from-edge="top-right">
        <div id="toastContent">
          Copied to clipboard
        </div>
      </elix-toast>
      <emojese-gloss id="gloss"></emojese-gloss>
      <div id="inputBar">
        <emojese-textarea id="input" placeholder="Type or paste a message"></emojese-textarea>
        <div id="commands">
          <button id="gridToggle">
            <svg id="downIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 5">
              <path d="M 0 0 l5 5 5 -5 z" />
            </svg>
          </button>
          <button id="shareButton" title="Share">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>          </button>
          <button id="copyButton" title="Copy to clipboard">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
          <button id="helpButton" title="Help">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
          </button>
        </div>
      </div>
      <emojese-grid id="grid"></emojese-grid>
    `;
  }
}

function addToInput(element, emoji, gloss) {
  element[ids].input.insertEmoji(emoji);
  element[setState]({ prefix: "" });
  updateValueFromInput(element);
  updateCurrentItemFromGrid(element);
}

function addItemToInput(element, item) {
  const emoji = item.querySelector(".emoji").textContent;
  const preferredSpan = item.querySelector(".preferred");
  const glossSpan = item.querySelector(".gloss");

  const gloss = preferredSpan
    ? preferredSpan.textContent
    : glossSpan
    ? glossSpan.textContent
    : "";
  addToInput(element, emoji, gloss);
}

function handleInputKeydown(element, event) {
  let handled;
  const grid = element[ids].grid;

  // Only handle keys when grid is shown.
  if (element[state].showGrid) {
    // Ignore Left/Right keys when metaKey or altKey modifier is also pressed,
    // as the user may be trying to navigate back or forward in the browser.
    switch (event.key) {
      case "ArrowDown":
        handled = grid.goNext();
        updateCurrentItemFromGrid(element);
        break;

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

      case "PageDown":
        handled = grid.pageDown();
        break;

      case "PageUp":
        handled = grid.pageUp();
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
