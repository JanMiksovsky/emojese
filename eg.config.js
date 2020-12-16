import { Compose } from "@explorablegraph/core";
import { builtins } from "@explorablegraph/eg";

function toUpperCase(text) {
  return text.toUpperCase();
}
toUpperCase.usage = `toUpperCase(text)\tTransforms text to uppercase`;

const composed = new Compose({ toUpperCase }, builtins);
export default composed;

// console.log(composed);
