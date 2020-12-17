// As of December 2020, the useful Graphemer library is not yet an ES module,
// so we resort to compiling it with Browserify to produce a global.
const graphemer = require("graphemer");
window.Graphemer = graphemer.default;
