/** @module */
import InlineStyle from '../helpers/inline_style'
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
 * single background and resizing by using CSS.
 *
 * When `inlineSVG` option is true, the plugin enables advanced background mode.
 * In addition to the basic background implementation, it supports multiple
 * background images, filters, and split background.
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

            if (opt === 'left' || opt === 'right')
              t.meta.marpitImage.backgroundSplit = opt
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
                  split: current.split,
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

          const {
            background,
            backgroundSize,
            backgroundSplit,
            filter,
            size,
            url,
          } = t.meta.marpitImage

          if (background && !url.match(/^\s*$/)) {
            current.images = [
              ...(current.images || []),
              {
                url,
                size: size || backgroundSize || undefined,
                filter,
              },
            ]
          }

          if (backgroundSplit) current.split = backgroundSplit
        })
      })
    }
  )

  md.core.ruler.after(
    'marpit_directives_apply',
    'marpit_advanced_background',
    state => {
      let current

      state.tokens = state.tokens.reduce((ret, t) => {
        let tokens = [t]

        if (
          t.type === 'marpit_inline_svg_content_open' &&
          t.meta &&
          t.meta.marpitBackground
        ) {
          current = t

          const { height, images, open, width } = t.meta.marpitBackground
          open.attrSet('data-marpit-advanced-background', 'content')

          const splitSide = t.meta.marpitBackground.split
          if (splitSide) {
            open.attrSet('data-marpit-advanced-background-split', splitSide)
            t.attrSet('width', '50%')

            if (splitSide === 'left') t.attrSet('x', '50%')
          }

          tokens = [
            ...wrapTokens(
              'marpit_advanced_background_foreign_object',
              { tag: 'foreignObject', width, height },
              wrapTokens(
                'marpit_advanced_background_section',
                {
                  ...open.attrs.reduce((o, [k, v]) => ({ ...o, [k]: v }), {}),
                  tag: 'section',
                  id: undefined,
                  'data-marpit-advanced-background': 'background',
                },
                wrapTokens(
                  'marpit_advanced_background_image_container',
                  {
                    tag: 'div',
                    'data-marpit-advanced-background-container': true,
                  },
                  images.reduce(
                    (imgArr, img) => [
                      ...imgArr,
                      ...wrapTokens('marpit_advanced_background_image', {
                        tag: 'figure',
                        style: [
                          `background-image:url("${img.url}");`,
                          img.size && `background-size:${img.size};`,
                          img.filter && `filter:${img.filter};`,
                        ]
                          .filter(s => s)
                          .join(''),
                      }),
                    ],
                    []
                  )
                )
              )
            ),
            t,
          ]
        } else if (current && t.type === 'marpit_inline_svg_content_close') {
          const { open, height, width } = current.meta.marpitBackground

          // Apply styles
          const style = new InlineStyle()

          if (
            open.meta &&
            open.meta.marpitDirectives &&
            open.meta.marpitDirectives.color
          )
            style.set('color', open.meta.marpitDirectives.color)

          tokens = [
            t,
            ...wrapTokens(
              'marpit_advanced_background_foreign_object',
              {
                tag: 'foreignObject',
                width,
                height,
                'data-marpit-advanced-background': 'pseudo',
              },
              wrapTokens('marpit_advanced_pseudo_section', {
                tag: 'section',
                class: open.attrGet('class'),
                style: style.toString(),
                'data-marpit-advanced-background': 'pseudo',
                'data-marpit-pagination': open.attrGet(
                  'data-marpit-pagination'
                ),
              })
            ),
          ]

          current = undefined
        }

        return [...ret, ...tokens]
      }, [])
    }
  )
}

export default backgroundImage
