import cheerio from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import comment from '../../src/markdown/comment'

describe('Marpit comment plugin', () => {
  const md = (mdOption = {}) => {
    const instance = new MarkdownIt('commonmark', mdOption)
    instance.marpit = { options: {} }

    return instance.use(comment)
  }

  const text = dedent`
    # foo
    <!-----comment!-->

    <!--
    supports
    multiline
    -->
    ## bar
    comment<!-- inline -->Test

    ### <!-- comment in header -->
  `

  const htmls = [true, false]

  htmls.forEach((html) => {
    context(`with html option as ${html}`, () => {
      const markdown = md({ html })
      const extractComments = ($cheerio) =>
        $cheerio('*')
          .contents()
          .filter(function filterComment() {
            return this.nodeType === 8
          })

      it('extracts comment and stores to token meta', () => {
        const parsed = markdown.parse(text)
        const reducer = (arr, token) => {
          if (token.type === 'marpit_comment') return [...arr, token.content]
          if (token.type === 'inline')
            return [...arr, ...token.children.reduce(reducer, [])]

          return arr
        }

        const comments = parsed.reduce(reducer, [])

        expect(comments).toContain('comment!')
        expect(comments).toContain('supports\nmultiline')
        expect(comments).toContain('inline')
        expect(comments).toContain('comment in header')
      })

      it('strips comment in rendering', () => {
        const $ = cheerio.load(markdown.render(text))
        const comments = extractComments($)

        expect(comments).toHaveLength(0)
        expect($('h1')).toHaveLength(1)
        expect($('h1').text()).toBe('foo')
        expect($('h2')).toHaveLength(1)
        expect($('h2').text()).toBe('bar')
        expect($('h2 + p').text()).toBe('commentTest')
        expect($('h3')).toHaveLength(1)
        expect($('h3').text()).toBe('')
      })

      const ignoreCases = {
        'inline code': '`<!-- code -->`',
        'code block': '\t<!-- code -->',
        fence: '```\n<!-- code -->\n```',
      }

      Object.keys(ignoreCases).forEach((elementType) => {
        context(`when ${elementType} has HTML comment`, () => {
          it('keeps HTML comment', () => {
            const $ = cheerio.load(markdown.render(ignoreCases[elementType]))
            const comments = extractComments($)
            const code = $('code')

            expect(comments).toHaveLength(0)
            expect(code.text().trim()).toBe('<!-- code -->')
          })
        })
      })
    })
  })
})
