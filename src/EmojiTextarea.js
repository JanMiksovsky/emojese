import AutoSizeTextarea from "../node_modules/elix/src/base/AutoSizeTextarea.js";
import KeyboardMixin from "../node_modules/elix/src/base/KeyboardMixin.js";

const Base = KeyboardMixin(AutoSizeTextarea);

export default class EmojiTextarea extends Base {
  // [keydown](event) {
  //   let handled;
  //   switch (event.key) {
  //     // Enter indicates user wants to select an item.
  //     case "Enter":
  //       this.dispatchEvent(new CustomEvent("select-item"));
  //       break;
  //   }
  //   // Prefer our result if it's defined, otherwise use base result.
  //   return handled || (super[keydown] && super[keydown](event));
  // }
}

customElements.define("emoji-textarea", EmojiTextarea);
