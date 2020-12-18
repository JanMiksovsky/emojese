import emojis from "../data/emojis.js";
import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  setState,
  state,
  stateEffects,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";

export default class EmojiGrid extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      entries: emojis,
      items: [],
      filter: null,
    });
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
      this[ids].grid.addEventListener("click", (event) => {
        this[raiseChangeEvents] = true;
        const target = event.target;
        const button =
          target instanceof HTMLButtonElement
            ? target
            : target.closest("button");
        if (button) {
          const emoji = button.querySelector(".emoji").textContent;
          const gloss = button.querySelector(".gloss")?.textContent;
          // Raise event
          this.dispatchEvent(
            new CustomEvent("emoji-click", {
              bubbles: true,
              detail: {
                emoji,
                gloss,
              },
            })
          );
        }
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.items) {
      const { items } = this[state];
      const grid = this[ids].grid;
      grid.innerHTML = "";
      grid.append(...items);
    }

    if (changed.filter) {
      const { filter } = this[state];
      let matches;
      if (filter) {
        this.setAttribute("filter", filter);
        matches = [...this[ids].grid.querySelectorAll(`[title*="${filter}"i]`)];
      } else {
        this.removeAttribute("filter");
        matches = [];
      }
      [...this[ids].grid.children].forEach((child) => {
        child.classList.toggle("notMatch", filter && !matches.includes(child));
      });
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects]
      ? super[stateEffects](state, changed)
      : {};

    if (changed.entries) {
      const { entries } = state;
      const items = gridItemsFromEntries(entries);
      Object.assign(effects, { items });
    }

    return effects;
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: grid;
          /* grid-template-rows: min-content; */
        }
        
        #grid {
          box-sizing: border-box;
          display: grid;
          gap: 2px 6px;
          grid-template-columns: repeat(auto-fill, minmax(1.5em, 1fr));
          grid-template-rows: min-content;
          overflow-y: auto;
          touch-action: pan-y;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          color: inherit;
          display: inline-grid;
          grid-template-columns: 1.5em auto;
          font: inherit;
          height: 1.5em;
          justify-items: start;
          overflow: hidden;
          padding: 0;
        }

        .emojese,
        .mark {
          grid-column-end: span 3;
        }

        .emoji {
          overflow: hidden;
          text-align: left;
          white-space: nowrap;
          width: 1.5em;
        }
        
        .gloss {
          font-size: smaller;
          margin-left: 0.25em;
          text-align: left;
          white-space: nowrap;
        }
        
        .mark {
          align-items: center;
          background: #ddd;
          display: inline-grid;
          grid-template-columns: 1.5em auto;
        }

        .letter {
          margin-left: 0.25em;
        }

        .firstStandardItem {
          grid-column: 1;
        }

        .notMatch {
          display: none;
        }
      </style>
      <div id="grid"></div>
    `;
  }
}

function gridItemsFromEntries(entries) {
  const items = [];
  let referenceLetter = "";
  let lastItemWasEmojese = false;
  for (const entry of entries) {
    const [emoji, gloss, part] = entry;
    // Add letter reference mark before first gloss that starts with that
    // letter.
    const emojeseItem = !!part;
    const firstStandardItem = lastItemWasEmojese && !emojeseItem;

    const entryLetter = emojeseItem ? gloss[0].toUpperCase() : null;
    if (
      (entryLetter >= "A") & (entryLetter <= "Z") &&
      entryLetter !== referenceLetter
    ) {
      const mark = document.createElement("div");
      mark.classList.add("mark");
      mark.innerHTML = `
        <span></span>
        <span class="letter">${entryLetter}</span>
      `;
      items.push(mark);
      referenceLetter = entryLetter;
    }

    // Add button
    const button = document.createElement("button");
    button.setAttribute("title", gloss);
    button.classList.toggle("emojese", emojeseItem);
    button.classList.toggle("firstStandardItem", firstStandardItem);
    let html = `<span class="emoji">${emoji}</span>`;
    if (part) {
      html += `<span class="gloss">${gloss}</span>`;
    }
    button.innerHTML = html;

    items.push(button);

    lastItemWasEmojese = emojeseItem;
  }
  return items;
}

customElements.define("emoji-grid", EmojiGrid);
