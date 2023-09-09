/** @module */

/**
 * Generate PostCSS plugin.
 *
 * This is a glue code generator to migrate existed plugins to support
 * PostCSS 8.
 *
 * @param {string} name Plugin name.
 * @param {(Function|Object)} func Function with PostCSS plugin interface.
 * @returns {Function} A PostCSS plugin.
 */
export function plugin(name, func) {
  return Object.defineProperty(
    function intrface(...args) {
      const retFunc = func.apply(this, args)

      return Object.defineProperty(
        typeof retFunc === 'function' ? { Once: retFunc } : retFunc,
        'postcssPlugin',
        { value: name },
      )
    },
    'postcss',
    { value: true },
  )
}

export default plugin
