/** @module */
/**
 * Marpit element class.
 *
 * @alias Element
 */
class Element {
  /**
   * Create a Element instance.
   *
   * Element instance has compatibility with a plain object that is consists by
   * `tag` key and pairs of attribute names and values. A difference is whether
   * object has been frozen.
   *
   * ```js
   * import assert from 'assert'
   * import { Element } from 'marpit'
   *
   * const obj = { tag: 'div', class: 'marpit' }
   * const elm = new Element('div', { class: 'marpit' })
   *
   * // This assertion would pass.
   * assert.deepStrictEqual(obj, { ...elm })
   * ```
   *
   * @param {string} tag Tag name
   * @param {Object} [attributes={}] Tag attributes
   */
  constructor(tag, attributes = {}) {
    Object.defineProperties(this, {
      attributes: { value: attributes },
      tag: { enumerable: true, value: tag },
    })

    Object.keys(attributes).forEach(attr => {
      Object.defineProperty(this, attr, {
        enumerable: true,
        value: attributes[attr],
      })
    })

    Object.freeze(this)
  }
}

/**
 * Marpit's default container.
 *
 * It would output `<div class="marpit"></div>`.
 *
 * @alias module:element.marpitContainer
 * @type {Element}
 */
export const marpitContainer = new Element('div', { class: 'marpit' })

export default Element
