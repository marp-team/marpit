/** @module */
import marpitPlugin from './marpit_plugin'

const fragmentedListMarkups = ['*', ')']

/**
 * Marpit fragment plugin.
 *
 * @alias module:markdown/fragment
 * @param {MarkdownIt} md markdown-it instance.
 */
function fragment(md) {
  // Fragmented list
  md.core.ruler.after('marpit_directives_parse', 'marpit_fragment', state => {
    if (state.inlineMode) return

    for (const token of state.tokens) {
      if (
        token.type === 'list_item_open' &&
        fragmentedListMarkups.includes(token.markup)
      ) {
        token.meta = token.meta || {}
        token.meta.marpitFragment = true
      }
    }
  })

  // Add data-marpit-fragment(s) attributes to token
  md.core.ruler.after('marpit_fragment', 'marpit_apply_fragment', state => {
    if (state.inlineMode) return

    const fragments = { slide: undefined, count: 0 }

    for (const token of state.tokens) {
      if (token.meta && token.meta.marpitSlideElement === 1) {
        fragments.slide = token
        fragments.count = 0
      } else if (token.meta && token.meta.marpitSlideElement === -1) {
        if (fragments.slide && fragments.count > 0) {
          fragments.slide.attrSet('data-marpit-fragments', fragments.count)
        }
      } else if (token.meta && token.meta.marpitFragment) {
        fragments.count += 1

        token.meta.marpitFragment = fragments.count
        token.attrSet('data-marpit-fragment', fragments.count)
      }
    }
  })
}

export default marpitPlugin(fragment)
