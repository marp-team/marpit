/** @module */
import marpitPlugin from '../plugin'
import split from '../helpers/split'

/**
 * Marpit heading divider plugin.
 *
 * Start a new slide page at before of headings by prepending hidden `<hr>`
 * elements.
 *
 * @alias module:markdown/heading_divider
 * @param {MarkdownIt} md markdown-it instance.
 */
function headingDivider(md) {
  const { marpit } = md

  md.core.ruler.before('marpit_slide', 'marpit_heading_divider', state => {
    let target = marpit.options.headingDivider

    if (
      marpit.lastGlobalDirectives &&
      Object.prototype.hasOwnProperty.call(
        marpit.lastGlobalDirectives,
        'headingDivider'
      )
    )
      target = marpit.lastGlobalDirectives.headingDivider

    if (state.inlineMode || target === false) return

    if (Number.isInteger(target) && target >= 1 && target <= 6)
      target = [...Array(target).keys()].map(i => i + 1)

    if (!Array.isArray(target)) return

    const splitTag = target.map(i => `h${i}`)
    const splitFunc = t => t.type === 'heading_open' && splitTag.includes(t.tag)
    const newTokens = []

    for (const slideTokens of split(state.tokens, splitFunc, true)) {
      const [token] = slideTokens

      if (token && splitFunc(token) && newTokens.some(t => !t.hidden)) {
        const hr = new state.Token('hr', '', 0)
        hr.hidden = true
        hr.map = token.map

        newTokens.push(hr)
      }

      newTokens.push(...slideTokens)
    }

    state.tokens = newTokens
  })
}

export default marpitPlugin(headingDivider)
