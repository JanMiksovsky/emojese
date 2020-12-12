import AutoSizeTextarea from "../node_modules/elix/define/AutoSizeTextarea.js";
import {
  defaultState,
  firstRender,
  ids,
  render,
  rendered,
  setState,
  state,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";
import EmojiGrid from "./EmojiGrid.js";

if (AutoSizeTextarea || EmojiGrid) {
}

export default class EmojeseComposer extends ReactiveElement {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      viewportHeight: null,
      viewportWidth: null,
    });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].grid.addEventListener("emoji-click", (event) => {
        addToInput(this[ids].input, event.detail.emoji);
      });

      this[ids].share.addEventListener("click", async () => {
        const text = this[ids].input.value;
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
      });

      if (!navigator.share) {
        this[ids].share.disabled = true;
      }

      window.visualViewport.addEventListener("resize", () => {
        viewportResized(this);
      });
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
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: grid;
          grid-template-rows: auto auto 1fr;
        }

        #input {
          display: block;
        }
      </style>
      <elix-auto-size-textarea id="input" minimum-rows="2"></elix-auto-size-textarea>
      <button id="share">Share</button>
      <emoji-grid id="grid"></emoji-grid>
    `;
  }
}

function addToInput(input, emoji) {
  input.setRangeText(emoji);
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
