/** @module */
import marpitPlugin from '../plugin'
import apply from './image/apply'
import parse from './image/parse'

/**
 * Marpit image plugin.
 *
 * @alias module:markdown/image
 * @param {MarkdownIt} md markdown-it instance.
 */
function image(md) {
  parse(md)
  apply(md)
}

export default marpitPlugin(image)
