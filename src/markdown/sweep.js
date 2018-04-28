/** @module */

/**
 * Marpit sweep plugin.
 *
 * Hide blank paragraphs. For better support of the background image syntax and
 * directives through HTML comment, Marpit will sweep paragraphs included only
 * whitespace by setting `hidden: true`.
 *
 * @alias module:markdown/sweep
 * @param {MarkdownIt} md markdown-it instance.
 */
function sweep(md) {
  md.core.ruler.after('inline', 'marpit_sweep', state => {
    if (state.inlineMode) return

    state.tokens.forEach(token => {
      if (
        (token.type === 'html_block' && token.content.match(/^\s*$/)) ||
        (token.type === 'inline' &&
          token.children
            .filter(t => !t.hidden)
            .every(t => t.type === 'text' && t.content.match(/^\s*$/)))
      )
        token.hidden = true
    })
  })

  md.core.ruler.push('marpit_sweep_paragraph', state => {
    if (state.inlineMode) return
    const current = { open: [], tokens: {} }

    state.tokens.forEach(token => {
      if (token.type === 'paragraph_open') {
        current.open.push(token)
        current.tokens[token] = []
      } else if (token.type === 'paragraph_close') {
        const openToken = current.open.pop()

        if (current.tokens[openToken].every(t => t.hidden)) {
          openToken.hidden = true
          token.hidden = true
        }
      } else {
        const len = current.open.length
        if (len > 0) current.tokens[current.open[len - 1]].push(token)
      }
    })
  })
}

export default sweep
