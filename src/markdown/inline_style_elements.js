/** @module */
const styleMatcher = /<style.*?>([\s\S]*?)<\/style>/gi

/**
 * Marpit inline style elements plugin.
 *
 * Parse `<style>` elements and store to meta for using at {@link ThemeSet#pack}
 * to append custom style. Inline styles will strip regardless of html setting
 * provided by markdown-it.
 *
 * @alias module:markdown/inline_style_elements
 * @param {MarkdownIt} md markdown-it instance.
 */
function inlineStyleElements(md) {
  md.core.ruler.after('block', 'marpit_inline_style_elements', state => {
    if (state.inlineMode) return

    state.tokens.forEach(token => {
      token.meta = token.meta || {}
      token.meta.marpitInlineStyleElements = []

      if (token.type === 'html_block' || token.type === 'inline') {
        token.content = token.content.replace(
          styleMatcher,
          (matched, styleText) => {
            token.meta.marpitInlineStyleElements.push(styleText.trim())
            return ''
          }
        )
      }
    })
  })
}

export default inlineStyleElements
