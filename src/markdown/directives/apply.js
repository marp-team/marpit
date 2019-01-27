/** @module */
import kebabCase from 'lodash.kebabcase'
import builtInDirectives from './directives'
import InlineStyle from '../../helpers/inline_style'

/**
 * Apply parsed Marpit directives to markdown-it tokens.
 *
 * @alias module:markdown/directives/apply
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Object} [opts]
 * @param {boolean} [opts.dataset=true] Assigns directives as HTML data
 *     attributes of each section tag.
 * @param {string[]} [opts.directives] Assignable custom directive keys.
 * @param {boolean} [opts.css=true] Assigns directives as CSS Custom Properties
 *     of each section tag.
 */
function apply(md, opts = {}) {
  const dataset = opts.dataset === undefined ? true : !!opts.dataset
  const directives = [...(opts.directives || []), ...builtInDirectives]
  const css = opts.css === undefined ? true : !!opts.css

  md.core.ruler.after(
    'marpit_directives_parse',
    'marpit_directives_apply',
    state => {
      if (state.inlineMode) return

      for (const token of state.tokens) {
        const { marpitDirectives, marpitSlide } = token.meta || {}

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
                marpitDirectives.backgroundPosition
              )

            if (marpitDirectives.backgroundRepeat)
              style.set('background-repeat', marpitDirectives.backgroundRepeat)

            if (marpitDirectives.backgroundSize)
              style.set('background-size', marpitDirectives.backgroundSize)
          }

          if (marpitDirectives.paginate)
            token.attrSet('data-marpit-pagination', marpitSlide + 1)

          if (marpitDirectives.header)
            token.meta.marpitHeader = marpitDirectives.header

          if (marpitDirectives.footer)
            token.meta.marpitFooter = marpitDirectives.footer

          const styleStr = style.toString()
          if (styleStr !== '') token.attrSet('style', styleStr)
        }
      }
    }
  )
}

export default apply
