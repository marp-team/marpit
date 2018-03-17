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

    state.tokens.forEach((token, idx) => {
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

        // Mark empty paragraph as hidden
        if (token.content === '') {
          const prevToken = state.tokens[idx - 1]
          const nextToken = state.tokens[idx + 1]

          if (
            prevToken &&
            nextToken &&
            prevToken.type === 'paragraph_open' &&
            nextToken.type === 'paragraph_close'
          ) {
            token.hidden = true
            prevToken.hidden = true
            nextToken.hidden = true
          }
        }
      }
    })
  })
}

export default comment
