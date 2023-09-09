/** @module */
import marpitPlugin from '../../plugin'

const bgSizeKeywords = {
  auto: 'auto',
  contain: 'contain',
  cover: 'cover',
  fit: 'contain',
}

const splitSizeMatcher = /^(left|right)(?::((?:\d*\.)?\d+%))?$/

/**
 * Marpit background image parse plugin.
 *
 * Parse Marpit's image token and mark as background image when the alternate
 * text includes `bg`. The marked images will not show as the regular image.
 *
 * Furthermore, it parses additional keywords needed for background image.
 *
 * @function backgroundImageParse
 * @param {MarkdownIt} md markdown-it instance.
 */
function _backgroundImageParse(md) {
  md.inline.ruler2.after(
    'marpit_parse_image',
    'marpit_background_image',
    ({ tokens }) => {
      for (const t of tokens) {
        if (t.type === 'image') {
          const { marpitImage } = t.meta

          if (
            marpitImage.options.some((v) => !v.consumed && v.content === 'bg')
          ) {
            marpitImage.background = true
            t.hidden = true

            for (const opt of marpitImage.options) {
              if (opt.consumed) continue
              let consumed = false

              // bg keyword
              if (opt.content === 'bg') consumed = true

              // Background size keyword
              if (bgSizeKeywords[opt.content]) {
                marpitImage.backgroundSize = bgSizeKeywords[opt.content]
                consumed = true
              }

              // Split background keyword
              const matched = opt.content.match(splitSizeMatcher)
              if (matched) {
                const [, splitSide, splitSize] = matched

                marpitImage.backgroundSplit = splitSide
                marpitImage.backgroundSplitSize = splitSize

                consumed = true
              }

              // Background aligned direction
              if (opt.content === 'vertical' || opt.content === 'horizontal') {
                marpitImage.backgroundDirection = opt.content
                consumed = true
              }

              if (consumed) opt.consumed = true
            }
          }
        }
      }
    },
  )
}

export const backgroundImageParse = marpitPlugin(_backgroundImageParse)
export default backgroundImageParse
