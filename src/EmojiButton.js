import {
  defaultState,
  firstRender,
  ids,
  render,
  setState,
  shadowRoot,
  state,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";

export default class EmojiButton extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      description: "",
    });
  }

  get description() {
    return this[state].description;
  }
  set description(description) {
    this[setState]({ description });
  }

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

    if (changed.description) {
      const { description } = this[state];
      this[ids].description.textContent = description;
      if (description) {
        this.setAttribute("description", description);
      } else {
        this.removeAttribute("description");
      }
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-grid;
        }
        
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
          display: var(--emoji-description-display, none);
          font-size: smaller;
          margin-left: 0.25em;
          overflow: hidden;
          text-align: left;
          white-space: nowrap;
        }
      </style>
      <button id="button">
        <span id="emoji">
          <slot></slot>
        </span>
        <span id="description"></span>
      </button>
    `;
  }
}

customElements.define("emoji-button", EmojiButton);
