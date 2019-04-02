/** @module */
import marpitPlugin from './marpit_plugin'
import split from '../helpers/split'
import wrapTokens from '../helpers/wrap_tokens'

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
      : i => (anchor ? `${i + 1}` : undefined)

  md.core.ruler.push('marpit_slide', state => {
    if (state.inlineMode) return

    state.tokens = split(state.tokens, t => t.type === 'hr', true).reduce(
      (arr, slideTokens, idx) => {
        const hrFirst = slideTokens[0] && slideTokens[0].type === 'hr'

        return [
          ...arr,
          ...wrapTokens(
            state.Token,
            'marpit_slide',
            {
              ...(opts.attributes || {}),
              tag: 'section',
              id: anchorCallback(idx),
              open: {
                block: true,
                meta: { marpitSlide: idx, marpitSlideElement: 1 },
                map: hrFirst ? slideTokens[0].map : undefined,
              },
              close: {
                block: true,
                meta: { marpitSlide: idx, marpitSlideElement: -1 },
              },
            },
            slideTokens.slice(hrFirst ? 1 : 0)
          ),
        ]
      },
      []
    )
  })
}

export default marpitPlugin(slide)
