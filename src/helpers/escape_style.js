/** @module */
/**
 * Escape inline style string.
 *
 * @alias module:helpers/escape_style
 * @param {String} style
 * @returns {String} Escaped style.
 */
function escapeStyle(style) {
  return style.replace(/[\\;:()]/g, matched => `\\${matched[0]}`)
}

export default escapeStyle
