/** @module */
import postcss from 'postcss'

const uniqKeyChars =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const uniqKeyCharsLength = uniqKeyChars.length

function generateUniqKey(length = 8) {
  let ret = ''

  for (let i = 0; i < length; i += 1)
    ret += uniqKeyChars[Math.floor(Math.random() * uniqKeyCharsLength)]

  return ret
}

const injectScopePostCSSplugin = postcss.plugin(
  'marpit-style-assign-postcss-inject-scope',
  attr => css =>
    css.walkRules(rule => {
      rule.selectors = rule.selectors.map(selector => {
        const injectSelector = /^section(?![\w-])/.test(selector)
          ? selector.slice(7)
          : ` ${selector}`

        return `section[${attr}]${injectSelector}`
      })
    })
)

/**
 * Marpit style assign plugin.
 *
 * Assign style global directive and parsed styles to Marpit instance's
 * `lastStyles' property.
 *
 * @alias module:markdown/style/assign
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Marpit} marpit Marpit instance.
 * @param {Object} [opts]
 * @param {boolean} [opts.supportScoped=true] Setting whether support scoped
 *     style.
 */
function assign(md, marpit, opts = {}) {
  const shouldSupportScoped =
    'supportScoped' in opts ? !!opts.supportScoped : true

  md.core.ruler.after('marpit_slide', 'marpit_style_assign', state => {
    if (state.inlineMode) return

    const directives = marpit.lastGlobalDirectives || {}
    marpit.lastStyles = directives.style ? [directives.style] : []

    let current

    for (const token of state.tokens) {
      if (token.meta && token.meta.marpitSlideElement === 1) {
        current = token
      } else if (token.meta && token.meta.marpitSlideElement === -1) {
        current = undefined
      } else if (token.type === 'marpit_style') {
        let { content } = token

        // Scoped style into current page
        const { marpitStyleScoped } = token.meta || {}

        if (shouldSupportScoped && current && marpitStyleScoped) {
          let metaAttr = current.meta.marpitScopeMeta

          if (!metaAttr) {
            metaAttr = `data-marpit-scope-${generateUniqKey()}`

            current.meta.marpitScopeMeta = metaAttr
            current.attrSet(metaAttr, '')
          }

          const processor = postcss([injectScopePostCSSplugin(metaAttr)])

          try {
            content = processor.process(content).css
          } catch (e) {
            content = undefined
          }
        }

        if (content) marpit.lastStyles.push(content)
      }
    }
  })
}

export default assign
