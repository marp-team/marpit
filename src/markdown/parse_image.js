/** @module */
import marpitPlugin from './marpit_plugin'
import InlineStyle from '../helpers/inline_style'

const escape = target =>
  target.replace(
    /[\\;:()]/g,
    matched => `\\${matched[0].codePointAt(0).toString(16)} `
  )

/**
 * Marpit parse image plugin.
 *
 * Parse image tokens and store the result into `marpitImage` meta. It has an
 * image url and options. The alternative text is regarded as space-separated
 * options.
 *
 * @alias module:markdown/parse_image
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Object} [opts]
 * @param {boolean} [opts.filters=true] Switch feature to support CSS filters.
 */
function parseImage(md, opts = {}) {
  const pluginOptions = { filters: true, ...opts }
  const optionMatchers = new Map()

  // The scale percentage for resize background
  optionMatchers.set(/^(\d*\.)?\d+%$/, matches => ({ size: matches[0] }))

  // width and height
  optionMatchers.set(
    /^w(?:idth)?:((?:\d*\.)?\d+(?:%|ch|cm|em|ex|in|mm|pc|pt|px)?|auto)$/,
    matches => ({ width: matches[1] })
  )

  optionMatchers.set(
    /^h(?:eight)?:((?:\d*\.)?\d+(?:%|ch|cm|em|ex|in|mm|pc|pt|px)?|auto)$/,
    matches => ({ height: matches[1] })
  )

  if (pluginOptions.filters) {
    // CSS filters
    optionMatchers.set(/^blur(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['blur', escape(matches[1] || '10px')]],
    }))
    optionMatchers.set(/^brightness(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['brightness', escape(matches[1] || '1.5')]],
    }))
    optionMatchers.set(/^contrast(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['contrast', escape(matches[1] || '2')]],
    }))
    optionMatchers.set(
      /^drop-shadow(?::(.+?),(.+?)(?:,(.+?))?(?:,(.+?))?)?$/,
      (matches, meta) => {
        const args = []

        for (const arg of matches.slice(1)) {
          if (arg) {
            const colorFunc = arg.match(/^(rgba?|hsla?)\((.*)\)$/)

            args.push(
              colorFunc
                ? `${colorFunc[1]}(${escape(colorFunc[2])})`
                : escape(arg)
            )
          }
        }

        return {
          filters: [
            ...meta.filters,
            ['drop-shadow', args.join(' ') || '0 5px 10px rgba(0,0,0,.4)'],
          ],
        }
      }
    )
    optionMatchers.set(/^grayscale(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['grayscale', escape(matches[1] || '1')]],
    }))
    optionMatchers.set(/^hue-rotate(?::(.+))?$/, (matches, meta) => ({
      filters: [
        ...meta.filters,
        ['hue-rotate', escape(matches[1] || '180deg')],
      ],
    }))
    optionMatchers.set(/^invert(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['invert', escape(matches[1] || '1')]],
    }))
    optionMatchers.set(/^opacity(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['opacity', escape(matches[1] || '.5')]],
    }))
    optionMatchers.set(/^saturate(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['saturate', escape(matches[1] || '2')]],
    }))
    optionMatchers.set(/^sepia(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['sepia', escape(matches[1] || '1')]],
    }))
  }

  md.inline.ruler2.push('marpit_parse_image', ({ tokens }) => {
    for (const token of tokens) {
      if (token.type === 'image') {
        const options = token.content.split(/\s+/).filter(s => s.length > 0)

        token.meta = token.meta || {}
        token.meta.marpitImage = {
          ...(token.meta.marpitImage || {}),
          url: token.attrGet('src'),
          options,
        }

        for (const opt of options)
          for (const [regexp, mergeFunc] of optionMatchers) {
            const matched = opt.match(regexp)

            if (matched)
              token.meta.marpitImage = {
                ...token.meta.marpitImage,
                ...mergeFunc(matched, {
                  filters: [],
                  ...token.meta.marpitImage,
                }),
              }
          }

        // Build and apply styles
        const { filters, height, width } = token.meta.marpitImage
        const style = new InlineStyle(token.attrGet('style'))

        const assign = (decl, value) => {
          const normalize = `${value}${/^(\d*\.)?\d+$/.test(value) ? 'px' : ''}`
          token.meta.marpitImage[decl] = normalize

          if (!value.endsWith('%')) style.set(decl, normalize)
        }

        if (width) assign('width', width)
        if (height) assign('height', height)

        if (filters) {
          const filterStyle = []

          for (const fltrs of filters)
            filterStyle.push(`${fltrs[0]}(${fltrs[1]})`)

          token.meta.marpitImage.filter = filterStyle.join(' ')
          style.set('filter', token.meta.marpitImage.filter)
        }

        const stringified = style.toString()
        if (stringified) token.attrSet('style', stringified)
      }
    }
  })
}

export default marpitPlugin(parseImage)
