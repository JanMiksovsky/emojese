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
        const slot = this[shadowRoot].querySelector("slot:not([name])");
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
          align-items: center;
          background: none;
          border: none;
          display: inline-grid;
          grid-template-columns: 1.5em auto;
          height: 1.5em;
          font: inherit;
          padding: 0;
        }

        #emoji {
          overflow: hidden;
          white-space: nowrap;
        }
        
        #description {
          font-size: smaller;
          margin-left: 0.25em;
          overflow: hidden;
          text-align: left;
          white-space: nowrap;
          width: var(--emoji-description-width, 0);
        }
      </style>
      <button id="button">
        <span id="emoji">
          <slot></slot>
        </span>
        <span id="description">
          <slot name="description"></slot>
        </span>
      </button>
    `;
  }
}

customElements.define("emoji-button", EmojiButton);
