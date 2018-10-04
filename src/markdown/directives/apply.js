/** @module */
import kebabCase from 'lodash.kebabcase'
import { globals, locals } from './directives'
import InlineStyle from '../../helpers/inline_style'

const publicDirectives = [...Object.keys(globals), ...Object.keys(locals)]

/**
 * Apply parsed Marpit directives to markdown-it tokens.
 *
 * @alias module:markdown/directives/apply
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Object} [opts]
 * @param {boolean} [opts.dataset=true] Assigns directives as HTML data
 *     attributes of each section tag.
 * @param {boolean} [opts.css=true] Assigns directives as CSS Custom Properties
 *     of each section tag.
 * @param {boolean} [opts.includeInternal=false] Whether include internal
 *     directives (Undefined in {@link module:markdown/directives/directives}.)
 *     In default, internal directives are not applied to HTML/CSS.
 */
function apply(md, opts = {}) {
  const dataset = opts.dataset === undefined ? true : !!opts.dataset
  const css = opts.css === undefined ? true : !!opts.css

  const filterFunc = key =>
    !!opts.includeInternal || publicDirectives.includes(key)

  md.core.ruler.after(
    'marpit_directives_parse',
    'marpit_directives_apply',
    state => {
      if (state.inlineMode) return

      for (const token of state.tokens) {
        const { marpitDirectives, marpitSlide } = token.meta || {}

        if (marpitDirectives) {
          const style = new InlineStyle(token.attrGet('style'))

          for (const dir of Object.keys(marpitDirectives).filter(filterFunc)) {
            const value = marpitDirectives[dir]

            if (value) {
              const kebabCaseDir = kebabCase(dir)
              if (dataset) token.attrSet(`data-${kebabCaseDir}`, value)
              if (css) style.set(`--${kebabCaseDir}`, value)
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
