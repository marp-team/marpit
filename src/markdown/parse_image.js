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
 */
function parseImage(md) {
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
          // TODO: Implement cross-browser image zoom without affecting DOM tree
          // (Pre-released Marp uses `zoom` but it has not supported in Firefox)
          if (opt.match(/^(\d*\.)?\d+%$/)) token.meta.marpitImage.size = opt
        })
      }
    })
  })
}

export default parseImage
