/** @module */
import emojiRegex from 'emoji-regex'
import Token from 'markdown-it/lib/token'

const regexForSplit = new RegExp(`(${emojiRegex().source})`, 'g')
const wrap = text =>
  text
    .split(/(<[^>]*>)/g)
    .reduce(
      (ret, part, idx) =>
        `${ret}${
          idx % 2 === 1
            ? part
            : part.replace(
                regexForSplit,
                ([emoji]) => `<span data-marpit-emoji>${emoji}</span>`
              )
        }`,
      ''
    )

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

  // We have to override renderer rules to wrap emoji in the code
  const originalCodeInline = md.renderer.rules.code_inline
  const originalCodeBlock = md.renderer.rules.code_block
  const originalFence = md.renderer.rules.fence

  md.renderer.rules.code_inline = (...args) => wrap(originalCodeInline(...args))
  md.renderer.rules.code_block = (...args) => wrap(originalCodeBlock(...args))
  md.renderer.rules.fence = (...args) => wrap(originalFence(...args))
}

export default unicodeEmoji
