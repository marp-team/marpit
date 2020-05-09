/** @module */
import InlineStyle from '../../helpers/inline_style'
import marpitPlugin from '../../plugin'

/**
 * Marpit image apply plugin.
 *
 * Apply image style and color spot directive based on parsed meta.
 *
 * @alias module:markdown/image/apply
 * @param {MarkdownIt} md markdown-it instance.
 */
function applyImage(md) {
  // Build and apply image style
  md.inline.ruler2.push('marpit_apply_image', ({ tokens }) => {
    for (const token of tokens) {
      if (token.type === 'image') {
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

  // Shorthand for color spot directive
  md.core.ruler.after(
    'marpit_inline_svg',
    'marpit_apply_color',
    ({ inlineMode, tokens }) => {
      if (inlineMode) return

      let current

      for (const t of tokens) {
        if (t.type === 'marpit_slide_open') current = t
        if (t.type === 'marpit_slide_close') current = undefined

        // Collect parsed inline image meta
        if (current && t.type === 'inline') {
          for (const tc of t.children) {
            if (tc.type === 'image') {
              const { background, color } = tc.meta.marpitImage

              if (!background && color) {
                current.meta.marpitDirectives = {
                  ...(current.meta.marpitDirectives || {}),
                  color,
                }
              }
            }
          }
        }
      }
    }
  )
}

export default marpitPlugin(applyImage)
