# rollup-plugin-scss-smart-asset

🍣 一个 Rollup 插件，用[node-sass](https://github.com/sass/node-sass)处理 scss、sass、css 文件，用[postcss](https://github.com/postcss/postcss)和它的插件[postcss-url](https://github.com/postcss/postcss-url)处理`url()`方法，如处理成 base64 格式。

[![npm](https://img.shields.io/npm/v/rollup-plugin-scss-smart-asset?style=plastic)](https://www.npmjs.com/package/rollup-plugin-scss-smart-asset)
[![npm](https://img.shields.io/npm/dm/rollup-plugin-scss-smart-asset?style=plastic)](https://www.npmjs.com/package/rollup-plugin-scss-smart-asset)
[![license](https://img.shields.io/github/license/zouyaoji/rollup-plugin-scss-smart-asset?style=plastic)](https://github.com/zouyaoji/rollup-plugin-scss-smart-asset/blob/master/LICENSE)

## 安装

```bash
npm install --save-dev rollup-plugin-scss-smart-asset
```

## 使用

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

## 选项

### `output`

- 类型: `Boolean|String|Function` _(default: false)_

```js
scssSmartAsset({
  // 默认为无输出。
  output: false,

  // 将样式文件输出到 output.flie 文件同名的 .css 文件中。
  output: true,

  // 将样式文件输出到指定名称的 .css 文件中。
  output: "bundle.css",

  // 将处理结果通过回调函数返回，包含一个 styles 数组参数。
  // - styles: 按导入顺序排列的样式结果数组。
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

- 类型: `Boolean` _(default: false)_

如果您指定“ true”，则插件会将已编译的 CSS 插入“ <head />”标签中，当然也就不会输出到文件了。

```js
scssSmartAsset({
  insert: true
});
```

### `sassConfig`

- 类型: `Object`

配置 [node-sass](https://github.com/sass/node-sass) 参数。

如果您指定`data`，该插件将被视为前置 sass 字符串。
因此您可以在使用 node 的 sass 编译期间注入变量。

```js
scssSmartAsset({
  sassConfig: {
    data: "$color: #000;"
  }
});
```

### `postcssConfig`

- 类型: `Object`

配置 [postcss](https://github.com/postcss/postcss) 参数。

使用 postcss JS 插件转换样式。

```js
scssSmartAsset({
  postcssConfig: {
    from: "src/navigation.css", //
    to: "navigation.css"
  }
});
```

### `postcssUrlConfig`

- 类型: `Object`

配置 [postcss-url](https://github.com/postcss/postcss-url) 参数。

`postcss-url` 是 `postcss` 的插件，可以保证`url()`方法中引用路径的正确性，将其变为 base64 图片格式。

```js
scssSmartAsset({
  postcssUrlConfig: {
    url: "inline"
  }
});
```

## 许可

[MIT License](https://opensource.org/licenses/MIT)

Copyright (c) 2019-present, zouyaoji <370681295@qq.com>

## 实例

[vue-cesium](https://github.com/zouyaoji/vue-cesium/blob/master/build/rollup.js)
