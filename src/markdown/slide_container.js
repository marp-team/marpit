/** @module */
import split from '../helpers/split'
import wrapArray from '../helpers/wrap_array'
import wrapTokens from '../helpers/wrap_tokens'
import marpitPlugin from '../plugin'

/**
 * Marpit slide container plugin.
 *
 * @alias module:markdown/slide_container
 * @param {MarkdownIt} md markdown-it instance.
 */
function slideContainer(md) {
  const containers = wrapArray(md.marpit.options.slideContainer)
  if (!containers) return

  const target = [...containers].reverse()

  md.core.ruler.push('marpit_slide_containers', (state) => {
    if (state.inlineMode) return

    const newTokens = []

    for (const tokens of split(
      state.tokens,
      (t) => t.meta && t.meta.marpitSlideElement === 1,
      true
    )) {
      if (tokens.length > 0)
        newTokens.push(
          ...target.reduce(
            (slides, conts) =>
              wrapTokens(state.Token, 'marpit_slide_containers', conts, slides),
            tokens
          )
        )
    }

    state.tokens = newTokens
  })
}

export default marpitPlugin(slideContainer)
