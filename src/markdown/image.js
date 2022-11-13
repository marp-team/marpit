/** @module */
import marpitPlugin from '../plugin'
import apply from './image/apply'
import parse from './image/parse'

/**
 * Marpit image plugin.
 *
 * @function image
 * @param {MarkdownIt} md markdown-it instance.
 */
function _image(md) {
  parse(md)
  apply(md)
}

export const image = marpitPlugin(_image)
export default image
