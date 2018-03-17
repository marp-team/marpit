/** @module */
import postcss from 'postcss'

/**
 * Marpit PostCSS meta plugin.
 *
 * Parse CSS comment written in the format of `@key value`.
 *
 * @alias module:postcss/meta
 */
const plugin = postcss.plugin('marpit-postcss-meta', () => (css, ret) => {
  ret.marpitMeta = ret.marpitMeta || {}

  css.walkComments(comment => {
    comment.text
      .slice(0)
      .replace(
        /^[*\s]*@([a-z][a-z0-9]*)\s+(.+)$/gim,
        (matched, metaName, value) => {
          ret.marpitMeta[metaName] = value
        }
      )
  })
})

export default plugin
