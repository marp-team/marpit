/** @module */
import split from '../helpers/split'
import wrapTokens from '../helpers/wrap_tokens'

/**
 * Marpit slide container plugin.
 *
 * @alias module:markdown/slide_container
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Element[]} containers Array of container elements.
 */
function slideContainer(md, containers) {
  if (!containers) return

  const target = [...containers].reverse()

  md.core.ruler.push('marpit_slide_containers', state => {
    if (state.inlineMode) return

    const newTokens = []

    for (const tokens of split(
      state.tokens,
      t => t.meta && t.meta.marpitSlideElement === 1,
      true
    )) {
      if (tokens.length > 0)
        newTokens.push(
          ...target.reduce(
            (slides, conts) =>
              wrapTokens('marpit_slide_containers', conts, slides),
            tokens
          )
        )
    }

    state.tokens = newTokens
  })
}

export default slideContainer
