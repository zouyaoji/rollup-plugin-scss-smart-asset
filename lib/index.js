const path = require('path')
const fs = require("fs-extra")
// dependencies
const pluginUtils = require('@rollup/pluginutils')
const postcss = require("postcss")
const url = require("postcss-url")
const chalk = require('chalk')
const concat = require('source-map-concat')

// originally taken from https://github.com/differui/rollup-plugin-sass/blob/master/src/index.js
// adds source map from Sass compiler.
module.exports = function sass (options = {}) {
  options = Object.assign({
    include: [
      '**/*.css',
      '**/*.sass',
      '**/*.scss',
    ],
    exclude: undefined,
    output: false,
    insert: false,
    postProcess: style => style,
    banner: '',
    sassConfig: undefined,
    postcssConfig: undefined,
    postcssUrlConfig: {
      url: 'rebase'
    },
  }, options)

  const filter = pluginUtils.createFilter(options.include, options.exclude)
  const styles = []
  const styleMaps = {}
  const insertFnName = '___$insertStyle';
  return {
    name: 'scss-smart-asset',
    intro () {
      if (options.insert) {
        return insertStyle.toString().replace(/insertStyle/, insertFnName);
      }
    },
    async transform (code, id) {
      if (!filter(id)) return
      const paths = [path.dirname(id), process.cwd()]
      const sassConfig = Object.assign({
        file: id,
        outFile: id,
        sourceMap: true,
        data: code,
        indentedSyntax: path.extname(id) === '.sass',
        omitSourceMapUrl: true,
        sourceMapContents: true,
      }, options.sassConfig)
      sassConfig.includePaths = sassConfig.includePaths
        ? sassConfig.includePaths.concat(paths.filter(x => !sassConfig.includePaths.includes(x)))
        : paths

      postcssConfig = Object.assign({
        from: id,
        to: id
      }, options.postcssConfig)

      try {
        let { css, map } = require('node-sass').renderSync(sassConfig)
        code = css.toString().trim()
        map = map.toString()

        if (!code) return
        // process css
        const output = postcss()
          .use(url(options.postcssUrlConfig))
          .process(code, postcssConfig)
        code = output.css
        return Promise.resolve({ id, code, map })
          .then(options.postProcess)
          .then(style => {
            if (!styleMaps[id]) {
              styles.push(styleMaps[id] = style)
            }
            if (options.insert === true) {
              return {
                id: id,
                code: `export default ${insertFnName}(${JSON.stringify(style.code)})`,
                map: style.map,
              }
            } else if (options.output === false) {
              return {
                id: id,
                code: `export default ${JSON.stringify(style.code)}`,
                map: style.map,
              }
            }
            return ''
          })
      } catch (error) {
        throw error
      }
    },
    async generateBundle (generateOptions) {
      if (!styles.length || options.output === false) {
        return
      }

      if (typeof options.output === 'function') {
        return options.output(styles)
      }
      let dest =
        typeof options.output === "string"
          ? options.output
          : generateOptions.file;

      if (dest.endsWith(".js") || dest.endsWith(".ts")) {
        dest = dest.slice(0, -3);
        dest = `${dest}.css`;
      }

      if (!dest || options.insert) return
      const res = concatFiles(
        styles.map(({ id, code, map }) => ({
          code,
          map,
          sourcesRelativeTo: id,
        })),
        dest,
        options.banner
      )
      return Promise.all([
        writeFile(dest, res.code),
        writeFile(dest + '.map', JSON.stringify(res.map)),
      ]).then(([css, map]) => {
        console.log(css.path, chalk.gray(css.size))
        console.log(map.path, chalk.gray(map.size))
        return { css, map }
      })
    },
  }
}

function writeFile (dest, data) {
  return fs.outputFile(dest, data)
    .then(() => ({
      path: dest,
      size: getSize(data)
    }))
}

function concatFiles (files, dest, banner) {
  const concatenated = concat(files, {
    delimiter: '\n',
    mapPath: dest + '.map'
  })

  if (banner) {
    concatenated.prepend(banner + '\n')
  }

  const { code, map } = concatenated.toStringWithSourceMap({
    file: path.basename(dest)
  })

  return {
    id: dest,
    code: code,
    map: map.toJSON()
  }
}

function getSize (data) {
  const bytes = data.length || 0

  return bytes < 10000
    ? bytes.toFixed(0) + ' B'
    : bytes < 1024000
      ? (bytes / 1024).toPrecision(3) + ' kB'
      : (bytes / 1024 / 1024).toPrecision(4) + ' MB'
}

function insertStyle (css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  const style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}
