import {
  defaultState,
  firstRender,
  ids,
  render,
  setState,
  state,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";
import EmojiButton from "./EmojiButton.js";
import emojiEntries from "./emojiEntries.js";

export default class EmojiGrid extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      entries: null,
    });
  }

  async connectedCallback() {
    super.connectedCallback();
    const entries = await emojiEntries;
    this[setState]({ entries });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].grid.addEventListener("emoji-click", (event) => {
        // Reraise event
        this.dispatchEvent(
          new CustomEvent("emoji-click", {
            bubbles: true,
            detail: {
              emoji: event.detail.emoji,
            },
          })
        );
      });
    }

    const { entries } = this[state];
    if (changed.entries && entries) {
      const buttons = entries.map((entry) => {
        const button = new EmojiButton();
        button.innerHTML = `${entry.emoji}<span slot="description">${entry.description}</span>`;
        return button;
      });
      const grid = this[ids].grid;
      grid.innerHTML = "";
      grid.append(...buttons);
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: grid;
        }
        
        #grid {
          box-sizing: border-box;
          display: grid;
          gap: 2px 4px;
          grid-template-columns: repeat(auto-fill, minmax(var(--emoji-entry-width), 1fr));
          overflow: auto;
          touch-action: manipulation;
        }
      </style>
      <div id="grid"></div>
    `;
  }
}

customElements.define("emoji-grid", EmojiGrid);
