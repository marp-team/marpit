/** @module */
import emojiRegex from 'emoji-regex'

/**
 * Marpit printable emoji plugin.
 *
 * @alias module:markdown/printable_emoji
 * @param {MarkdownIt} md markdown-it instance.
 */
function printableEmoji(md) {
  md.core.ruler.after('inline', 'marpit_printable_emoji', state => {
    if (state.inlineMode) return

    state.tokens.forEach(token => {
      // TODO: Wrap unicode emoji by `<span data-marpit-emoji>`
    })
  })
}

export default printableEmoji
