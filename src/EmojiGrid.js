import {
  firstRender,
  ids,
  render,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";
import EmojiButton from "./EmojiButton.js";

if (EmojiButton) {
}

export default class EmojiGrid extends ReactiveElement {
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
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          box-sizing: border-box;
          border: 4px solid #ccc;
          display: grid;
          font-size: 18px;
          touch-action: manipulation;
        }
      </style>
      <div id="grid">
        <emoji-button>😀</emoji-button>
      </div>
    `;
  }
}

customElements.define("emoji-grid", EmojiGrid);
