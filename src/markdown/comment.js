/** @module */
const commentMatcher = /<!--+\s*([\s\S]*?)\s*--+>/
const commentMatcherOpening = /^<!--/
const commentMatcherClosing = /-->/

/**
 * Marpit comment plugin.
 *
 * Parse HTML comment as token. Comments will strip regardless of html setting
 * provided by markdown-it.
 *
 * @alias module:markdown/comment
 * @param {MarkdownIt} md markdown-it instance.
 */
function comment(md) {
  /**
   * Based on markdown-it html_block rule
   * https://github.com/markdown-it/markdown-it/blob/master/lib/rules_block/html_block.js
   */
  md.block.ruler.before(
    'html_block',
    'marpit_comment',
    (state, startLine, endLine, silent) => {
      // Fast fail
      let pos = state.bMarks[startLine] + state.tShift[startLine]
      if (state.src.charCodeAt(pos) !== 0x3c) return false

      let max = state.eMarks[startLine]
      let line = state.src.slice(pos, max)

      // Match to opening element
      if (!commentMatcherOpening.test(line)) return false
      if (silent) return true

      // Parse ending element
      let nextLine = startLine + 1
      if (!commentMatcherClosing.test(line)) {
        while (nextLine < endLine) {
          if (state.sCount[nextLine] < state.blkIndent) break

          pos = state.bMarks[nextLine] + state.tShift[nextLine]
          max = state.eMarks[nextLine]
          line = state.src.slice(pos, max)
          nextLine += 1

          if (commentMatcherClosing.test(line)) break
        }
      }

      state.line = nextLine

      // Create token
      const token = state.push('marpit_comment', '', 0)
      token.map = [startLine, nextLine]
      token.markup = state.getLines(startLine, nextLine, state.blkIndent, true)
      token.hidden = true

      const matchedContent = commentMatcher.exec(token.markup)
      token.content = matchedContent ? matchedContent[1].trim() : ''

      return true
    }
  )
}

export default comment
