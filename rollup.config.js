// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
const scssSmartAsset = require('./lib/index');
export default {
  input: 'test/src/main.js',
  output: {
    name: 'Test',
    file: 'test/dist/bundle.js',
    format: 'umd'
  },
  plugins: [
    resolve(),
    cjs(),
    scssSmartAsset({
      // insert: true,
      // output: 'test/dist/style.css',
      output: true,
      postcssConfig: {
        from: 'test/src/style.css',
        to: 'test/dist/bundle.css'
      },
      postcssUrlConfig: {
        // url: 'rebase'
        url: 'inline'
      }
    })
  ]
};
