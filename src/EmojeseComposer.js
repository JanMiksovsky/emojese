import AutoSizeTextarea from "../node_modules/elix/define/AutoSizeTextarea.js";
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

if (AutoSizeTextarea || EmojiGloss || EmojiGrid) {
}

export default class EmojeseComposer extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      showHelp: false,
      text: "",
      viewportHeight: null,
      viewportWidth: null,
    });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].input.addEventListener("input", () => {
        this[raiseChangeEvents] = true;
        const text = this[ids].input.value;
        this[setState]({ text });
        this[raiseChangeEvents] = false;
      });

      this[ids].shareButton.addEventListener("click", async () => {
        this[raiseChangeEvents] = true;
        const { text } = this[state];
        const canShare = navigator.canShare({ text });
        if (canShare) {
          try {
            await navigator.share({ text });
            console.log("shared successfully");
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Can't share text");
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

      this[ids].helpToggle.addEventListener("click", () => {
        this[raiseChangeEvents] = true;
        const { showHelp } = this[state];
        this[setState]({ showHelp: !showHelp });
        this[raiseChangeEvents] = false;
      });

      this[ids].grid.addEventListener("emoji-click", (event) => {
        addToInput(this[ids].input, event.detail.emoji);
      });

      window.visualViewport.addEventListener("resize", () => {
        viewportResized(this);
      });
    }

    if (changed.text) {
      const { text } = this[state];
      this[ids].gloss.value = text;
    }

    if (changed.showHelp) {
      const { showHelp } = this[state];
      this.toggleAttribute("show-help", showHelp);
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

      // setTimeout(() => this[ids].input.focus());
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

        #input::part(textarea) {
          background: transparent;
          border: none;
        }

        #gloss {
          color: #666;
          display: none;
        }

        #commands {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-left: 2px;
        }

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

        #helpToggle {
          font-weight: bold !important;
        }

        #grid {
          margin: 2px;
          padding: 2px;
        }

        :host([show-help]) {
          --emoji-description-width: 3em;
        }
        :host([show-help]) #gloss {
          display: block;
        }
      </style>
      <div id="inputBar">
        <div>
          <elix-auto-size-textarea id="input" minimum-rows="1"></elix-auto-size-textarea>
          <emoji-gloss id="gloss"></emoji-gloss>
        </div>
        <div id="commands">
          <button id="shareButton">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>          </button>
          <button id="copyButton">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
          <button id="helpToggle">ⓘ</button>
        </div>
      </div>
      <emoji-grid id="grid"></emoji-grid>
    `;
  }
}

function addToInput(input, emoji) {
  input.setRangeText(emoji, input.selectionStart, input.selectionEnd, "end");
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
