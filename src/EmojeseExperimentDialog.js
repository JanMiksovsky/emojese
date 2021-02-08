import {
  defaultState,
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  setState,
  state,
  template,
} from "../node_modules/elix/src/base/internal";
import { fragmentFrom } from "../node_modules/elix/src/core/htmlLiterals";
import PlainDialog from "../node_modules/elix/src/plain/PlainDialog";

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
      defaultSlot.append(fragmentFrom.html`
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
          Experimental emoji cannot be sent directly, but if the
          recipient pastes a received message into this app, they can 
          opt to view the message using the experimental emoji.
        </p>
      `);
    }

    return result;
  }
}

customElements.define("emojese-experiment-dialog", EmojeseExperimentDialog);
