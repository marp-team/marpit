/** @module */

/**
 * Create Marpit plugin.
 *
 * Generate Marpit plugin from passed markdown-it plugin. Marpit plugin needs
 * markdown-it instance with `marpit` member.
 *
 * @example
 * import { marpitPlugin } from '@marp-team/marpit/plugin'
 *
 * export default marpitPlugin((md) => {
 *   // Compatible with markdown-it plugin
 *   md.renderer.rules.your_rule = (tokens, idx, options, env, self) => {
 *     // ...
 *   }
 *
 *   // And accessible to Marpit instance as `md.marpit`
 *   const { marpit } = md
 *
 *   marpit.customDirectives.local.yourDirective = (value) => {
 *     return { yourDirective: value }
 *   }
 * })
 *
 * @function marpitPlugin
 * @param {Function} plugin Base plugin for markdown-it.
 * @returns {Function} Generated Marpit plugin.
 */
function marpitPlugin(plugin) {
  // eslint-disable-next-line func-names
  return function (md, ...args) {
    if (md.marpit) return plugin.call(this, md, ...args)

    throw new Error(
      'Marpit plugin has detected incompatible markdown-it instance.',
    )
  }
}

Object.defineProperty(marpitPlugin, '__esModule', { value: true })
Object.defineProperty(marpitPlugin, 'default', { value: marpitPlugin })
Object.defineProperty(marpitPlugin, 'marpitPlugin', { value: marpitPlugin })

module.exports = marpitPlugin
