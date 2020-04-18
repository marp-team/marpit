/** @module */

/**
 * Create Marpit plugin.
 *
 * Generate Marpit plugin from passed markdown-it plugin. Marpit plugin needs
 * markdown-it instance with `marpit` member.
 *
 * @alias module:plugin
 * @param {Function} plugin Base plugin for markdown-it.
 * @returns {Function} Generated Marpit plugin.
 */
function marpitPlugin(plugin) {
  // eslint-disable-next-line func-names
  return function (md, ...args) {
    if (md.marpit) return plugin.call(this, md, ...args)

    throw new Error(
      'Marpit plugin has detected incompatible markdown-it instance.'
    )
  }
}

export default marpitPlugin
