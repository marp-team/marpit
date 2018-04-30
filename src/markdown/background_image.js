/** @module */
import split from '../helpers/split'
import wrapTokens from '../helpers/wrap_tokens'

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
    'marpit_inline_svg',
    'marpit_apply_background_image',
    ({ inlineMode, tokens }) => {
      if (inlineMode) return

      let current = {}

      tokens.forEach(tb => {
        if (tb.type === 'marpit_slide_open') current.open = tb
        if (tb.type === 'marpit_inline_svg_content_open')
          current.svgContent = tb

        if (tb.type === 'marpit_slide_close') {
          if (current.images && current.images.length > 0) {
            if (current.svgContent) {
              // SVG background mode
              current.svgContent.meta = {
                ...(current.svgContent.meta || {}),
                marpitBackground: {
                  height: current.svgContent.attrGet('height'),
                  images: current.images,
                  open: current.open,
                  width: current.svgContent.attrGet('width'),
                },
              }
            } else {
              // CSS background mode
              const img = current.images[current.images.length - 1]

              current.open.meta.marpitDirectives = {
                ...(current.open.meta.marpitDirectives || {}),
                backgroundImage: `url("${img.url}")`,
              }

              if (img.size)
                current.open.meta.marpitDirectives.backgroundSize = img.size
            }
          }
          current = {}
        }

        if (!current.open || tb.type !== 'inline') return

        tb.children.forEach(t => {
          if (t.type !== 'image') return
          const { background, backgroundSize, size, url } = t.meta.marpitImage

          if (background && !url.match(/^\s*$/)) {
            current.images = [
              ...(current.images || []),
              {
                url,
                size: size || backgroundSize || undefined,
              },
            ]
          }
        })
      })
    }
  )

  md.core.ruler.after(
    'marpit_directives_apply',
    'marpit_advanced_background_image',
    state => {
      state.tokens = split(
        state.tokens,
        t =>
          t.type === 'marpit_inline_svg_content_open' &&
          t.meta &&
          t.meta.marpitBackground,
        true
      ).reduce((arr, tokens) => {
        const [foreignObject] = tokens
        let advancedBgs = []

        if (foreignObject.type === 'marpit_inline_svg_content_open') {
          const {
            height,
            images,
            open,
            width,
          } = foreignObject.meta.marpitBackground

          const sectionAttrs = open.attrs.reduce(
            (obj, [k, v]) => ({
              ...obj,
              [k]: v,
            }),
            {}
          )

          open.attrSet('data-marpit-advanced-background', true)

          advancedBgs = [
            ...wrapTokens(
              'marpit_advanced_background_content',
              { tag: 'foreignObject', width, height },
              wrapTokens('marpit_advanced_background_section', {
                ...sectionAttrs,
                tag: 'section',
                id: undefined,
              })
            ),
          ]
        }

        return [...arr, ...advancedBgs, ...tokens]
      }, [])
    }
  )
}

export default backgroundImage
