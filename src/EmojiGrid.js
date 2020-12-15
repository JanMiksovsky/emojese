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
      filter: null,
    });
  }

  async connectedCallback() {
    super.connectedCallback();
    const entries = await emojiEntries;
    this[setState]({ entries });
  }

  get filter() {
    return this[state].filter;
  }
  set filter(filter) {
    this[setState]({
      filter: filter.toLowerCase(),
    });
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
              description: event.detail.description,
              emoji: event.detail.emoji,
            },
          })
        );
      });
    }

    const { entries } = this[state];
    if (changed.entries && entries) {
      const buttons = [];
      let referenceLetter = "";
      for (const entry of entries) {
        // Add letter reference mark before first description that starts with
        // that letter.
        const entryLetter = entry.description[0].toUpperCase();
        if (
          (entryLetter >= "A") & (entryLetter <= "Z") &&
          entryLetter !== referenceLetter
        ) {
          const mark = document.createElement("div");
          mark.classList.add("mark");
          mark.textContent = entryLetter;
          buttons.push(mark);
          referenceLetter = entryLetter;
        }

        // Add button
        const button = new EmojiButton();
        button.description = entry.description;
        button.textContent = entry.emoji;
        buttons.push(button);
      }
      const grid = this[ids].grid;
      grid.innerHTML = "";
      grid.append(...buttons);
    }

    if (changed.filter) {
      const { filter } = this[state];
      let matches;
      if (filter) {
        this.setAttribute("filter", filter);
        matches = [
          ...this[ids].grid.querySelectorAll(`[description^="${filter}"i]`),
        ];
      } else {
        this.removeAttribute("filter");
        matches = [];
      }
      [...this[ids].grid.children].forEach((child) => {
        child.classList.toggle("notMatch", filter && !matches.includes(child));
      });
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
          grid-template-rows: min-content;
          overflow-y: auto;
          touch-action: pan-y;
        }

        .mark {
          align-items: center;
          background: #eee;
          display: grid;
          justify-items: center;
        }

        .notMatch {
          display: none;
        }
      </style>
      <div id="grid"></div>
    `;
  }
}

customElements.define("emoji-grid", EmojiGrid);
