/** @module */

/**
 * Escape inline style string.
 *
 * @typedef {Function} escapeStyleFunction
 * @param {String} style
 */

/**
 * Generate function to escape inline style string.
 *
 * @param {String|String[]} chars The target chars for escaping. It is useful to
 *     escape strictly according to the context of style.
 * @returns {escapeStyleFunction} The function to escape style string.
 */
export function generateEscapeStyle(chars) {
  const regex = new RegExp(`(${[...chars].map(c => `\\${c}`).join('|')})`, 'g')
  return style =>
    style.replace(
      regex,
      matched => `\\${matched[0].codePointAt(0).toString(16)} `
    )
}

/**
 * Escape semicolon for inline style.
 *
 * @alias module:helpers/escape_style
 * @function
 * @param {String} style
 */
export default generateEscapeStyle(';')
