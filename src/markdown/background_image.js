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
 * Convert image token to backgrounds when the alternate text includes `bg`.
 *
 * When Marpit `inlineSVG` option is `false`, the image will convert to
 * `backgroundImage` and `backgroundSize` spot directive. It supports only
 * single background and sizing by using CSS.
 *
 * When `inlineSVG` option is true, the plugin enables advanced background mode.
 * In addition to the basic background implementation, it supports multiple
 * background images and filters by using SVG.
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
              // SVG advanced background
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
              // Simple CSS background
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
    'marpit_advanced_background',
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

          open.attrSet('data-marpit-advanced-background', 'content')

          advancedBgs = wrapTokens(
            'marpit_advanced_background_foreign_boejct',
            { tag: 'foreignObject', width, height },
            wrapTokens(
              'marpit_advanced_background_section',
              {
                ...open.attrs.reduce((o, [k, v]) => ({ ...o, [k]: v }), {}),
                tag: 'section',
                id: undefined,
                'data-marpit-advanced-background': 'background',
              },
              images.reduce(
                (imgArr, img) => [
                  ...imgArr,
                  ...wrapTokens('marpit_advanced_background_image', {
                    tag: 'figure',
                    style: `background-image:url(${img.url});${
                      img.size ? `background-size:${img.size};` : ''
                    }`,
                  }),
                ],
                []
              )
            )
          )
        }

        return [...arr, ...advancedBgs, ...tokens]
      }, [])
    }
  )
}

export default backgroundImage
