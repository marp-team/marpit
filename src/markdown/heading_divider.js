/** @module */
import Token from 'markdown-it/lib/token'
import split from '../helpers/split'

/**
 * Marpit heading divider plugin.
 *
 * Start a new slide page at before of headings by prepending hidden `<hr>`
 * elements.
 *
 * @alias module:markdown/heading_divider
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Marpit} marpit Marpit instance.
 */
function headingDivider(md, marpit) {
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

    state.tokens = split(state.tokens, splitFunc, true).reduce(
      (arr, slideTokens) => {
        const [firstToken] = slideTokens

        if (
          !(firstToken && splitFunc(firstToken)) ||
          arr.filter(t => !t.hidden).length === 0
        )
          return [...arr, ...slideTokens]

        const token = new Token('hr', '', 0)
        token.hidden = true

        return [...arr, token, ...slideTokens]
      },
      []
    )
  })
}

export default headingDivider
