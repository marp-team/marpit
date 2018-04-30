/** @module */
const bgSizeKeywords = {
  auto: 'auto',
  contain: 'contain',
  cover: 'cover',
  fit: 'contain',
}

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
  md.inline.ruler2.after(
    'marpit_parse_image',
    'marpit_background_image',
    ({ tokens }) => {
      tokens.forEach(t => {
        if (t.type !== 'image') return

        if (t.meta.marpitImage.options.includes('bg')) {
          t.meta.marpitImage.background = true
          t.hidden = true

          t.meta.marpitImage.options.forEach(opt => {
            if (bgSizeKeywords[opt])
              t.meta.marpitImage.backgroundSize = bgSizeKeywords[opt]
          })
        }
      })
    }
  )

  md.core.ruler.after(
    'marpit_directives_parse',
    'marpit_apply_background_image',
    ({ inlineMode, tokens }) => {
      if (inlineMode) return

      let slide
      tokens.forEach(tb => {
        if (tb.type === 'marpit_slide_open') slide = tb
        if (!slide || tb.type !== 'inline') return

        tb.children.forEach(t => {
          if (t.type !== 'image') return

          const { background, backgroundSize, size, url } = t.meta.marpitImage

          if (background && !url.match(/^\s*$/)) {
            slide.meta.marpitDirectives = {
              ...(slide.meta.marpitDirectives || {}),
              backgroundImage: `url("${url}")`,
            }

            if (size || backgroundSize)
              slide.meta.marpitDirectives.backgroundSize =
                size || backgroundSize
          }
        })
      })
    }
  )
}

export default backgroundImage
