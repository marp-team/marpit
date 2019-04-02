/** @module */
import marpitPlugin from './marpit_plugin'
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
          state.Token,
          `marpit_${tag}`,
          { tag, close: { block: true } },
          getParsed(markdown)
        )

      let current
      const newTokens = []

      for (const token of state.tokens) {
        if (token.type === 'marpit_slide_open') {
          current = token
          newTokens.push(token)

          if (current.meta && current.meta.marpitHeader)
            newTokens.push(
              ...createMarginalTokens('header', current.meta.marpitHeader)
            )
        } else if (token.type === 'marpit_slide_close') {
          if (current.meta && current.meta.marpitFooter)
            newTokens.push(
              ...createMarginalTokens('footer', current.meta.marpitFooter)
            )

          newTokens.push(token)
        } else {
          newTokens.push(token)
        }
      }

      state.tokens = newTokens
    }
  )
}

export default marpitPlugin(headerAndFooter)
