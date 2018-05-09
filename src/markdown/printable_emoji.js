/** @module */
import emojiRegex from 'emoji-regex'
import Token from 'markdown-it/lib/token'
import wrapTokens from '../helpers/wrap_tokens'

const regexForSplit = new RegExp(`(${emojiRegex().source})`, 'g')

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
      if (token.type === 'inline') {
        token.children = token.children.reduce((arr, t) => {
          if (t.type === 'text') {
            token.children = t.content
              .split(regexForSplit)
              .reduce((splitedArr, text, idx) => {
                const textToken = Object.assign(new Token(), {
                  ...t,
                  content: text,
                })

                if (idx % 2 === 0)
                  return text.length === 0
                    ? splitedArr
                    : [...splitedArr, textToken]

                return [
                  ...splitedArr,
                  ...wrapTokens(
                    'marpit_printable_emoji',
                    {
                      tag: 'span',
                      'data-marpit-emoji': true,
                    },
                    [textToken]
                  ),
                ]
              }, [])
          }
          return [...arr, t]
        }, [])
      }
    })
  })
}

export default printableEmoji
