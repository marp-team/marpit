import postcss from 'postcss'

/**
 * InlineStyle helper class.
 *
 * This is the declarative builder of an inline style using PostCSS. The output
 * string by `toString()` is sanitized unexpected declarations.
 *
 * @module
 * @alias module:helpers/inline_style
 */
export default class InlineStyle {
  /**
   * Create an InlineStyle instance.
   *
   * @function constructor
   * @param {Object|String|InlineStyle} [initialDecls] The initial declarations.
   */
  constructor(initialDecls) {
    this.decls = {}

    if (initialDecls) {
      if (
        initialDecls instanceof InlineStyle ||
        typeof initialDecls === 'string'
      ) {
        const root = postcss.parse(initialDecls.toString(), { from: undefined })

        root.each((node) => {
          if (node.type === 'decl') this.decls[node.prop] = node.value
        })
      } else {
        this.decls = { ...initialDecls }
      }
    }
  }

  /**
   * Delete declaration.
   *
   * @param {string} prop A property name of declaration.
   * @returns {InlineStyle} Returns myself for chaining methods.
   */
  delete(prop) {
    delete this.decls[prop]
    return this
  }

  /**
   * Set declaration.
   *
   * @param {string} prop A property name of declaration.
   * @param {string} value A value of declaration.
   * @returns {InlineStyle} Returns myself for chaining methods.
   */
  set(prop, value) {
    this.decls[prop] = value
    return this
  }

  /**
   * Build a string of declarations for the inline style.
   *
   * The unexpected declarations will strip to prevent a style injection.
   */
  toString() {
    let built = ''

    for (const prop of Object.keys(this.decls)) {
      let parsed

      try {
        parsed = postcss.parse(`${prop}:${this.decls[prop]}`, {
          from: undefined,
        })
      } catch {
        // A declaration that have value it cannot parse will ignore.
      }

      if (parsed) {
        parsed.each((node) => {
          if (node.type !== 'decl' || node.prop !== prop) node.remove()
        })

        built += `${parsed.toString()};`
      }
    }

    return built
  }
}
