/** @module */
import marpitPlugin from '../plugin'

/**
 * Marpit collect plugin.
 *
 * Collect parsed tokens per slide and comments except marked as used for
 * internally. These will store to lastSlideTokens and lastComments member of
 * Marpit instance. It would use in the returned object from
 * {@link Marpit#render}.
 *
 * @alias module:markdown/collect
 * @param {MarkdownIt} md markdown-it instance.
 */
function collect(md) {
  const { marpit } = md

  md.core.ruler.push('marpit_collect', state => {
    if (state.inlineMode) return

    marpit.lastComments = []
    marpit.lastSlideTokens = []

    let currentPage
    let pageIdx = -1

    const collectComment = token => {
      if (
        currentPage >= 0 &&
        !(token.meta && token.meta.marpitCommentParsed !== undefined)
      )
        marpit.lastComments[currentPage].push(token.content)
    }

    const collectable = () =>
      currentPage >= 0 && marpit.lastSlideTokens[currentPage] !== undefined

    for (const token of state.tokens) {
      if (token.meta && token.meta.marpitSlideElement === 1) {
        pageIdx += 1
        currentPage = pageIdx

        if (marpit.lastSlideTokens[currentPage] === undefined) {
          marpit.lastSlideTokens[currentPage] = [token]
          marpit.lastComments[currentPage] = []
        }
      } else if (token.meta && token.meta.marpitSlideElement === -1) {
        if (collectable()) marpit.lastSlideTokens[currentPage].push(token)
        currentPage = undefined
      } else {
        if (collectable()) marpit.lastSlideTokens[currentPage].push(token)

        if (token.type === 'marpit_comment') {
          collectComment(token)
        } else if (token.type === 'inline') {
          for (const t of token.children)
            if (t.type === 'marpit_comment') collectComment(t)
        }
      }
    }
  })
}

export default marpitPlugin(collect)
