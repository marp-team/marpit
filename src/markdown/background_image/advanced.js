/** @module */
import marpitPlugin from '../marpit_plugin'
import InlineStyle from '../../helpers/inline_style'
import wrapTokens from '../../helpers/wrap_tokens'

/**
 * Marpit advanced background image plugin.
 *
 * Support the advanced features for background image, by using `<figure>`
 * element(s) instead of CSS backgrounds. It works by creating the isolated
 * layer into inline SVG.
 *
 * @alias module:markdown/background_image/advanced
 * @param {MarkdownIt} md markdown-it instance.
 */
function advancedBackground(md) {
  md.core.ruler.after(
    'marpit_directives_apply',
    'marpit_advanced_background',
    state => {
      let current
      const newTokens = []

      for (const t of state.tokens) {
        if (
          t.type === 'marpit_inline_svg_content_open' &&
          t.meta &&
          t.meta.marpitBackground
        ) {
          current = t

          const { height, images, open, width } = t.meta.marpitBackground
          open.attrSet('data-marpit-advanced-background', 'content')

          // Aligned direction
          const direction = t.meta.marpitBackground.direction || 'horizontal'

          // Split backgrounds
          const splitSide = t.meta.marpitBackground.split
          if (splitSide) {
            open.attrSet('data-marpit-advanced-background-split', splitSide)

            const splitBgSize = t.meta.marpitBackground.splitSize || '50%'

            t.attrSet(
              'width',
              `${100 - Number.parseFloat(splitBgSize.slice(0, -1))}%`
            )

            if (splitSide === 'left') t.attrSet('x', splitBgSize)

            const style = new InlineStyle(open.attrGet('style'))
            style.set('--marpit-advanced-background-split', splitBgSize)
            open.attrSet('style', style.toString())
          }

          // Add the isolated layer for background image
          newTokens.push(
            ...wrapTokens(
              state.Token,
              'marpit_advanced_background_foreign_object',
              { tag: 'foreignObject', width, height },
              wrapTokens(
                state.Token,
                'marpit_advanced_background_section',
                {
                  ...open.attrs.reduce((o, [k, v]) => ({ ...o, [k]: v }), {}),
                  tag: 'section',
                  id: undefined,
                  'data-marpit-advanced-background': 'background',
                },
                wrapTokens(
                  state.Token,
                  'marpit_advanced_background_image_container',
                  {
                    tag: 'div',
                    'data-marpit-advanced-background-container': true,
                    'data-marpit-advanced-background-direction': direction,
                  },
                  (() => {
                    const imageTokens = []

                    // Add multiple image elements
                    for (const img of images) {
                      const style = new InlineStyle({
                        'background-image': `url("${img.url}")`,
                      })

                      // Image sizing
                      if (img.size) style.set('background-size', img.size)

                      // Image filter for backgrounds (Only in advanced BG)
                      if (img.filter) style.set('filter', img.filter)

                      imageTokens.push(
                        ...wrapTokens(
                          state.Token,
                          'marpit_advanced_background_image',
                          {
                            tag: 'figure',
                            style: style.toString(),
                          }
                        )
                      )
                    }

                    return imageTokens
                  })()
                )
              )
            ),
            t
          )
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

          // Add the isolated layer for pseudo contents (e.g. Page number)
          newTokens.push(
            t,
            ...wrapTokens(
              state.Token,
              'marpit_advanced_background_foreign_object',
              {
                tag: 'foreignObject',
                width,
                height,
                'data-marpit-advanced-background': 'pseudo',
              },
              wrapTokens(state.Token, 'marpit_advanced_pseudo_section', {
                tag: 'section',
                class: open.attrGet('class'),
                style: style.toString(),
                'data-marpit-advanced-background': 'pseudo',

                // For pagination styling
                'data-marpit-pagination': open.attrGet(
                  'data-marpit-pagination'
                ),
                'data-marpit-pagination-total': open.attrGet(
                  'data-marpit-pagination-total'
                ),
              })
            )
          )

          current = undefined
        } else {
          newTokens.push(t)
        }
      }

      state.tokens = newTokens
    }
  )
}

export default marpitPlugin(advancedBackground)
