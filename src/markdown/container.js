/** @module */
import wrapTokens from '../helpers/wrap_tokens'

/**
 * Marpit container plugin.
 *
 * @alias module:markdown/container
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Element[]} containers Array of container elements.
 */
function container(md, containers) {
  if (!containers) return

  const target = [...containers].reverse()

  md.core.ruler.push('marpit_containers', state => {
    if (state.inlineMode) return

    for (const cont of target)
      state.tokens = wrapTokens('marpit_containers', cont, state.tokens)
  })
}

export default container
