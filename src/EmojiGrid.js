import {
  firstRender,
  ids,
  render,
  template,
} from "../node_modules/elix/src/base/internal.js";
import { templateFrom } from "../node_modules/elix/src/core/htmlLiterals.js";
import ReactiveElement from "../node_modules/elix/src/core/ReactiveElement.js";
import EmojiButton from "./EmojiButton.js";

if (EmojiButton) {
}

export default class EmojiGrid extends ReactiveElement {
  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      this[ids].grid.addEventListener("emoji-click", (event) => {
        // Reraise event
        this.dispatchEvent(
          new CustomEvent("emoji-click", {
            bubbles: true,
            detail: {
              emoji: event.detail.emoji,
            },
          })
        );
      });
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          box-sizing: border-box;
          display: grid;
          overflow: auto;
          touch-action: manipulation;
        }
      </style>
      <div id="grid">
      <emoji-button>⟿<span slot="description">-ing</span></emoji-button>
<emoji-button>~<span slot="description">-ish</span></emoji-button>
<emoji-button>◓<span slot="description">above, over</span></emoji-button>
<emoji-button><span slot="description">across</span></emoji-button>
<emoji-button>➕<span slot="description">add</span></emoji-button>
<emoji-button>◐<span slot="description">after, behind</span></emoji-button>
<emoji-button>⟲<span slot="description">again</span></emoji-button>
<emoji-button>∀<span slot="description">all, every</span></emoji-button>
<emoji-button><span slot="description">allow, let</span></emoji-button>
<emoji-button>&<span slot="description">and</span></emoji-button>
<emoji-button>~<span slot="description">around</span></emoji-button>
<emoji-button>🛬<span slot="description">arrive</span></emoji-button>
<emoji-button>💬<span slot="description">ask</span></emoji-button>
<emoji-button>@<span slot="description">at</span></emoji-button>
<emoji-button><span slot="description">away</span></emoji-button>
<emoji-button>👎<span slot="description">bad</span></emoji-button>
<emoji-button>↓<span slot="description">be</span></emoji-button>
<emoji-button>🦋<span slot="description">become, turn into</span></emoji-button>
<emoji-button>◑<span slot="description">before, in front</span></emoji-button>
<emoji-button>1️⃣<span slot="description">begin, start</span></emoji-button>
<emoji-button>◐<span slot="description">behind, after</span></emoji-button>
<emoji-button><span slot="description">believe</span></emoji-button>
<emoji-button>◒<span slot="description">below, under</span></emoji-button>
<emoji-button><span slot="description">between</span></emoji-button>
<emoji-button>🐘<span slot="description">big, large</span></emoji-button>
<emoji-button>[🥞🥓]<span slot="description">breakfast</span></emoji-button>
<emoji-button>🎒<span slot="description">bring, carry</span></emoji-button>
<emoji-button
  >🔨<span slot="description">build, create, make</span></emoji-button
