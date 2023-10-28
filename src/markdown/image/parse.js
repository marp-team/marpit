/** @module */
import marpitPlugin from '../../plugin'

const escape = (target) =>
  target.replace(
    /[\\;:()]/g,
    (matched) => `\\${matched[0].codePointAt(0).toString(16)} `,
  )

const optionMatchers = new Map()

// The scale percentage for resize background
optionMatchers.set(/^(\d*\.)?\d+%$/, (matches) => ({ size: matches[0] }))

// width and height
const normalizeLength = (v) => `${v}${/^(\d*\.)?\d+$/.test(v) ? 'px' : ''}`

optionMatchers.set(
  /^w(?:idth)?:((?:\d*\.)?\d+(?:%|ch|cm|em|ex|in|mm|pc|pt|px)?|auto)$/,
  (matches) => ({ width: normalizeLength(matches[1]) }),
)

optionMatchers.set(
  /^h(?:eight)?:((?:\d*\.)?\d+(?:%|ch|cm|em|ex|in|mm|pc|pt|px)?|auto)$/,
  (matches) => ({ height: normalizeLength(matches[1]) }),
)

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
        const colorFunc = arg.match(
          /^(rgba?|hsla?|hwb|(?:ok)?(?:lab|lch)|color)\((.*)\)$/,
        )

        args.push(
          colorFunc ? `${colorFunc[1]}(${escape(colorFunc[2])})` : escape(arg),
        )
      }
    }

    return {
      filters: [
        ...meta.filters,
        ['drop-shadow', args.join(' ') || '0 5px 10px rgba(0,0,0,.4)'],
      ],
    }
  },
)
optionMatchers.set(/^grayscale(?::(.+))?$/, (matches, meta) => ({
  filters: [...meta.filters, ['grayscale', escape(matches[1] || '1')]],
}))
optionMatchers.set(/^hue-rotate(?::(.+))?$/, (matches, meta) => ({
  filters: [...meta.filters, ['hue-rotate', escape(matches[1] || '180deg')]],
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

/**
 * Marpit image parse plugin.
 *
 * Parse image tokens and store the result into `marpitImage` meta. It has an
 * image url and options. The alternative text is regarded as space-separated
 * options.
 *
 * @function parseImage
 * @param {MarkdownIt} md markdown-it instance.
 */
function _parseImage(md) {
  const { process } = md.core

  let refCount = 0

  const finalizeTokenAttr = (token, state) => {
    // Apply finalization recursively to inline tokens
    if (token.type === 'inline') {
      for (const t of token.children) finalizeTokenAttr(t, state)
    }

    // Re-generate the alt text of image token to remove Marpit specific options
    if (token.type === 'image' && token.meta && token.meta.marpitImage) {
      let updatedAlt = ''
      let hasConsumed = false

      for (const opt of token.meta.marpitImage.options) {
        if (opt.consumed) {
          hasConsumed = true
        } else {
          updatedAlt += opt.leading + opt.content
        }
      }

      if (hasConsumed) {
        let newTokens = []
        md.inline.parse(updatedAlt.trimStart(), state.md, state.env, newTokens)

        token.children = newTokens
      }
    }
  }

  md.core.process = (state) => {
    try {
      refCount += 1

      return process.call(md.core, state)
    } finally {
      refCount -= 1

      if (refCount === 0) {
        // Apply finalization for every tokens
        for (const token of state.tokens) finalizeTokenAttr(token, state)
      }
    }
  }

  md.inline.ruler2.push('marpit_parse_image', ({ tokens }) => {
    for (const token of tokens) {
      if (token.type === 'image') {
        // Parse alt text as options
        const optsBase = token.content.split(/(\s+)/)

        let currentIdx = 0
        let leading = ''

        const options = optsBase.reduce((acc, opt, i) => {
          if (i % 2 === 0 && opt.length > 0) {
            currentIdx += leading.length
            acc.push({
              content: opt,
              index: currentIdx,
              leading,
              consumed: false,
            })

            leading = ''
            currentIdx += opt.length
          } else {
            leading += opt
          }
          return acc
        }, [])

        const url = token.attrGet('src')

        token.meta = token.meta || {}
        token.meta.marpitImage = {
          ...(token.meta.marpitImage || {}),
          url: url.toString(),
          options,
        }

        // Parse keyword through matchers
        for (const opt of options) {
          for (const [regexp, mergeFunc] of optionMatchers) {
            if (opt.consumed) continue
            const matched = opt.content.match(regexp)

            if (matched) {
              opt.consumed = true
              token.meta.marpitImage = {
                ...token.meta.marpitImage,
                ...mergeFunc(matched, {
                  filters: [],
                  ...token.meta.marpitImage,
                }),
              }
            }
          }
        }
      }
    }
  })
}

export const parseImage = marpitPlugin(_parseImage)
export default parseImage
