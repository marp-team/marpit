/** @module */
import kebabCase from 'lodash.kebabcase'
import { globals, locals } from './directives'

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

      state.tokens.forEach(token => {
        const { marpitDirectives, marpitSlide } = token.meta || {}
        if (!marpitDirectives) return

        const styles = {}

        Object.keys(marpitDirectives)
          .filter(filterFunc)
          .forEach(dir => {
            const value = marpitDirectives[dir]
            if (!value) return

            const kebabCaseDir = kebabCase(dir)
            if (dataset) token.attrSet(`data-${kebabCaseDir}`, value)
            if (css) styles[`--${kebabCaseDir}`] = value
          })

        // Apply attribute to token
        if (marpitDirectives.class)
          token.attrJoin('class', marpitDirectives.class)

        if (marpitDirectives.backgroundImage) {
          styles['background-image'] = marpitDirectives.backgroundImage
          styles['background-position'] = 'center'
          styles['background-repeat'] = 'no-repeat'
          styles['background-size'] = 'cover'

          if (marpitDirectives.backgroundPosition)
            styles['background-position'] = marpitDirectives.backgroundPosition

          if (marpitDirectives.backgroundRepeat)
            styles['background-repeat'] = marpitDirectives.backgroundRepeat

          if (marpitDirectives.backgroundSize)
            styles['background-size'] = marpitDirectives.backgroundSize
        }

        if (marpitDirectives.pagination)
          token.attrSet('data-marpit-pagination', marpitSlide + 1)

        const styleStr = Object.keys(styles).reduce(
          (arr, dir) => `${arr}${dir}:${styles[dir]};`,
          ''
        )
        if (styleStr.length > 0) token.attrSet('style', styleStr)
      })
    }
  )
}

export default apply
