/** @module */

/**
 * Marpit heading divider plugin.
 *
 * Start a new slide page at before of headings.
 *
 * @alias module:markdown/heading_divider
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Marpit} marpit Marpit instance.
 */
function headingDivider(md, marpit) {
  md.core.ruler.before('marpit_slide', 'marpit_heading_divider', state => {
    if (state.inlineMode || marpit.options.headingDivider === false) return

    // TODO: Prepend hidden ruler token at before headings
  })
}

export default headingDivider
