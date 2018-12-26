/** @module */
import advanced from './background_image/advanced'
import apply from './background_image/apply'
import parse from './background_image/parse'

/**
 * Marpit background image plugin.
 *
 * Convert image token to backgrounds when the alternate text includes `bg`.
 *
 * When Marpit `inlineSVG` option is `false`, the image will convert to
 * `backgroundImage` and `backgroundSize` spot directive. It supports only
 * single background and resizing by using CSS.
 *
 * When `inlineSVG` option is true, the plugin enables advanced background mode.
 * In addition to the basic background implementation, it supports multiple
 * background images, filters, and split background.
 *
 * @alias module:markdown/background_image
 * @param {MarkdownIt} md markdown-it instance.
 */
function backgroundImage(md) {
  parse(md)
  apply(md)
  advanced(md)
}

export default backgroundImage
