import AutoSizeTextarea from "../node_modules/elix/src/base/AutoSizeTextarea.js";
import KeyboardMixin from "../node_modules/elix/src/base/KeyboardMixin.js";

const Base = KeyboardMixin(AutoSizeTextarea);

export default class EmojiTextarea extends Base {}

customElements.define("emoji-textarea", EmojiTextarea);
