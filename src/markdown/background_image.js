/** @module */

/**
 * Marpit background image plugin.
 *
 * Convert image token with description including `bg`, into `background*` local
 * directives.
 *
 * @alias module:markdown/background_image
 * @param {MarkdownIt} md markdown-it instance.
 */
function backgroundImage(md) {
  md.core.ruler.after(
    'marpit_directives_parse',
    'marpit_background_image',
    ({ inlineMode, tokens, env }) => {
      // TODO: It would be a more better implementation with using inlineMode
      if (inlineMode) return

      let slide
      tokens.forEach((tb, idx) => {
        if (tb.type === 'marpit_slide_open') slide = tb
        if (!slide || tb.type !== 'inline') return

        tb.children.forEach(t => {
          if (t.type !== 'image') return

          const props = t.content.split(/\s+/).filter(s => s.length > 0)
          if (!props.includes('bg')) return

          const src = t.attrGet('src')
          if (src === '') return

          t.hidden = true

          slide.meta.marpitDirectives = {
            ...(slide.meta.marpitDirectives || {}),
            backgroundImage: `url("${src}")`,
          }

          // Strip empty paragraph
          if (md.renderer.renderInline(tb.children, {}, env).match(/^\s*$/)) {
            tb.hidden = true

            const prevToken = tokens[idx - 1]
            const nextToken = tokens[idx + 1]

            if (
              prevToken &&
              nextToken &&
              prevToken.type === 'paragraph_open' &&
              nextToken.type === 'paragraph_close'
            ) {
              prevToken.hidden = true
              nextToken.hidden = true
            }
          }
        })
      })
    }
  )
}

export default backgroundImage
