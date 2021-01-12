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
  rendered,
  setState,
  state,
  stateEffects,
  template,
} from "../node_modules/elix/src/base/internal.js";
import ItemsCursorMixin from "../node_modules/elix/src/base/ItemsCursorMixin.js";
import KeyboardPagedCursorMixin from "../node_modules/elix/src/base/KeyboardPagedCursorMixin.js";
import SingleSelectAPIMixin from "../node_modules/elix/src/base/SingleSelectAPIMixin.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";

const Base = CursorAPIMixin(
  CursorInViewMixin(
    CursorSelectMixin(
      ItemsCursorMixin(
        KeyboardPagedCursorMixin(SingleSelectAPIMixin(ReactiveElement))
      )
    )
  )
);

export default class EmojeseGrid extends Base {
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

    // Search without wrapping.
    const filterWithSpace = " " + filter;
    for (let i = index; i >= 0 && i < count; i += direction) {
      const item = items[i];
      const gloss = item.getAttribute("title");
      if (gloss && gloss.includes(filterWithSpace)) {
        return i;
      }
    }

    return -1; // No item found
  }

  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentIndexCopy: null,
      entries: emojis,
      filter: null,
      items: [],
      previousIndex: null,
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
        if (button && !button.disabled) {
          const emoji = button.querySelector(".emoji").textContent;
          const glossSpan = button.querySelector(".gloss");
          const gloss = glossSpan ? glossSpan.textContent : null;
          // Raise event
          this.dispatchEvent(
            new CustomEvent("emojese-click", {
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

    if (changed.currentIndex) {
      // Show the current item as selected.
      const { currentIndex, items } = this[state];
      if (currentIndex !== null && currentIndex >= 0) {
        items[currentIndex].classList.add("selected");
      }
    }

    if (changed.previousIndex) {
      // Stop showing the previous item as selected.
      const { previousIndex, items } = this[state];
      if (previousIndex !== null && previousIndex >= 0) {
        items[previousIndex].classList.remove("selected");
      }
    }

    if (changed.filter) {
      const { filter } = this[state];
      const filterStyles = this[ids].filterStyles;
      const rule = filterStyles.sheet.rules[0];
      // We start the search with a space so that we only match the beginning of
      // words.
      rule.selectorText = filter
        ? `button:not([title*=" ${filter}"i])`
        : `button`;
    }
  }

  [rendered](changed) {
    super[rendered](changed);

    let raiseIndexChangeEvent = false;

    if (changed.currentIndex && this[raiseChangeEvents]) {
      raiseIndexChangeEvent = true;
    }

    if (changed.filter) {
      // Changing the filter implies a change in currentIndex, but the page
      // won't know that, so we'll raise the event.
      raiseIndexChangeEvent = true;

      // By default, we'll select the first match, but if we can find a complete
      // match, switch to that. We don't do this in stateEffects, because here
      // we're directly inspecting the state of the DOM.
      const { currentIndex, filter, items } = this[state];
      const match = this[ids].grid.querySelector(`button[title=" ${filter}"]`);
      if (match) {
        const index = items.indexOf(match);
        if (index >= 0 && index !== currentIndex) {
          // Update index to a new match.
          this[setState]({ currentIndex: index });
          // The above call updates the state in time for the new currentIndex
          // to be available when the event below is raised.
        }
      }
    }

    if (raiseIndexChangeEvent) {
      // Filter caused currentIndex to change, which page doesn't know about,
      // so we raise a change event.
      this.dispatchEvent(new CustomEvent("currentindexchange"));
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
      const { items, filter } = state;
      if (!filter) {
        // Resetting filter resets selection.
        Object.assign(effects, { currentIndex: -1 });
      } else if (items) {
        // Changing filter selects the first matching item.
        const closestIndex = this[closestAvailableItemIndex](state, {
          index: 0,
        });
        Object.assign(effects, { currentIndex: closestIndex });
      }
    }

    if (changed.currentIndex && state.currentIndexCopy !== state.currentIndex) {
      Object.assign(effects, {
        currentIndexCopy: state.currentIndex,
        previousIndex: state.currentIndexCopy,
      });
    }

    return effects;
  }

  get [template]() {
    // Note: We'd like to use display: inline-grid styling for the buttons, but
    // as of December 2020, Safari on iPad won't render that correctly. So we
    // use flexbox instead.
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
          grid-template-columns: repeat(auto-fill, minmax(4.5em, 1fr));
          touch-action: pan-y;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          color: inherit;
          display: flex;
          font: inherit;
          height: 1.5em;
          justify-items: start;
          overflow: hidden;
          padding: 0;
          text-align: left;
        }

        .emoji {
          display: inline-block;
          overflow: hidden;
          text-align: right;
          white-space: nowrap;
          width: 1.5em;
        }
        
        .gloss{
          display: inline-block;
          flex: 1;
          font-size: smaller;
          margin-left: 0.25em;
          min-width: 0;
          white-space: nowrap;
        }

        .preferred {
          color: #888;
        }
        
        .mark {
          background: #ddd;
        }

        .selected {
          background: highlight;
          color: highlighttext;
        }
      </style>
      <style id="filterStyles">
        /* These rules are modified dynamically to filter the grid. */
        button {
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
    const [emoji, glosses, shortNames, emojese] = entry;
    // Add letter reference mark before first gloss that starts with that
    // letter.
    const firstStandardItem = lastItemWasEmojese && !emojese;

    const entryLetter = emojese
      ? glosses[0].toUpperCase()
      : firstStandardItem
      ? "⋯"
      : "";
    if (
      ((entryLetter >= "A") & (entryLetter <= "Z") || entryLetter === "⋯") &&
      entryLetter !== referenceLetter
    ) {
      const mark = document.createElement("button");
      mark.disabled = true;
      mark.classList.add("mark");
      mark.innerHTML = `
        <span class="emoji"></span>
        <span class="gloss">${entryLetter}</span>
      `;
      items.push(mark);
      referenceLetter = entryLetter;
    }

    // Add button
    const button = document.createElement("button");
    const [gloss, preferred] = glosses.split("/");

    // Title is alphabetic lowercase gloss.
    // Prepend a space to enable word-boundary match on the first word.
    const notAlpha = /[^a-z0-9]/g;
    const glossText = gloss.toLowerCase().replaceAll(notAlpha, "");
    const title = " " + glossText;

    button.setAttribute("title", title);
    button.classList.toggle("emojese", !!emojese);
    const preferredSpan = preferred
      ? `<span class="preferred"> ${preferred}</span>`
      : "";
    let html = `<span class="emoji">${emoji}</span><span class="gloss">${gloss}${preferredSpan}</span>`;
    button.innerHTML = html;

    items.push(button);

    lastItemWasEmojese = !!emojese;
  }
  return items;
}

customElements.define("emojese-grid", EmojeseGrid);
