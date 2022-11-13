/** @module */
import marpitPlugin from '../plugin'
import advanced from './background_image/advanced'
import apply from './background_image/apply'
import parse from './background_image/parse'

/**
 * Marpit background image plugin.
 *
 * Convert image token to backgrounds when the alternate text includes `bg`.
 *
 * When Marpit inline SVG mode is disabled, the image will convert to
 * `backgroundImage` and `backgroundSize` spot directive. It supports only
 * single background and resizing by using CSS.
 *
 * When inline SVG mode is enabled, the plugin enables advanced background mode.
 * In addition to the basic background implementation, it supports multiple
 * background images, filters, and split background.
 *
 * @function backgroundImage
 * @param {MarkdownIt} md markdown-it instance.
 */
function _backgroundImage(md) {
  parse(md)
  apply(md)
  advanced(md)
}

export const backgroundImage = marpitPlugin(_backgroundImage)
export default backgroundImage
