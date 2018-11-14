/** @module */
const styleMatcher = /<style([\s\S]*?)>([\s\S]*?)<\/style>/i
const styleMatcherOpening = /^<style(?=(\s|>|$))/i
const styleMatcherClosing = /<\/style>/i
const styleMatcherScoped = /\bscoped\b/i

/**
 * Marpit style parse plugin.
 *
 * Parse `<style>` elements as the hidden `marpit_style` token. The parsed style
 * will use in {@link ThemeSet#pack} to append the style additionally.
 *
 * `<style>` elements will strip regardless of html setting provided by
 * markdown-it.
 *
 * @alias module:markdown/style/parse
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Marpit} marpit Marpit instance.
 */
function parse(md, marpit) {
  /**
   * Based on markdown-it html_block rule
   * https://github.com/markdown-it/markdown-it/blob/master/lib/rules_block/html_block.js
   */
  md.block.ruler.before(
    'html_block',
    'marpit_style_parse',
    (state, startLine, endLine, silent) => {
      if (!marpit.options.inlineStyle) return false

      // Fast fail
      let pos = state.bMarks[startLine] + state.tShift[startLine]
      if (state.src.charCodeAt(pos) !== 0x3c) return false

      let max = state.eMarks[startLine]
      let line = state.src.slice(pos, max)

      // Match to opening element
      if (!styleMatcherOpening.test(line)) return false
      if (silent) return true

      // Parse ending element
      let nextLine = startLine + 1
      if (!styleMatcherClosing.test(line)) {
        while (nextLine < endLine) {
          if (state.sCount[nextLine] < state.blkIndent) break

          pos = state.bMarks[nextLine] + state.tShift[nextLine]
          max = state.eMarks[nextLine]
          line = state.src.slice(pos, max)
          nextLine += 1

          if (styleMatcherClosing.test(line)) break
        }
      }

      state.line = nextLine

      // Create token
      const token = state.push('marpit_style', '', 0)
      token.map = [startLine, nextLine]
      token.markup = state.getLines(startLine, nextLine, state.blkIndent, true)
      token.meta = {}
      token.hidden = true

      const matchedContent = styleMatcher.exec(token.markup)

      if (matchedContent) {
        const [, attrStr, contentStr] = matchedContent

        token.content = contentStr.trim()
        token.meta.marpitStyleScoped = styleMatcherScoped.test(attrStr.trim())
      }

      return true
    }
  )
}

export default parse
