import {
  firstRender,
  ids,
  render,
  shadowRoot,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";

export default class EmojiButton extends ReactiveElement {
  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].button.addEventListener("click", () => {
        const slot = this[shadowRoot].querySelector("slot");
        const emoji = slot.assignedNodes()[0].textContent;
        this.dispatchEvent(
          new CustomEvent("emoji-click", {
            bubbles: true,
            detail: {
              emoji,
            },
          })
        );
      });
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        #button {
          background: none;
          border: none;
          height: 1.5em;
          font: inherit;
          padding: 0;
          width: 1.5em;
        }
      </style>
      <button id="button"><slot></slot></button>
    `;
  }
}

customElements.define("emoji-button", EmojiButton);
