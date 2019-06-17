/** @module */
import postcss from 'postcss'

/**
 * Marpit PostCSS meta plugin.
 *
 * Parse CSS comment written in the format of `@key value`.
 *
 * @param {Object} [opts]
 * @param {Object} [opts.metaType] An object for defined types for metadata.
 * @alias module:postcss/meta
 */
const plugin = postcss.plugin(
  'marpit-postcss-meta',
  (opts = {}) => (css, ret) => {
    const metaType = opts.metaType || {}

    ret.marpitMeta = ret.marpitMeta || {}

    css.walkComments(comment => {
      comment.text
        .slice(0)
        .replace(/^[*!\s]*@([\w-]+)\s+(.+)$/gim, (_, metaName, value) => {
          if (metaType[metaName] === Array) {
            // Array meta
            ret.marpitMeta[metaName] = [
              ...(ret.marpitMeta[metaName] || []),
              value,
            ]
          } else {
            // String meta (default)
            ret.marpitMeta[metaName] = value
          }
        })
    })
  }
)

export default plugin
