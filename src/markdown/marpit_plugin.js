/** @module */
import Marpit from '../marpit'

/**
 * Marpit plugin wrapper.
 *
 * Convert passed markdown-it plugin to Marpit plugin. Marpit plugin would
 * require that markdown-it instance has `marpit` member.
 *
 * @alias module:markdown/marpit_plugin
 * @returns {Function} markdown-it plugin for Marpit.
 */
export default function marpitPlugin(plugin) {
  return (md, ...args) => {
    if (md.marpit) return plugin.call(this, md, ...args)

    throw new Error("Marpit's markdown-it plugin requires `marpit` member.")
  }
}
