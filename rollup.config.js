import { terser } from "rollup-plugin-terser";

export default {
  input: "src/EmojeseComposer.js",
  output: [
    {
      file: "static/build.js",
      format: "es",
      plugins: [terser()],
    },
  ],
};
