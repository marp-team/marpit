/** @module */
import Token from 'markdown-it/lib/token'
import wrapTokens from '../helpers/wrap_tokens'

/**
 * Marpit marginals plugin.
 *
 * At each slide, add header and footer that are provided by directives.
 *
 * @alias module:markdown/marginals
 * @param {MarkdownIt} md markdown-it instance.
 */
function marginals(md) {
  md.core.ruler.after('marpit_directives_apply', 'marpit_marginals', state => {
    if (state.inlineMode) return

    const renderedInlines = new Map()
    const getRendered = markdown => {
      let rendered = renderedInlines.get(markdown)

      if (!rendered) {
        rendered = md.renderInline(markdown, state.env)
        renderedInlines.set(markdown, rendered)
      }

      return rendered
    }

    const createMarginalTokens = (tag, markdown) => {
      const token = new Token('html_block', '', 0)
      token.content = getRendered(markdown)

      return wrapTokens(`marpit_${tag}`, { tag, close: { block: true } }, [
        token,
      ])
    }

    let current

    state.tokens = state.tokens.reduce((arr, token) => {
      let concats = [token]

      if (token.type === 'marpit_slide_open') {
        current = token

        if (current.meta && current.meta.marpitHeader)
          concats = [
            ...concats,
            ...createMarginalTokens('header', current.meta.marpitHeader),
          ]
      } else if (token.type === 'marpit_slide_close') {
        if (current.meta && current.meta.marpitFooter)
          concats = [
            ...createMarginalTokens('footer', current.meta.marpitFooter),
            ...concats,
          ]
      }

      return [...arr, ...concats]
    }, [])
  })
}

export default marginals
