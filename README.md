# rollup-plugin-scss-smart-asset

🍣 A Rollup plugin which import .scss, .sass, .css files, and rebase, inline or copy on url(). Based on [node-sass](https://github.com/sass/node-sass), [postcss](https://github.com/postcss/postcss) and [postcss-url](https://github.com/postcss/postcss-url). [中文](https://github.com/zouyaoji/rollup-plugin-scss-smart-asset/blob/master/README.zh.md)

[![npm](https://img.shields.io/npm/v/rollup-plugin-scss-smart-asset?style=plastic)](https://www.npmjs.com/package/rollup-plugin-scss-smart-asset)
[![npm](https://img.shields.io/npm/dm/rollup-plugin-scss-smart-asset?style=plastic)](https://www.npmjs.com/package/rollup-plugin-scss-smart-asset)
[![license](https://img.shields.io/github/license/zouyaoji/rollup-plugin-scss-smart-asset?style=plastic)](https://github.com/zouyaoji/rollup-plugin-scss-smart-asset/blob/master/LICENSE)

## Installation

```bash
npm install --save-dev rollup-plugin-scss-smart-asset
```

## Usage

```js
// rollup.config.js
import scssSmartAsset from 'rollup-plugin-scss-smart-asset';

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'es',
  },
  plugins: [
    scssSmartAsset()
  ]
})
```

## Options

### `output`

- Type: `Boolean|String|Function` _(default: false)_

```js
scssSmartAsset({
  // Default behaviour disable output
  output: false,

  // Write all styles to the bundle destination where .js is replaced by .css
  output: true,

  // Filename to write all styles
  output: "bundle.css",

  // Callback that will be called generateBundle with an arguments:
  // - styles: the concatenated styles in order of imported
  //  [
  //    { id: './style1.css', code: 'body {\n  color: red; }' , map: '...' },
  //    { id: './style2.css', code: 'body {\n  color: green; }' , map: '...' },
  //  ]
  output(styles) {
    writeFileSync("bundle.css", styles);
  }
});
```

### `insert`

- Type: `Boolean` _(default: false)_

If you specify `true`, the plugin will insert compiled CSS into `<head/>` tag.

```js
scssSmartAsset({
  insert: true
});
```

### `sassConfig`

- Type: `Object`

Options for [node-sass](https://github.com/sass/node-sass).

If you specify `data`, the plugin will treat as prepend sass string.
Since you can inject variables during sass compilation with node.

```js
scssSmartAsset({
  sassConfig: {
    data: "$color: #000;"
  }
});
```

### `postcssConfig`

- Type: `Object`

Options for [postcss](https://github.com/postcss/postcss).

Transforming styles with JS plugins .

```js
scssSmartAsset({
  postcssConfig: {
    from: "src/navigation.css",
    to: "navigation.css"
  }
});
```

### `postcssUrlConfig`

- Type: `Object`

Options for [postcss-url](https://github.com/postcss/postcss-url).

[PostCSS](https://github.com/postcss/postcss) plugin to rebase, inline or copy on url().

```js
scssSmartAsset({
  postcssUrlConfig: {
    url: "inline"
  }
});
```

## License

[MIT License](https://opensource.org/licenses/MIT)

Copyright (c) 2019-present, zouyaoji <370681295@qq.com>

## Example

[vue-cesium](https://github.com/zouyaoji/vue-cesium/blob/master/build/rollup.js)
