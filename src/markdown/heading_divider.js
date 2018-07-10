/** @module */
import split from '../helpers/split'

/**
 * Marpit heading divider plugin.
 *
 * Start a new slide page at before of headings.
 *
 * @alias module:markdown/heading_divider
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Marpit} marpit Marpit instance.
 */
function headingDivider(md, marpit) {
  md.core.ruler.before('marpit_slide', 'marpit_heading_divider', state => {
    let target = marpit.options.headingDivider

    if (state.inlineMode || target === false) return

    if (Number.isInteger(target) && target >= 1 && target <= 6)
      target = [...Array(headingDivider).keys()].map(i => i + 1)

    if (!Array.isArray(target))
      throw new Error('Invalid headingDivider option.')

    const splitTag = target.map(i => `h${i}`)

    state.tokens = split(
      state.tokens,
      t => t.type === 'heading_open' && splitTag.includes(t.tag),
      true
    ).reduce((arr, slideTokens) => {
      // TODO: Prepend hidden ruler token at before headings
      const isHeading = slideTokens[0] && slideTokens[0].type === 'heading_open'

      return [...arr, ...slideTokens]
    }, [])
  })
}

export default headingDivider
