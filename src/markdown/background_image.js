/** @module */
import split from '../helpers/split'

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
    state => {
      if (state.inlineMode) return

      state.tokens.forEach(tb => {
        if (tb.type !== 'inline') return

        tb.children.forEach(t => {
          if (t.type !== 'image') return
          const props = t.content.split(/\s+/).filter(s => s.length > 0)

          if (!props.includes('bg')) return
          t.hidden = true
        })
      })
    }
  )
}

export default backgroundImage
