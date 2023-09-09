/** @module */
import InlineStyle from '../../helpers/inline_style'
import { wrapTokens } from '../../helpers/wrap_tokens'
import marpitPlugin from '../../plugin'

/**
 * Marpit advanced background image plugin.
 *
 * Support the advanced features for background image, by using `<figure>`
 * element(s) instead of CSS backgrounds. It works by creating the isolated
 * layer into inline SVG.
 *
 * @function advancedBackground
 * @param {MarkdownIt} md markdown-it instance.
 */
function _advancedBackground(md) {
  md.core.ruler.after(
    'marpit_directives_apply',
    'marpit_advanced_background',
    (state) => {
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
              `${100 - Number.parseFloat(splitBgSize.slice(0, -1))}%`,
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
                          },
                        ),
                      )
                    }

                    return imageTokens
                  })(),
                ),
              ),
            ),
            t,
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
                ...open.attrs.reduce((o, [k, v]) => ({ ...o, [k]: v }), {}),
                tag: 'section',
                id: undefined,
                style: style.toString(),
                'data-marpit-advanced-background': 'pseudo',
              }),
            ),
          )

          current = undefined
        } else {
          newTokens.push(t)
        }
      }

      state.tokens = newTokens
    },
  )
}

export const advancedBackground = marpitPlugin(_advancedBackground)
export default advancedBackground
