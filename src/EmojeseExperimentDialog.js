import emojis from "../data/emojis.js";
import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  setState,
  state,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { fragmentFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import PlainDialog from "../node_modules/elix/src/plain/PlainDialog.js";
import experimentalEmojis from "./experimentalEmoji.js";

export default class EmojeseExperimentDialog extends PlainDialog {
  get [defaultState]() {
    const experimentalEmoji =
      localStorage.getItem("experimentalEmoji") === "true";
    return Object.assign(super[defaultState], {
      experimentalEmoji,
    });
  }

  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].closeButton.addEventListener("click", () => {
        this[raiseChangeEvents] = true;
        this.close();
        this[raiseChangeEvents] = false;
      });

      this[ids].experimentalCheckBox.addEventListener("change", () => {
        this[raiseChangeEvents] = true;
        const experimentalEmoji = this[ids].experimentalCheckBox.checked;
        this[setState]({
          experimentalEmoji,
        });
        this[raiseChangeEvents] = false;
      });

      // This button listens to mousedown instead of click. If we use the normal
      // click event on iOS, when when the user scrolls down to the button and
      // taps it the first time, the dialog just scrolls back to the top instead
      // of closing; a second tap is required to actaully close the dialog. As a
      // workaround, we use mousedown instead.
      this[ids].okButton.addEventListener("mousedown", () => {
        this[raiseChangeEvents] = true;
        this.close();
        this[raiseChangeEvents] = false;
      });
    }

    if (changed.experimentalEmoji) {
      const experimentalEmoji = this[state].experimentalEmoji;
      this[ids].experimentalCheckBox.checked = experimentalEmoji;
      // Also save experimental flag in local storage.
      localStorage.setItem("experimentalEmoji", String(experimentalEmoji));
    }
  }

  get [template]() {
    const result = super[template];

    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      const fragment = fragmentFrom.html`
        <style>
          :host {
            font-size: 18px;
            /* HACK to compensate for Dialog styling */
            grid-template: inherit;
          }

          [part="frame"] {
            /* HACK for Safari */
            display: block;
            max-height: 90%;
            max-width: min(90%, 500px);     
            overflow: auto; /* For Safari */
            padding: 1em 2em 1em 1em;
          }
          
          p {
            margin-bottom: 0;
          }

          #checkBoxParagraph {
            padding-left: 1.5em;
            text-indent: -1.5em;
          }

          button {
            background: #eee;
            border: 1px solid gray;
            font: inherit;
          }
       
          #closeButton {
            display: grid;
            font-size: 24px;
            font-weight: bold;
            padding: 0;
            position: absolute;
            right: 0.5em;
            top: 0.5em;
            user-select: none;
            z-index: 1;
          }

          .word {
            display: inline-grid;
            grid-template-rows: auto auto;
            justify-items: center;
            margin-bottom: 1em;
            margin-right: 0.75em;
          }

          .base {
            height: 40px;
          }

          #experiments {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }

          #experiments img {
            height: 100%;
          }

          #experiments img[src$=".svg"] {
            filter: invert(25%) sepia(23%) saturate(20%) hue-rotate(326deg) brightness(93%) contrast(93%);
          }

          #okButtonParagraph {
            padding: 1em;
            text-align: center;
          }

          #okButton {
            padding: 0.5em 1.5em;
          }

          @media (min-width: 600px) {
            #experiments {
              grid-template-columns: repeat(5, 1fr);
            }
          }
        </style>
        <button id="closeButton">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
        <p id="checkBoxParagraph">
          <label>
            <input id="experimentalCheckBox" type="checkbox">
            Display message using experimental emoji
          </label>
        </p>
        <p>
          These experiments explore whether new icons for common words ("give",
          "get", "I", "we", and more) could help communicate more ideas in emoji.
        </p>
        <p id="experiments"></p>
        <p>
          The icons are just <em>ideas</em>, mostly from
          <a href="https://thenounproject.com">thenounproject.com</a>. Any
          real proposals would need to go through a lengthy design and
          approval process.
        </p>
        <p>
          Experimental emoji cannot be sent directly, but if the
          recipient pastes a received message into this app, they can 
          opt to view the message using the experimental emoji.
        </p>
        <p id="okButtonParagraph">
          <button id="okButton">Close</button>
        </p>
      `;

      const experiments = fragment.querySelector("#experiments");
      experiments.innerHTML = getExperimentalEmojiList();

      defaultSlot.append(fragment);
    }

    return result;
  }
}

function getExperimentalEmojiList() {
  let html = "";
  for (const entry of emojis) {
    const [emoji, glosses, shortNames, emojese] = entry;
    const experimentalEmoji = experimentalEmojis[emoji];
    if (emojese && experimentalEmoji) {
      const [gloss, preferred] = glosses.split("/");
      if (!preferred) {
        html += `<div class="word">
        <div class="base">${experimentalEmoji}</div>
        <div class="ruby">${gloss}</div>
      </div>`;
      }
    }
  }
  return html;
}

customElements.define("emojese-experiment-dialog", EmojeseExperimentDialog);
