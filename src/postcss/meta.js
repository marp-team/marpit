/** @module */
import postcssPlugin from '../helpers/postcss_plugin'

/**
 * Marpit PostCSS meta plugin.
 *
 * Parse CSS comment written in the format of `@key value`.
 *
 * @param {Object} [opts]
 * @param {Object} [opts.metaType] An object for defined types for metadata.
 * @alias module:postcss/meta
 */
const plugin = postcssPlugin(
  'marpit-postcss-meta',
  (opts = {}) =>
    (css, { result }) => {
      const metaType = opts.metaType || {}

      result.marpitMeta = result.marpitMeta || {}

      css.walkComments((comment) => {
        comment.text
          .slice(0)
          .replace(/^[*!\s]*@([\w-]+)\s+(.+)$/gim, (_, metaName, value) => {
            if (metaType[metaName] === Array) {
              // Array meta
              result.marpitMeta[metaName] = [
                ...(result.marpitMeta[metaName] || []),
                value,
              ]
            } else {
              // String meta (default)
              result.marpitMeta[metaName] = value
            }
          })
      })
    }
)

export default plugin
