/** @module */
import marpitPlugin from '../marpit_plugin'
import InlineStyle from '../../helpers/inline_style'

/**
 * Marpit image apply plugin.
 *
 * Apply image style and color directive for defined page based on parsed meta.
 *
 * @alias module:markdown/image/apply
 * @param {MarkdownIt} md markdown-it instance.
 */
function applyImage(md) {
  md.inline.ruler2.push('marpit_apply_image', ({ tokens }) => {
    for (const token of tokens) {
      if (token.type === 'image') {
        // Build and apply styles
        const { filters, height, width } = token.meta.marpitImage
        const style = new InlineStyle(token.attrGet('style'))

        if (width && !width.endsWith('%')) style.set('width', width)
        if (height && !height.endsWith('%')) style.set('height', height)

        if (filters) {
          const filterStyle = []

          for (const fltrs of filters)
            filterStyle.push(`${fltrs[0]}(${fltrs[1]})`)

          token.meta.marpitImage.filter = filterStyle.join(' ')
          style.set('filter', token.meta.marpitImage.filter)
        }

        const stringified = style.toString()
        if (stringified) token.attrSet('style', stringified)
      }
    }
  })
}

export default marpitPlugin(applyImage)
