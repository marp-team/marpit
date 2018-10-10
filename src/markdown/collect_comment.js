/** @module */

/**
 * Marpit collect comment plugin.
 *
 * Collect parsed comments except marked as used for internally, and store to
 * lastComments member of Marpit instance. It would use in the returned object
 * from {@link Marpit#render}.
 *
 * @alias module:markdown/collect_comment
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Marpit} marpit Marpit instance.
 */
function collectComment(md, marpit) {
  md.core.ruler.push('marpit_collect_comment', state => {
    if (state.inlineMode) return

    marpit.lastComments = []

    let currentPage

    const collect = token => {
      if (
        currentPage >= 0 &&
        !(token.meta && token.meta.marpitCommentParsed !== undefined)
      )
        marpit.lastComments[currentPage].push(token.content)
    }

    for (const token of state.tokens) {
      if (
        token.type === 'marpit_slide_open' &&
        token.meta &&
        token.meta.marpitSlide !== undefined
      ) {
        currentPage = token.meta.marpitSlide

        if (currentPage >= 0 && marpit.lastComments[currentPage] === undefined)
          marpit.lastComments[currentPage] = []
      } else if (token.type === 'marpit_slide_close') {
        currentPage = undefined
      } else if (token.type === 'marpit_comment') {
        collect(token)
      } else if (token.type === 'inline') {
        for (const t of token.children)
          if (t.type === 'marpit_comment') collect(t)
      }
    }
  })
}

export default collectComment