>
<emoji-button>⇤<span slot="description">but</span></emoji-button>
<emoji-button>🛒<span slot="description">buy</span></emoji-button>
<emoji-button><span slot="description">by, near</span></emoji-button>
<emoji-button>🤙<span slot="description">call</span></emoji-button>
<emoji-button>💪<span slot="description">can</span></emoji-button>
<emoji-button>🎒<span slot="description">carry, bring</span></emoji-button>
<emoji-button>]<span slot="description">category end</span></emoji-button>
<emoji-button>[<span slot="description">category start</span></emoji-button>
<emoji-button
  >[🥞🥓]の🌾<span slot="description">cereal, oatmeal</span></emoji-button
>
<emoji-button>）<span slot="description">clause end</span></emoji-button>
<emoji-button>（<span slot="description">clause start</span></emoji-button>
<emoji-button><span slot="description">clear</span></emoji-button>
<emoji-button>📖📕<span slot="description">close</span></emoji-button>
<emoji-button>←<span slot="description">come</span></emoji-button>
<emoji-button><span slot="description">continue</span></emoji-button>
<emoji-button
  >🔨<span slot="description">create, build, make</span></emoji-button
>
<emoji-button>✂️<span slot="description">cut</span></emoji-button>
<emoji-button>⚖️<span slot="description">decide</span></emoji-button>
<emoji-button>⤺<span slot="description">did (past)</span></emoji-button>
<emoji-button>⚰️<span slot="description">die</span></emoji-button>
<emoji-button><span slot="description">different</span></emoji-button>
<emoji-button>⟿<span slot="description">do</span></emoji-button>
<emoji-button>⬇️<span slot="description">down</span></emoji-button>
<emoji-button>🕑⤻🕓<span slot="description">duration</span></emoji-button>
<emoji-button><span slot="description">during, while</span></emoji-button>
<emoji-button>🌅<span slot="description">early</span></emoji-button>
<emoji-button><span slot="description">easy</span></emoji-button>
<emoji-button>🍴<span slot="description">eat</span></emoji-button>
<emoji-button><span slot="description">expect</span></emoji-button>
<emoji-button
  >🍁<span slot="description">fall (down), lower</span></emoji-button
>
<emoji-button>⛺🏕️<span slot="description">far, away</span></emoji-button>
<emoji-button>🐇<span slot="description">fast</span></emoji-button>
<emoji-button>🦯<span slot="description">feel, sense</span></emoji-button>
<emoji-button>🔍<span slot="description">find</span></emoji-button>
<emoji-button>🏁<span slot="description">finish, end</span></emoji-button>
<emoji-button>1️⃣<span slot="description">First; to start</span></emoji-button>
<emoji-button><span slot="description">follow</span></emoji-button>
<emoji-button>➡️<span slot="description">for, to</span></emoji-button>
<emoji-button><span slot="description">free</span></emoji-button>
<emoji-button>⬅️<span slot="description">from</span></emoji-button>
<emoji-button><span slot="description">full</span></emoji-button>
<emoji-button>。<span slot="description">full stop</span></emoji-button>
<emoji-button>🕸️<span slot="description">get, catch</span></emoji-button>
<emoji-button>↤<span slot="description">get, take</span></emoji-button>
<emoji-button
  >↦<span slot="description">give, offer, provide</span></emoji-button
>
<emoji-button>→<span slot="description">go</span></emoji-button>
<emoji-button>👍<span slot="description">good</span></emoji-button>
<emoji-button>🌱<span slot="description">grow</span></emoji-button>
<emoji-button><span slot="description">happen</span></emoji-button>
<emoji-button><span slot="description">hard</span></emoji-button>
<emoji-button>💁‍♀️<span slot="description">have, hold</span></emoji-button>
<emoji-button>♂️<span slot="description">he</span></emoji-button>
<emoji-button>👂<span slot="description">hear, listen</span></emoji-button>
<emoji-button>🚑<span slot="description">help</span></emoji-button>
<emoji-button>🏖️⛰️<span slot="description">high</span></emoji-button>
<emoji-button>🔨？<span slot="description">How</span></emoji-button>
<emoji-button>🕑⤻🕓？<span slot="description">How long</span></emoji-button>
<emoji-button>👇<span slot="description">I</span></emoji-button>
<emoji-button>‼️<span slot="description">important</span></emoji-button>
<emoji-button
  >◑<span slot="description">in front of, before</span></emoji-button
>
<emoji-button>⇲<span slot="description">in, inside</span></emoji-button>
<emoji-button><span slot="description">include</span></emoji-button>
<emoji-button
  >🌐<span slot="description">internet, world wide web</span></emoji-button
>
<emoji-button>=<span slot="description">is</span></emoji-button>
<emoji-button>♟<span slot="description">It, person, thing</span></emoji-button>
<emoji-button>🔐<span slot="description">keep</span></emoji-button>
<emoji-button>🗡️<span slot="description">kill</span></emoji-button>
<emoji-button>🎓<span slot="description">know</span></emoji-button>
<emoji-button
  >Ω<span slot="description">last; to end; and in the end</span></emoji-button
>
<emoji-button>🌃<span slot="description">late</span></emoji-button>
<emoji-button><span slot="description">lead</span></emoji-button>
<emoji-button>🛫<span slot="description">leave, depart</span></emoji-button>
<emoji-button>⇊<span slot="description">less</span></emoji-button>
<emoji-button><span slot="description">let, allow</span></emoji-button>
<emoji-button>💚<span slot="description">like</span></emoji-button>
<emoji-button>👂<span slot="description">listen, hear</span></emoji-button>
<emoji-button>🐜<span slot="description">little, small</span></emoji-button>
<emoji-button>🕊️<span slot="description">live</span></emoji-button>
<emoji-button>🔒<span slot="description">lock</span></emoji-button>
<emoji-button>🐍<span slot="description">long</span></emoji-button>
<emoji-button>👀<span slot="description">look, see</span></emoji-button>
<emoji-button><span slot="description">lose</span></emoji-button>
<emoji-button>❤️<span slot="description">love</span></emoji-button>
<emoji-button>⛰️🏖️<span slot="description">low</span></emoji-button>
<emoji-button>🔨<span slot="description">make, create</span></emoji-button>
<emoji-button
  ><span slot="description">mean (transitive verb)</span></emoji-button
>
<emoji-button>🤝<span slot="description">meet</span></emoji-button>
<emoji-button>⇈<span slot="description">more</span></emoji-button>
<emoji-button>🚛<span slot="description">move</span></emoji-button>
<emoji-button><span slot="description">near, by</span></emoji-button>
<emoji-button>🏕️⛺<span slot="description">near, close</span></emoji-button>
<emoji-button><span slot="description">need, require</span></emoji-button>
<emoji-button>🐣<span slot="description">new, young</span></emoji-button>
<emoji-button><span slot="description">next to, beside</span></emoji-button>
<emoji-button
  >👎<span slot="description"
    >No; I disagree; Let’s not do it</slot
  ></emoji-button
>
<emoji-button>の<span slot="description">of; possessive</span></emoji-button>
<emoji-button>↥<span slot="description">off</span></emoji-button>
<emoji-button>🆗<span slot="description">OK</span></emoji-button>
<emoji-button><span slot="description">old</span></emoji-button>
<emoji-button>⤓<span slot="description">on</span></emoji-button>
<emoji-button><span slot="description">only</span></emoji-button>
<emoji-button>📕📖<span slot="description">open</span></emoji-button>
<emoji-button>↔️<span slot="description">or</span></emoji-button>
<emoji-button><span slot="description">other</span></emoji-button>
<emoji-button>⎋<span slot="description">out, outside</span></emoji-button>
<emoji-button>⤼"<span slot="description">over</span></emoji-button>
<emoji-button><span slot="description">pass</span></emoji-button>
<emoji-button>☜<span slot="description">passive</span></emoji-button>
<emoji-button>💸<span slot="description">pay, spend</span></emoji-button>
<emoji-button>[🐈🐕]<span slot="description">pet</span></emoji-button>
<emoji-button><span slot="description">play</span></emoji-button>
<emoji-button>🙏🏻<span slot="description">please</span></emoji-button>
<emoji-button
  >🐿️<span slot="description">prepare, get ready</span></emoji-button
>
<emoji-button><span slot="description">pull</span></emoji-button>
<emoji-button><span slot="description">push</span></emoji-button>
<emoji-button><span slot="description">put</span></emoji-button>
<emoji-button>？<span slot="description">question</span></emoji-button>
<emoji-button>¿<span slot="description">question</span></emoji-button>
<emoji-button><span slot="description">reach</span></emoji-button>
<emoji-button>📚<span slot="description">read</span></emoji-button>
<emoji-button><span slot="description">real</span></emoji-button>
<emoji-button>📥<span slot="description">receive</span></emoji-button>
<emoji-button><span slot="description">recent</span></emoji-button>
<emoji-button>🟥<span slot="description">red</span></emoji-button>
<emoji-button>🎓↤<span slot="description">remember</span></emoji-button>
<emoji-button>🌅<span slot="description">rise, lift</span></emoji-button>
<emoji-button>🏃<span slot="description">run</span></emoji-button>
<emoji-button>⚖️<span slot="description">same</span></emoji-button>
<emoji-button>😮<span slot="description">say, speak, talk</span></emoji-button>
<emoji-button>🏫<span slot="description">school</span></emoji-button>
<emoji-button>👀<span slot="description">see, look, watch</span></emoji-button>
<emoji-button
  >🪞<span slot="description">seem, appear (Mirror)</span></emoji-button
>
<emoji-button>_<span slot="description">self</span></emoji-button>
<emoji-button>📤<span slot="description">send</span></emoji-button>
<emoji-button>♀️<span slot="description">She</span></emoji-button>
<emoji-button><span slot="description">short</span></emoji-button>
<emoji-button><span slot="description">show</span></emoji-button>
<emoji-button>🪑<span slot="description">sit</span></emoji-button>
<emoji-button>🐢<span slot="description">slow</span></emoji-button>
<emoji-button>🐜<span slot="description">small, little</span></emoji-button>
<emoji-button><span slot="description">some</span></emoji-button>
<emoji-button><span slot="description">special</span></emoji-button>
<emoji-button>💸<span slot="description">spend, pay</span></emoji-button>
<emoji-button>🧍<span slot="description">stand</span></emoji-button>
<emoji-button><span slot="description">stay, remain</span></emoji-button>
<emoji-button>🛑<span slot="description">stop</span></emoji-button>
<emoji-button>💪<span slot="description">strong</span></emoji-button>
<emoji-button><span slot="description">suggest</span></emoji-button>
<emoji-button>↤<span slot="description">take, get</span></emoji-button>
<emoji-button>😮<span slot="description">talk, say, speak</span></emoji-button>
<emoji-button>💬<span slot="description">tell</span></emoji-button>
<emoji-button>👈<span slot="description">that</span></emoji-button>
<emoji-button>💭<span slot="description">think</span></emoji-button>
<emoji-button>👉<span slot="description">this</span></emoji-button>
<emoji-button>♟♟<span slot="description">those</span></emoji-button>
<emoji-button>⤃"<span slot="description">through</span></emoji-button>
<emoji-button>♾️<span slot="description">to (infinitive)</span></emoji-button>
<emoji-button>➡️<span slot="description">to, for</span></emoji-button>
<emoji-button>🧗<span slot="description">try</span></emoji-button>
<emoji-button>💡<span slot="description">understand</span></emoji-button>
<emoji-button>🔓<span slot="description">unlock</span></emoji-button>
<emoji-button><span slot="description">until</span></emoji-button>
<emoji-button>⬆️<span slot="description">up</span></emoji-button>
<emoji-button>💪<span slot="description">use</span></emoji-button>
<emoji-button>⏳<span slot="description">wait</span></emoji-button>
<emoji-button>🚶<span slot="description">walk</span></emoji-button>
<emoji-button>❤️‍🔥<span slot="description">want</span></emoji-button>
<emoji-button>👀<span slot="description">watch, look, see</span></emoji-button>
<emoji-button>👇👇<span slot="description">we/us</span></emoji-button>
<emoji-button>❄️<span slot="description">weak</span></emoji-button>
<emoji-button>_？<span slot="description">what</span></emoji-button>
<emoji-button>🕓？<span slot="description">when</span></emoji-button>
<emoji-button>📍？<span slot="description">where</span></emoji-button>
<emoji-button>♟？<span slot="description">who</span></emoji-button>
<emoji-button><span slot="description">whole</span></emoji-button>
<emoji-button>¿?<span slot="description">why</span></emoji-button>
<emoji-button>⤻<span slot="description">will (future)</span></emoji-button>
<emoji-button>💯<span slot="description">win</span></emoji-button>
<emoji-button>🧞<span slot="description">wish</span></emoji-button>
<emoji-button>🛠️<span slot="description">work</span></emoji-button>
<emoji-button>✍️<span slot="description">write</span></emoji-button>
<emoji-button
  >👍<span slot="description"
    >Yes; cool; I agree; Let’s do it</slot
  ></emoji-button
>
<emoji-button>👆👆<span slot="description">you (pl.)</span></emoji-button>
<emoji-button>👆<span slot="description">you (sing.)</span></emoji-button>
<emoji-button>🤔<span slot="description">Hmm</span></emoji-button>
      </div>
    `;
  }
}

customElements.define("emoji-grid", EmojiGrid);
