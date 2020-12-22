import { template } from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";

export default class EmojeseNavBar extends ReactiveElement {
  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          display: grid;
          gap: 2em;
          grid-template-columns: 1fr auto auto;
        }
      </style>
      <b>Emojese</b>
      <a href=".">Write</a>
      <a href="intro.html">Intro</a>
    `;
  }
}

customElements.define("emojese-nav-bar", EmojeseNavBar);
