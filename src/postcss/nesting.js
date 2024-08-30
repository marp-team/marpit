/** @module */
import postcssIsPseudoClass from '@csstools/postcss-is-pseudo-class'
import postcssNesting from 'postcss-nesting'
import postcssPlugin from '../helpers/postcss_plugin'

const { Rule: applyPostCSSNesting } = postcssNesting()

const matcher = /:is\((?:section|:root)\b/

export const nesting = postcssPlugin(
  'marpit-postcss-nesting',
  () => (root, helpers) => {
    const rules = []

    // Note: Use walk instead of walkRules to include nested rules
    root.walk((node) => {
      if (node.type !== 'rule') return

      rules.push(node)
      node.__marpitNestingOriginalSelector = node.selector
    })

    // Apply postcss-nesting
    root.walkRules((rule) => applyPostCSSNesting(rule, helpers))

    const { Rule: applyPostCSSIsPseudoClass } = postcssIsPseudoClass({
      onComplexSelector: 'warning',
    }).prepare()

    for (const rule of rules) {
      if (
        rule.__marpitNestingOriginalSelector !== rule.selector &&
        matcher.test(rule.selector)
      ) {
        // Apply postcss-is-pseudo-class only to transformed rules that is
        // including `:is() selector starting from `section` element or `:root`
        // pseudo-class
        applyPostCSSIsPseudoClass(rule, helpers)
      }

      delete rule.__marpitNestingOriginalSelector
    }
  },
)

export default nesting
