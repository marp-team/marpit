/** @module */
import kebabCase from 'lodash.kebabcase'
import { appliers, globals, locals } from './directives'

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
        const { marpitDirectives } = token.meta || {}
        if (!marpitDirectives) return

        const styles = []

        Object.keys(marpitDirectives)
          .filter(filterFunc)
          .forEach(dir => {
            const value = marpitDirectives[dir]
            if (!value) return
            if (appliers[dir]) appliers[dir](value, { token, styles })

            const kebabCaseDir = kebabCase(dir)
            if (dataset) token.attrSet(`data-${kebabCaseDir}`, value)
            if (css) styles.push(`--${kebabCaseDir}:${value};`)
          })

        if (styles.length > 0) token.attrSet('style', styles.join(''))
      })
    }
  )
}

export default apply
