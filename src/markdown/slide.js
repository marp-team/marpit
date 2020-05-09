/** @module */
import split from '../helpers/split'
import wrapTokens from '../helpers/wrap_tokens'
import marpitPlugin from '../plugin'

/**
 * Marpit slide plugin.
 *
 * Split markdown-it tokens into the slides by horizontal rule. Each slides
 * will be wrapped by section element.
 *
 * @alias module:markdown/slide
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Object} [opts]
 * @param {Object} [opts.attributes] The `<section>` element attributes by
 *     key-value pairs.
 * @param {(boolean|anchorCallback)} [opts.anchor=true] If true, assign the
 *     anchor with the page number starting from 1. You can customize anchor
 *     name by passing callback function.
 */
function slide(md, opts = {}) {
  const anchor = opts.anchor === undefined ? true : opts.anchor

  /**
   * Convert slide page index into anchor string.
   *
   * @callback anchorCallback
   * @param {number} index Slide page index, beginning from zero.
   * @returns {string} The text of anchor/id attribute (without prefix `#`).
   */
  const anchorCallback =
    typeof anchor === 'function'
      ? anchor
      : (i) => (anchor ? `${i + 1}` : undefined)

  md.core.ruler.push('marpit_slide', (state) => {
    if (state.inlineMode) return

    const splittedTokens = split(state.tokens, (t) => t.type === 'hr', true)
    const { length: marpitSlideTotal } = splittedTokens

    state.tokens = splittedTokens.reduce((arr, slideTokens, marpitSlide) => {
      const firstHr =
        slideTokens[0] && slideTokens[0].type === 'hr'
          ? slideTokens[0]
          : undefined

      const mapTarget = firstHr || slideTokens.find((t) => t.map)

      return [
        ...arr,
        ...wrapTokens(
          state.Token,
          'marpit_slide',
          {
            ...(opts.attributes || {}),
            tag: 'section',
            id: anchorCallback(marpitSlide),
            open: {
              block: true,
              meta: { marpitSlide, marpitSlideTotal, marpitSlideElement: 1 },
              map: mapTarget ? mapTarget.map : [0, 1],
            },
            close: {
              block: true,
              meta: { marpitSlide, marpitSlideTotal, marpitSlideElement: -1 },
            },
          },
          slideTokens.slice(firstHr ? 1 : 0)
        ),
      ]
    }, [])
  })
}

export default marpitPlugin(slide)
