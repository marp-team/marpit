/** @module */
import wrapTokens from '../helpers/wrap_tokens'

/**
 * Marpit header and footer plugin.
 *
 * At each slide, add header and footer that are provided by directives.
 *
 * @alias module:markdown/header_and_footer
 * @param {MarkdownIt} md markdown-it instance.
 */
function headerAndFooter(md) {
  md.core.ruler.after(
    'marpit_directives_apply',
    'marpit_header_and_footer',
    state => {
      if (state.inlineMode) return

      const parsedInlines = new Map()
      const getParsed = markdown => {
        let parsed = parsedInlines.get(markdown)

        if (!parsed) {
          parsed = md.parseInline(markdown, state.env)
          delete parsed.map

          parsedInlines.set(markdown, parsed)
        }

        return parsed
      }

      const createMarginalTokens = (tag, markdown) =>
        wrapTokens(
          `marpit_${tag}`,
          { tag, close: { block: true } },
          getParsed(markdown)
        )

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
    }
  )
}

export default headerAndFooter
