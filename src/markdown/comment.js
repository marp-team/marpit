/** @module */
import marpitPlugin from '../plugin'
import yaml from './directives/yaml'

const commentMatcher = /<!--+\s*([\s\S]*?)\s*--+>/
const commentMatcherOpening = /^<!--/
const commentMatcherClosing = /-->/

const magicCommentMatchers = [
  // Prettier
  /^prettier-ignore(-(start|end))?$/,

  // markdownlint
  /^markdownlint-((disable|enable).*|capture|restore)$/,

  // remark-lint (remark-message-control)
  /^lint (disable|enable|ignore).*$/,
]

export function markAsParsed(token, kind) {
  token.meta = token.meta || {}
  token.meta.marpitCommentParsed = kind
}

/**
 * Marpit comment plugin.
 *
 * Parse HTML comment as token. Comments will strip regardless of html setting
 * provided by markdown-it.
 *
 * @alias module:markdown/comment
 * @param {MarkdownIt} md markdown-it instance.
 */
function comment(md) {
  const parse = (token, content) => {
    const parsed = yaml(content, !!md.marpit.options.looseYAML)

    token.meta = token.meta || {}
    token.meta.marpitParsedDirectives = parsed === false ? {} : parsed

    // Mark well-known magic comments as parsed comment
    for (const magicCommentMatcher of magicCommentMatchers) {
      if (magicCommentMatcher.test(content.trim())) {
        markAsParsed(token, 'well-known-magic-comment')
        break
      }
    }
  }

  md.block.ruler.before(
    'html_block',
    'marpit_comment',
    (state, startLine, endLine, silent) => {
      // Fast fail
      let pos = state.bMarks[startLine] + state.tShift[startLine]
      if (state.src.charCodeAt(pos) !== 0x3c) return false

      let max = state.eMarks[startLine]
      let line = state.src.slice(pos, max)

      // Match to opening element
      if (!commentMatcherOpening.test(line)) return false
      if (silent) return true

      // Parse ending element
      let nextLine = startLine + 1
      if (!commentMatcherClosing.test(line)) {
        while (nextLine < endLine) {
          if (state.sCount[nextLine] < state.blkIndent) break

          pos = state.bMarks[nextLine] + state.tShift[nextLine]
          max = state.eMarks[nextLine]
          line = state.src.slice(pos, max)
          nextLine += 1

          if (commentMatcherClosing.test(line)) break
        }
      }

      state.line = nextLine

      // Create token
      const token = state.push('marpit_comment', '', 0)
      token.map = [startLine, nextLine]
      token.markup = state.getLines(startLine, nextLine, state.blkIndent, true)
      token.hidden = true

      const matchedContent = commentMatcher.exec(token.markup)
      token.content = matchedContent ? matchedContent[1].trim() : ''
      parse(token, token.content)

      return true
    }
  )

  md.inline.ruler.before(
    'html_inline',
    'marpit_inline_comment',
    (state, silent) => {
      const { posMax, src } = state

      // Quick fail by checking `<` and `!`
      if (
        state.pos + 2 >= posMax ||
        src.charCodeAt(state.pos) !== 0x3c ||
        src.charCodeAt(state.pos + 1) !== 0x21
      )
        return false

      const match = src.slice(state.pos).match(commentMatcher)
      if (!match) return false

      if (!silent) {
        const token = state.push('marpit_comment', '', 0)

        token.hidden = true
        token.markup = src.slice(state.pos, state.pos + match[0].length)
        token.content = match[1].trim()

        parse(token, token.content)
      }

      state.pos += match[0].length
      return true
    }
  )
}

export default marpitPlugin(comment)
