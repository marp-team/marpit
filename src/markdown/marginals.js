/** @module */
import split from '../helpers/split'
import wrapTokens from '../helpers/wrap_tokens'

/**
 * Marpit marginals plugin.
 *
 * Add header and footer to each slide.
 *
 * @alias module:markdown/marginals
 * @param {MarkdownIt} md markdown-it instance.
 */
function marginals(md) {
  md.core.ruler.after('marpit_directives_apply', 'marpit_marginals', state => {
    if (state.inlineMode) return

    state.tokens = split(
      state.tokens,
      t => t.meta && (t.meta.marpitHeader || t.meta.marpitFooter),
      true
    ).reduce((arr, tokens) => {
      if (tokens.length === 0) return arr

      // TODO: Add marginals
      return [...arr, ...tokens]
    }, [])
  })
}

export default marginals
