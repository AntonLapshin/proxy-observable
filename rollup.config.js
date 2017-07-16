import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

export default {
  entry: "src/observable.js",
  format: "umd",
  moduleName: "observable",
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      presets: [
        [
          "latest",
          {
            es2015: {
              modules: false
            }
          }
        ]
      ],
      plugins: ["external-helpers"],
      exclude: "node_modules/**" // only transpile our source code
    }),
    uglify({
      mangle: true,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    })
  ],
  dest: "bin/proxy.observable.min.js"
};
