/** @module */
import MarkdownItFrontMatter from 'markdown-it-front-matter'
import yaml from './yaml'
import { globals, locals } from './directives'

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
 * @param {boolean} [opts.looseYAML=false] Allow loose YAML for directives.
 */
function parse(md, marpit, opts = {}) {
  // Front-matter support
  const frontMatter = opts.frontMatter === undefined ? true : !!opts.frontMatter
  let frontMatterObject = {}

  if (frontMatter) {
    md.core.ruler.before('block', 'marpit_directives_front_matter', state => {
      frontMatterObject = {}
      if (!state.inlineMode) marpit.lastGlobalDirectives = {}
    })
    md.use(MarkdownItFrontMatter, fm => {
      frontMatterObject.text = fm

      const parsed = yaml(fm, !!opts.looseYAML)
      if (parsed !== false) frontMatterObject.yaml = parsed
    })
  }

  const isComment = token =>
    token.type === 'marpit_comment' && token.meta.marpitParsedDirectives

  // Parse global directives
  md.core.ruler.after('inline', 'marpit_directives_global_parse', state => {
    if (state.inlineMode) return

    let globalDirectives = {}
    const applyDirectives = obj => {
      for (const key of Object.keys(obj)) {
        const globalKey = key.startsWith('$') ? key.slice(1) : key

        if (globals[globalKey])
          globalDirectives = {
            ...globalDirectives,
            ...globals[globalKey](obj[key], marpit),
          }
      }
    }

    if (frontMatterObject.yaml) applyDirectives(frontMatterObject.yaml)

    for (const token of state.tokens) {
      if (isComment(token)) {
        applyDirectives(token.meta.marpitParsedDirectives)
      } else if (token.type === 'inline') {
        for (const t of token.children) {
          if (isComment(t)) applyDirectives(t.meta.marpitParsedDirectives)
        }
      }
    }

    marpit.lastGlobalDirectives = { ...globalDirectives }
  })

  // Parse local directives and apply meta to slide
  md.core.ruler.after('marpit_slide', 'marpit_directives_parse', state => {
    if (state.inlineMode) return

    const slides = []
    const cursor = { slide: undefined, local: {}, spot: {} }

    const applyDirectives = obj => {
      for (const key of Object.keys(obj)) {
        if (locals[key])
          cursor.local = { ...cursor.local, ...locals[key](obj[key], marpit) }

        // Spot directives
        // (Apply local directive to only current slide by prefix "_")
        if (key.startsWith('_')) {
          const spotKey = key.slice(1)

          if (locals[spotKey])
            cursor.spot = {
              ...cursor.spot,
              ...locals[spotKey](obj[key], marpit),
            }
        }
      }
    }

    if (frontMatterObject.yaml) applyDirectives(frontMatterObject.yaml)

    for (const token of state.tokens) {
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
      } else if (isComment(token)) {
        applyDirectives(token.meta.marpitParsedDirectives)
      } else if (token.type === 'inline') {
        for (const t of token.children) {
          if (isComment(t)) applyDirectives(t.meta.marpitParsedDirectives)
        }
      }
    }

    // Assign global directives to meta
    for (const token of slides)
      token.meta.marpitDirectives = {
        ...token.meta.marpitDirectives,
        ...marpit.lastGlobalDirectives,
      }
  })
}

export default parse
