/** @module */
import MarkdownItFrontMatter from 'markdown-it-front-matter'
import YAML, { FAILSAFE_SCHEMA } from 'js-yaml'
import { globals, locals } from './directives'

// Parse text as YAML by using js-yaml's FAILSAFE_SCHEMA.
function parseYAMLObject(text) {
  try {
    const obj = YAML.safeLoad(text, { schema: FAILSAFE_SCHEMA })
    if (obj === null || typeof obj !== 'object') return false

    return obj
  } catch (e) {
    return false
  }
}

/**
 * Parse Marpit directives and store result to the slide token meta.
 *
 * Marpit comment plugin ans slide plugin requires already loaded to
 * markdown-it instance.
 *
 * @alias module:markdown/directives/parse
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Marpit} marpit Marpit instance.
 * @param {Object} [opts]
 * @param {boolean} [opts.frontMatter=true] Switch feature to support YAML
 *     front-matter. If true, you can use Jekyll style directive setting to the
 *     first page.
 */
function parse(md, marpit, opts = {}) {
  // Front-matter support
  const frontMatter = opts.frontMatter === undefined ? true : !!opts.frontMatter
  let frontMatterText

  if (frontMatter) {
    md.core.ruler.before('block', 'marpit_directives_front_matter', state => {
      frontMatterText = undefined
      if (!state.inlineMode) marpit.lastGlobalDirectives = {}
    })
    md.use(MarkdownItFrontMatter, fm => {
      frontMatterText = fm
    })
  }

  md.core.ruler.after('marpit_slide', 'marpit_directives_parse', state => {
    if (state.inlineMode) return

    const slides = []
    const cursor = { slide: undefined, global: {}, local: {}, spot: {} }

    const applyDirectives = text => {
      const parsed = parseYAMLObject(text)
      if (parsed === false) return

      Object.keys(parsed).forEach(key => {
        const v = parsed[key]

        // Global directives (Support prefix "$" for clarity/compatibility)
        const globalKey = key.startsWith('$') ? key.slice(1) : key
        if (globals[globalKey])
          cursor.global = { ...cursor.global, ...globals[globalKey](v, marpit) }

        // Local directives
        if (locals[key])
          cursor.local = { ...cursor.local, ...locals[key](v, marpit) }

        // Spot directives
        // (Apply local directive to only current slide by prefix "_")
        if (key.startsWith('_')) {
          const spotKey = key.slice(1)

          if (locals[spotKey])
            cursor.spot = { ...cursor.spot, ...locals[spotKey](v, marpit) }
        }
      })
    }

    // At first, parse and apply YAML to cursor if assigned front-matter.
    if (frontMatter && frontMatterText) applyDirectives(frontMatterText)

    // Walk tokens to parse slides and comments.
    state.tokens.forEach(token => {
      if (token.meta && token.meta.marpitSlideElement === 1) {
        // Initialize Marpit directives meta
        token.meta.marpitDirectives = {}

        slides.push(token)
        cursor.slide = token
      } else if (token.meta && token.meta.marpitSlideElement === -1) {
        // Assign local and spot directives to meta
        cursor.slide.meta.marpitDirectives = {
          ...cursor.slide.meta.marpitDirectives,
          ...cursor.local,
          ...cursor.spot,
        }

        cursor.spot = {}
      } else if (token.type === 'marpit_comment') {
        applyDirectives(token.content)
      }
    })

    // Assign global directives to meta
    slides.forEach(token => {
      token.meta.marpitDirectives = {
        ...token.meta.marpitDirectives,
        ...cursor.global,
      }
    })

    // Store last parsed global directives to Marpit instance
    marpit.lastGlobalDirectives = { ...cursor.global }
  })
}

export default parse
