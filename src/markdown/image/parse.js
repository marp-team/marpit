/** @module */
import colorString from 'color-string'
import marpitPlugin from '../../plugin'

const escape = (target) =>
  target.replace(
    /[\\;:()]/g,
    (matched) => `\\${matched[0].codePointAt(0).toString(16)} `
  )

const optionMatchers = new Map()

// The scale percentage for resize background
optionMatchers.set(/^(\d*\.)?\d+%$/, (matches) => ({ size: matches[0] }))

// width and height
const normalizeLength = (v) => `${v}${/^(\d*\.)?\d+$/.test(v) ? 'px' : ''}`

optionMatchers.set(
  /^w(?:idth)?:((?:\d*\.)?\d+(?:%|ch|cm|em|ex|in|mm|pc|pt|px)?|auto)$/,
  (matches) => ({ width: normalizeLength(matches[1]) })
)

optionMatchers.set(
  /^h(?:eight)?:((?:\d*\.)?\d+(?:%|ch|cm|em|ex|in|mm|pc|pt|px)?|auto)$/,
  (matches) => ({ height: normalizeLength(matches[1]) })
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
        const colorFunc = arg.match(/^(rgba?|hsla?)\((.*)\)$/)

        args.push(
          colorFunc ? `${colorFunc[1]}(${escape(colorFunc[2])})` : escape(arg)
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
 * @alias module:markdown/image/parse
 * @param {MarkdownIt} md markdown-it instance.
 */
function parseImage(md) {
  const { process } = md.core

  // Store original URL, for the color shorthand.
  // (Avoid a side effect from link normalization)
  let originalURLMap
  let refCount = 0

  const finalizeTokenAttr = (token) => {
    // Convert imprimitive attribute value into primitive string
    if (token.attrs && Array.isArray(token.attrs))
      token.attrs = token.attrs.map(([name, value]) => [name, value.toString()])

    if (token.type === 'inline') {
      // Apply finalization recursively to inline tokens
      for (const t of token.children) finalizeTokenAttr(t)
    }
  }

  md.core.process = (state) => {
    const { normalizeLink } = md

    // Prevent reset of WeakMap caused by calling core process internally
    if (refCount === 0) originalURLMap = new WeakMap()

    try {
      md.normalizeLink = (url) => {
        const imprimitiveUrl = new String(normalizeLink.call(md, url))
        originalURLMap.set(imprimitiveUrl, url)

        return imprimitiveUrl
      }

      refCount += 1
      return process.call(md.core, state)
    } finally {
      refCount -= 1
      md.normalizeLink = normalizeLink

      if (refCount === 0) {
        // Apply finalization for every tokens
        for (const token of state.tokens) finalizeTokenAttr(token)
      }
    }
  }

  md.inline.ruler2.push('marpit_parse_image', ({ tokens }) => {
    for (const token of tokens) {
      if (token.type === 'image') {
        const options = token.content.split(/\s+/).filter((s) => s.length > 0)
        const url = token.attrGet('src')
        const originalUrl = originalURLMap.has(url)
          ? originalURLMap.get(url)
          : url

        token.meta = token.meta || {}
        token.meta.marpitImage = {
          ...(token.meta.marpitImage || {}),
          url: url.toString(),
          options,
        }

        // Detect shorthand for setting color (Use value before normalization)
        if (
          !!colorString.get(originalUrl) ||
          originalUrl.toLowerCase() === 'currentcolor'
        ) {
          token.meta.marpitImage.color = originalUrl
          token.hidden = true
        }

        // Parse keyword through matchers
        for (const opt of options) {
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
        }
      }
    }
  })
}

export default marpitPlugin(parseImage)
