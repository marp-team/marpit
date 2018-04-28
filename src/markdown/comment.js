/** @module */
const commentMatcher = /<!--+\s*([\s\S]*?)\s*--+>/g

/**
 * Marpit comment plugin.
 *
 * Parse HTML comment and store to meta. Comments will strip regardless of html
 * setting provided by markdown-it.
 *
 * @alias module:markdown/comment
 * @param {MarkdownIt} md markdown-it instance.
 */
function comment(md) {
  md.core.ruler.after('block', 'marpit_comment', state => {
    if (state.inlineMode) return

    state.tokens.forEach(token => {
      token.meta = token.meta || {}
      token.meta.marpitComment = []

      if (token.type === 'html_block' || token.type === 'inline') {
        token.content = token.content.replace(
          commentMatcher,
          (matched, commentText) => {
            token.meta.marpitComment.push(commentText)
            return ''
          }
        )
      }
    })
  })
}

export default comment
