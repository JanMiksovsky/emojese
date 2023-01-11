import {
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { fragmentFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import PlainDialog from "../node_modules/elix/src/plain/PlainDialog.js";

export default class EmojeseIntroDialog extends PlainDialog {
  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].closeButton.addEventListener("click", () => {
        this[raiseChangeEvents] = true;
        this.close();
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
  }

  get [template]() {
    const result = super[template];

    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.append(fragmentFrom.html`
        <style>
          :host {
            font-size: 18px;
          }

          [part="frame"] {
            display: block; /* HACK, not sure why necessary */
            max-height: 90%;
            max-width: min(90%, 500px);     
            overflow: auto; /* For Safari */
            padding: 1em 2em 1em 1em;
          }
          
          p {
            margin-bottom: 0;
          }

          td:first-child {
            padding-right: 1em;
            white-space: nowrap;
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

          hr {
            border-top: 1px solid #ccc;
            width: 100%;
            margin: 1em 0;
          }

          #okButtonParagraph {
            padding: 1em;
            text-align: center;
          }

          #okButton {
            padding: 0.5em 1.5em;
          }
        </style>
        <button id="closeButton">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
        <p>
          <b>How to write in Emojese</b>
        </p>
        <p><b>Word order</b> is Subject–Verb–Object as in English:</p>
        <table>
          <tr>
            <td>👨💙🚴‍♂️</td>
            <td>He likes bikes.</td>
          </tr>
        </table>
        <p>The verb <b>is</b>:</p>
        <table>
          <tr>
            <td>=</td>
            <td>is, be (Tip: can often omit this)</td>
          </tr>
          <tr>
            <td>🚫=</td>
            <td>isn’t</td>
          </tr>
        </table>

        <p>
          The <b>past</b> is to the <b>left</b>; the <b>future</b> to the
          <b>right</b>, and is indicated with arrows (not emoji direction).
        </p>
        <table>
          <tr>
            <td>👩🚶‍♀️</td>
            <td>She walks</td>
          </tr>
          <tr>
            <td>👩⤺🚶‍♀️</td>
            <td>She walked (Tip: type “did walk”)</td>
          </tr>
          <tr>
            <td>👩⤻🚶‍♀️</td>
            <td>She will walk</td>
          </tr>
        </table>
        <p>Make <b>verbs</b> from nouns with ⟿</p>
        <table>
          <tr>
            <td>📚⟿</td>
            <td>read (or reading)</td>
          </tr>
        </table>
        <p>Make <b>adjectives</b> from a representative noun with ~ (“ish”)</p>
        <table>
          <tr>
            <td>🐘~</td>
            <td>big</td>
          </tr>
          <tr>
            <td>🐌~</td>
            <td>slow</td>
          </tr>
          <tr>
            <td>🎓~</td>
            <td>smart</td>
          </tr>
        </table>
        <p>
          <b>Contrast</b> between adjacent emojis focuses on the <b>second</b>, and
          implies change, difference, or result:
        </p>
        <table>
          <tr>
            <td>🐛🦋</td>
            <td>become, change</td>
          </tr>
          <tr>
            <td>🏕️⛺</td>
            <td>near</td>
          </tr>
          <tr>
            <td>⛺🏕️</td>
            <td>far</td>
          </tr>
          <tr>
            <td>🛌🛏</td>
            <td>wake up</td>
          </tr>
        </table>
        <p><b>Double</b> for plurals or emphasis:</p>
        <table>
          <tr>
            <td>🐈🐈</td>
            <td>cats</td>
          </tr>
          <tr>
            <td>⤺⤺</td>
            <td>did (a long time ago)</td>
          </tr>
          <tr>
            <td>❤️❤️</td>
            <td>really loves</td>
          </tr>
        </table>
        <p>Brackets are <b>categories</b> represented by 1 or more emoji:</p>
        <table>
          <tr>
            <td>[🖼️]</td>
            <td>art</td>
          </tr>
          <tr>
            <td>[⚽]</td>
            <td>sports</td>
          </tr>
        </table>
        <p>
          <b>Pronouns</b>
        </p>
        <table>
          <tr>
            <td>👇</td>
            <td>I, me (like you’re pointing to yourself)</td>
          </tr>
          <tr>
            <td></td>
            <td>If “I” starts a sentence, you can also use an appropriate face:</td>
          </tr>
          <tr>
            <td>😀→🏠</td>
            <td>I’m going home!</td>
          </tr>
          <tr>
            <td>🫵</td>
            <td>you</td>
          </tr>
          <tr>
            <td>🙍‍♀️</td>
            <td>she</td>
          </tr>
          <tr>
            <td>🙍‍♂️</td>
            <td>he</td>
          </tr>
          <tr>
            <td>⬚</td>
            <td>it</td>
          </tr>
          <tr>
            <td>👤</td>
            <td>they (singular)</td>
          </tr>
          <tr>
            <td>👇👇</td>
            <td>us</td>
          </tr>
          <tr>
            <td>👥</td>
            <td>they (plural)</td>
          </tr>
        </table>
        <p>
          <b>Describe</b> or indicate possession with a の <b>before</b> the thing
          being described:
        </p>
        <table>
          <tr>
            <td>🙍‍♀️の🐕</td>
            <td>her dog</td>
          </tr>
          <tr>
            <td>🏢の🚪</td>
            <td>office door</td>
          </tr>
        </table>
        <p>
          <b>Define</b> a person or thing with a colon (:) <b>after</b> the thing
          being described:
        </p>
        <table>
          <tr>
            <td>👦:🧢</td>
            <td>the boy with the hat</td>
          </tr>
          <tr>
            <td>👧:💚⚽️</td>
            <td>the girl who likes soccer</td>
          </tr>
        </table>
        <p>Parenthesis clarify <b>phrases</b>:</p>
        <table>
          <tr>
            <td>👩‍🍼💭 (🍴🥗)</td>
            <td>Mom thinks we should eat salad.</td>
          </tr>
          <tr>
            <td>(👧:🥱) ⤺→🏠</td>
            <td>The girl who is tired went home.</td>
          </tr>
        </table>
        <p><b>Conditions</b> use ⇒</p>
        <table>
          <tr>
            <td>🚫🌧️ ⇒ 👇⤻🏃</td>
            <td>[If it’s] not raining, then I will run.</td>
          </tr>
        </table>
        <p>
          <b>Names</b> can be spelled out. You and your friends can pick emoji faces
          or objects to represent each other.
        </p>
        <table>
          <tr>
            <td>👦🏽Amar</td>
          </tr>
          <tr>
            <td>🧒🏻Maki</td>
          </tr>
          <tr>
            <td>🍉Olivia</td>
          </tr>
        </table>
        <p>
          <b>Questions</b> end with a question mark. It can also help to add a
          Spanish-style opening question mark.
        </p>
        <table>
          <tr>
            <td>¿🎲 ↤ 🥡?</td>
            <td>Maybe get takeout?</td>
          </tr>
        </table>
        <p>
          <b>If no emoji exists</b> for a thing, you can try to describe it. The possessive の can be useful, as can categories.
        </p>
        <table>
          <tr>
            <td>[🥞]の🌾</td>
            <td>breakfast cereal (grain)</td>
          </tr>
        </table>
        <p>Drop <b>articles</b> like "the", "a", and "an".</p>
        <p>Use <b>spaces</b> to make a message easier to read.</p>
        <p id="okButtonParagraph">
          <button id="okButton">Close</button>
        </p>
      `);
    }

    return result;
  }
}

customElements.define("emojese-intro-dialog", EmojeseIntroDialog);
