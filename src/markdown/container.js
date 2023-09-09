/** @module */
import { wrapArray } from '../helpers/wrap_array'
import { wrapTokens } from '../helpers/wrap_tokens'
import marpitPlugin from '../plugin'

/**
 * Marpit container plugin.
 *
 * @function container
 * @param {MarkdownIt} md markdown-it instance.
 */
function _container(md) {
  const containers = wrapArray(md.marpit.options.container)
  if (!containers) return

  const target = [...containers].reverse()

  md.core.ruler.push('marpit_containers', (state) => {
    if (state.inlineMode) return

    for (const cont of target)
      state.tokens = wrapTokens(
        state.Token,
        'marpit_containers',
        cont,
        state.tokens,
      )
  })
}

export const container = marpitPlugin(_container)
export default container
