/** @module */
import marpitPlugin from './marpit_plugin'
import wrapArray from '../helpers/wrap_array'
import wrapTokens from '../helpers/wrap_tokens'

/**
 * Marpit container plugin.
 *
 * @alias module:markdown/container
 * @param {MarkdownIt} md markdown-it instance.
 */
function container(md) {
  const containers = wrapArray(md.marpit.options.container)
  if (!containers) return

  const target = [...containers].reverse()

  md.core.ruler.push('marpit_containers', state => {
    if (state.inlineMode) return

    for (const cont of target)
      state.tokens = wrapTokens(
        state.Token,
        'marpit_containers',
        cont,
        state.tokens
      )
  })
}

export default marpitPlugin(container)
