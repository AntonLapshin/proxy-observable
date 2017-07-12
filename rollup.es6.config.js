import resolve from "rollup-plugin-node-resolve";

export default {
  entry: "src/proxy.js",
  format: "umd",
  moduleName: "observable",
  plugins: [resolve()],
  dest: "bin/proxy.observable.es6.js"
};
