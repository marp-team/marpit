/** @module */

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

  // The scale percentage for resize
  // TODO: Implement cross-browser image zoom without affecting DOM tree
  // (Pre-released Marp uses `zoom` but it has not supported in Firefox)
  optionMatchers.set(/^(\d*\.)?\d+%$/, matches => ({ size: matches[0] }))

  if (pluginOptions.filters) {
    // CSS filters
    optionMatchers.set(/^blur(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['blur', matches[1] || '10px']],
    }))
    optionMatchers.set(/^brightness(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['brightness', matches[1] || '1.5']],
    }))
    optionMatchers.set(/^contrast(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['contrast', matches[1] || '2']],
    }))
    optionMatchers.set(
      /^drop-shadow(?::(.+?),(.+?)(?:,(.+?))?(?:,(.+?))?)?$/,
      (matches, meta) => ({
        filters: [
          ...meta.filters,
          [
            'drop-shadow',
            matches
              .slice(1)
              .filter(v => v)
              .join(' ') || '0 5px 10px rgba(0,0,0,.4)',
          ],
        ],
      })
    )
    optionMatchers.set(/^grayscale(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['grayscale', matches[1] || '1']],
    }))
    optionMatchers.set(/^hue-rotate(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['hue-rotate', matches[1] || '180deg']],
    }))
    optionMatchers.set(/^invert(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['invert', matches[1] || '1']],
    }))
    optionMatchers.set(/^opacity(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['opacity', matches[1] || '.5']],
    }))
    optionMatchers.set(/^saturate(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['saturate', matches[1] || '2']],
    }))
    optionMatchers.set(/^sepia(?::(.+))?$/, (matches, meta) => ({
      filters: [...meta.filters, ['sepia', matches[1] || '1']],
    }))
  }

  md.inline.ruler2.push('marpit_parse_image', ({ tokens }) => {
    tokens.forEach(token => {
      if (token.type === 'image') {
        const options = token.content.split(/\s+/).filter(s => s.length > 0)

        token.meta = token.meta || {}
        token.meta.marpitImage = {
          ...(token.meta.marpitImage || {}),
          url: token.attrGet('src'),
          options,
        }

        options.forEach(opt => {
          optionMatchers.forEach((mergeFunc, regexp) => {
            const matched = opt.match(regexp)

            if (matched)
              token.meta.marpitImage = {
                ...token.meta.marpitImage,
                ...mergeFunc(matched, {
                  filters: [],
                  ...token.meta.marpitImage,
                }),
              }
          })
        })

        // Build and apply filter style
        if (token.meta.marpitImage.filters) {
          token.meta.marpitImage.filter = token.meta.marpitImage.filters
            .reduce((arr, fltrs) => [...arr, `${fltrs[0]}(${fltrs[1]})`], [])
            .join(' ')

          token.attrJoin('style', `filter:${token.meta.marpitImage.filter};`)
        }
      }
    })
  })
}

export default parseImage
