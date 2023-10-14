/** @module */
import kebabCase from 'lodash.kebabcase'
import InlineStyle from '../../helpers/inline_style'
import marpitPlugin from '../../plugin'
import builtInDirectives from './directives'

/**
 * Apply parsed Marpit directives to markdown-it tokens.
 *
 * @function apply
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Object} [opts]
 * @param {boolean} [opts.dataset=true] Assigns directives as HTML data
 *     attributes of each section tag.
 * @param {boolean} [opts.css=true] Assigns directives as CSS Custom Properties
 *     of each section tag.
 */
function _apply(md, opts = {}) {
  const { marpit } = md
  const { lang } = marpit.options

  const dataset = opts.dataset === undefined ? true : !!opts.dataset
  const css = opts.css === undefined ? true : !!opts.css

  const { global, local } = marpit.customDirectives
  const directives = [
    ...Object.keys(global),
    ...Object.keys(local),
    ...builtInDirectives,
  ]

  md.core.ruler.after(
    'marpit_directives_parse',
    'marpit_directives_apply',
    (state) => {
      if (state.inlineMode) return

      let pageNumber = 0

      const tokensForPaginationTotal = []

      for (const token of state.tokens) {
        const { marpitDirectives } = token.meta || {}

        if (token.type === 'marpit_slide_open') {
          // `skip` and `hold` disable increment of the page number
          if (
            !(
              marpitDirectives?.paginate === 'skip' ||
              marpitDirectives?.paginate === 'hold'
            )
          ) {
            pageNumber += 1
          }
        }

        if (marpitDirectives) {
          const style = new InlineStyle(token.attrGet('style'))

          for (const dir of Object.keys(marpitDirectives)) {
            if (directives.includes(dir)) {
              const value = marpitDirectives[dir]

              if (value) {
                const kebabCaseDir = kebabCase(dir)
                if (dataset) token.attrSet(`data-${kebabCaseDir}`, value)
                if (css) style.set(`--${kebabCaseDir}`, value)
              }
            }
          }

          // Apply attribute to token
          if (marpitDirectives.lang || lang)
            token.attrSet('lang', marpitDirectives.lang || lang)

          if (marpitDirectives.class)
            token.attrJoin('class', marpitDirectives.class)

          if (marpitDirectives.color) style.set('color', marpitDirectives.color)

          if (marpitDirectives.backgroundColor)
            style
              .set('background-color', marpitDirectives.backgroundColor)
              .set('background-image', 'none')

          if (marpitDirectives.backgroundImage) {
            style
              .set('background-image', marpitDirectives.backgroundImage)
              .set('background-position', 'center')
              .set('background-repeat', 'no-repeat')
              .set('background-size', 'cover')

            if (marpitDirectives.backgroundPosition)
              style.set(
                'background-position',
                marpitDirectives.backgroundPosition,
              )

            if (marpitDirectives.backgroundRepeat)
              style.set('background-repeat', marpitDirectives.backgroundRepeat)

            if (marpitDirectives.backgroundSize)
              style.set('background-size', marpitDirectives.backgroundSize)
          }

          if (
            marpitDirectives.paginate &&
            marpitDirectives.paginate !== 'skip'
          ) {
            // If the page number was still not incremented, mark this page as
            // the first page.
            if (pageNumber <= 0) pageNumber = 1

            token.attrSet('data-marpit-pagination', pageNumber)
            tokensForPaginationTotal.push(token)
          }

          if (marpitDirectives.header)
            token.meta.marpitHeader = marpitDirectives.header

          if (marpitDirectives.footer)
            token.meta.marpitFooter = marpitDirectives.footer

          const styleStr = style.toString()
          if (styleStr !== '') token.attrSet('style', styleStr)
        }
      }

      // Set total page number to each slide page that has pagination attribute
      for (const token of tokensForPaginationTotal) {
        token.attrSet('data-marpit-pagination-total', pageNumber)
      }
    },
  )
}

export const apply = marpitPlugin(_apply)
export default apply
