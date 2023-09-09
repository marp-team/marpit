/** @module */
import postcssPlugin from '../../helpers/postcss_plugin'
import { rootFontSizeCustomProp } from './font_size'

const skipParsingMatcher = /("[^"]*"|'[^']*'|(?:attr|url|var)\([^)]*\))/g

/**
 * Marpit PostCSS rem plugin.
 *
 * Replace `rem` unit to calculated value from CSS variable.
 *
 * @function rem
 */
export const rem = postcssPlugin(
  'marpit-postcss-rem',
  () => (css) =>
    css.walkDecls((decl) => {
      decl.value = decl.value
        .split(skipParsingMatcher)
        .map((v, i) => {
          if (i % 2) return v

          return v.replace(
            /(\d*\.?\d+)rem\b/g,
            (_, num) => `calc(var(${rootFontSizeCustomProp}, 1rem) * ${num})`,
          )
        })
        .join('')
    }),
)

export default rem
