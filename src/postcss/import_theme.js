/** @module */
import postcss from 'postcss'

/**
 * Marpit PostCSS import theme plugin.
 *
 * Recognize `@import 'theme-name';` and import another theme's style.
 *
 * @param {ThemeSet} themeSet
 * @param {Theme} currentTheme
 * @alias module:postcss/import_theme
 */
const plugin = postcss.plugin(
  'marpit-postcss-import-theme',
  (themeSet, currentTheme) => (css, ret) => {
    // TODO: Implement import style from themeSet & Support nested import
  }
)

export default plugin
