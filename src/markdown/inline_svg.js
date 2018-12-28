/** @module */
import split from '../helpers/split'
import wrapTokens from '../helpers/wrap_tokens'

/**
 * Marpit Inline SVG plugin.
 *
 * @alias module:markdown/inline_svg
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Marpit} marpit Marpit instance.
 */
function inlineSVG(md, marpit) {
  md.core.ruler.after('marpit_directives_parse', 'marpit_inline_svg', state => {
    if (!marpit.options.inlineSVG || state.inlineMode) return

    const { themeSet, lastGlobalDirectives } = marpit
    const w = themeSet.getThemeProp(lastGlobalDirectives.theme, 'widthPixel')
    const h = themeSet.getThemeProp(lastGlobalDirectives.theme, 'heightPixel')
    const newTokens = []

    for (const tokens of split(
      state.tokens,
      t => t.meta && t.meta.marpitSlideElement === 1,
      true
    )) {
      if (tokens.length > 0) {
        for (const t of tokens)
          if (t.meta && t.meta.marpitSlideElement)
            delete t.meta.marpitSlideElement

        newTokens.push(
          ...wrapTokens(
            'marpit_inline_svg',
            {
              tag: 'svg',
              'data-marpit-svg': '',
              viewBox: `0 0 ${w} ${h}`,
              open: { meta: { marpitSlideElement: 1 } },
              close: { meta: { marpitSlideElement: -1 } },
            },
            wrapTokens(
              'marpit_inline_svg_content',
              { tag: 'foreignObject', width: w, height: h },
              tokens
            )
          )
        )
      }
    }

    state.tokens = newTokens
  })
}

export default inlineSVG
