/** @module */
import marpitPlugin from '../plugin'

/**
 * Marpit sweep plugin.
 *
 * Hide blank paragraphs. For better support of the background image syntax and
 * directives through HTML comment, Marpit will sweep paragraphs including only
 * whitespace by setting `hidden: true`.
 *
 * It also sweeps the inline token marked as hidden forcefully. Please notice
 * that plugins executed after this cannot handle hidden inline tokens.
 *
 * @function sweep
 * @param {MarkdownIt} md markdown-it instance.
 */
function _sweep(md) {
  md.core.ruler.after('inline', 'marpit_sweep', (state) => {
    if (state.inlineMode) return

    for (const token of state.tokens) {
      if (
        (token.type === 'html_block' && token.content.match(/^\s*$/)) ||
        (token.type === 'inline' &&
          token.children
            .filter((t) => !(t.hidden || t.type === 'softbreak'))
            .every((t) => t.type === 'text' && t.content.match(/^\s*$/)))
      )
        token.hidden = true
    }
  })

  md.core.ruler.push('marpit_sweep_paragraph', (state) => {
    if (state.inlineMode) return
    const current = { open: [], tokens: {} }

    for (const token of state.tokens) {
      if (token.type === 'inline' && token.hidden) {
        // markdown-it's "inline" type is not following a `hidden` flag. Marpit
        // changes the token type to unique name to hide token forcefully.
        token.type = 'marpit_hidden_inline'
      } else if (token.type === 'paragraph_open') {
        current.open.push(token)
        current.tokens[token] = []
      } else if (token.type === 'paragraph_close') {
        const openToken = current.open.pop()

        if (current.tokens[openToken].every((t) => t.hidden)) {
          openToken.hidden = true
          token.hidden = true
        }
      } else {
        const len = current.open.length
        if (len > 0) current.tokens[current.open[len - 1]].push(token)
      }
    }
  })
}

export const sweep = marpitPlugin(_sweep)
export default sweep
