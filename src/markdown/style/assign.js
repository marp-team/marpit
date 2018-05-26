/** @module */

/**
 * Marpit style assign plugin.
 *
 * Assign style global directive and parsed styles to Marpit instance's
 * `lastStyles' property.
 *
 * @alias module:markdown/style/assign
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Marpit} marpit Marpit instance.
 */
function assign(md, marpit) {
  md.core.ruler.push('marpit_style_assign', state => {
    if (state.inlineMode) return

    const directives = marpit.lastGlobalDirectives || {}
    marpit.lastStyles = directives.style ? [directives.style] : []

    state.tokens.forEach(token => {
      if (token.type === 'marpit_style') marpit.lastStyles.push(token.content)
    })
  })
}

export default assign
