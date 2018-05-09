/** @module */
import emojiRegex from 'emoji-regex'
import Token from 'markdown-it/lib/token'

const regexForSplit = new RegExp(`(${emojiRegex().source})`, 'g')

/**
 * Marpit unicode emoji plugin.
 *
 * Wrap unicode emoji by `<span data-marpit-emoji></span>`
 *
 * @alias module:markdown/unicode_emoji
 * @param {MarkdownIt} md markdown-it instance.
 */
function unicodeEmoji(md) {
  md.core.ruler.after('inline', 'marpit_unicode_emoji', ({ tokens }) => {
    tokens.forEach(token => {
      if (token.type !== 'inline') return

      token.children = token.children.reduce((arr, t) => {
        if (t.type !== 'text') return [...arr, t]

        return [
          ...arr,
          ...t.content.split(regexForSplit).reduce((splitedArr, text, idx) => {
            const isText = idx % 2 === 0
            const textToken = Object.assign(new Token(), {
              ...t,
              content: isText ? text : `<span data-marpit-emoji>${text}</span>`,
              type: isText ? 'text' : 'html_inline',
            })
            return text.length === 0 ? splitedArr : [...splitedArr, textToken]
          }, []),
        ]
      }, [])
    })
  })
}

export default unicodeEmoji
