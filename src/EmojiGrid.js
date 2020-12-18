import emojis from "../data/emojis.js";
import CursorAPIMixin from "../node_modules/elix/src/base/CursorAPIMixin.js";
import CursorInViewMixin from "../node_modules/elix/src/base/CursorInViewMixin.js";
import CursorSelectMixin from "../node_modules/elix/src/base/CursorSelectMixin.js";
import {
  closestAvailableItemIndex,
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
import ItemsCursorMixin from "../node_modules/elix/src/base/ItemsCursorMixin.js";
import SingleSelectAPIMixin from "../node_modules/elix/src/base/SingleSelectAPIMixin.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";

const Base = CursorAPIMixin(
  CursorInViewMixin(
    CursorSelectMixin(ItemsCursorMixin(SingleSelectAPIMixin(ReactiveElement)))
  )
);

export default class EmojiGrid extends Base {
  [closestAvailableItemIndex](state, options = {}) {
    const direction = options.direction !== undefined ? options.direction : 1;
    const index =
      options.index !== undefined ? options.index : state.currentIndex;

    const { filter, items } = state;
    const count = items ? items.length : 0;

    if (count === 0) {
      // No items
      return -1;
    }

    if (!filter) {
      // Always matches.
      return index;
    }

    // Search without wrapping.
    for (let i = index; i >= 0 && i < count; i += direction) {
      const item = items[i];
      const gloss = item.getAttribute("title");
      if (gloss?.includes(filter)) {
        return i;
      }
    }

    return -1; // No item found
  }

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

    if (changed.items || changed.currentIndex) {
      // Show the current item as selected.
      const { currentIndex, items } = this[state];
      const filterStyles = this[ids].filterStyles;
      const rule = filterStyles.sheet.rules[1];
      rule.selectorText =
        currentIndex >= 0
          ? `#grid > :nth-child(${currentIndex + 1})`
          : `.selected`;
    }

    if (changed.filter) {
      const { filter } = this[state];
      const filterStyles = this[ids].filterStyles;
      const rule = filterStyles.sheet.rules[0];
      rule.selectorText = filter
        ? `button:not([title*="${filter}"i])`
        : `.never`;
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

    if (changed.filter) {
      const { currentIndex, filter } = state;
      if (!filter) {
        // Resetting filter resets selection.
        Object.assign(effects, { currentIndex: -1 });
      } else {
        // Changing filter selects an item by default. This will be the first
        // matching item if there's no selection yet, or if there is a
        // selection, the closest matching item.
        const index = currentIndex < 0 ? 0 : currentIndex;
        const closestIndex = this[closestAvailableItemIndex](state, { index });
        Object.assign(effects, { currentIndex: closestIndex });
      }
    }

    return effects;
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: grid;
          grid-template-rows: min-content;
          overflow-y: auto;
        }
        
        #grid {
          box-sizing: border-box;
          display: grid;
          gap: 2px 6px;
          grid-template-columns: repeat(auto-fill, minmax(1.5em, 1fr));
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

        /* button[selected] {
          background: highlight;
          color: highlighttext;
        } */

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
      </style>
      <style id="filterStyles">
        /* These rules are modified dynamically to filter the grid. */
        .never {
          display: none;
        }

        .selected {
          background: highlight;
          color: highlighttext;
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
    const [emoji, gloss, emojese] = entry;
    // Add letter reference mark before first gloss that starts with that
    // letter.
    const firstStandardItem = lastItemWasEmojese && !emojese;

    const entryLetter = emojese ? gloss[0].toUpperCase() : null;
    if (
      (entryLetter >= "A") & (entryLetter <= "Z") &&
      entryLetter !== referenceLetter
    ) {
      const mark = document.createElement("button");
      mark.disabled = true;
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
    button.classList.toggle("emojese", !!emojese);
    button.classList.toggle("firstStandardItem", firstStandardItem);
    let html = `<span class="emoji">${emoji}</span>`;
    if (emojese) {
      html += `<span class="gloss">${gloss}</span>`;
    }
    button.innerHTML = html;

    items.push(button);

    lastItemWasEmojese = !!emojese;
  }
  return items;
}

customElements.define("emoji-grid", EmojiGrid);
