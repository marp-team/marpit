import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import comment from '../../src/markdown/comment'
import headingDivider from '../../src/markdown/heading_divider'
import parseDirectives from '../../src/markdown/directives/parse'
import slide from '../../src/markdown/slide'

describe('Marpit heading divider plugin', () => {
  const marpitStub = headingDividerOption => ({
    customDirectives: { global: {}, local: {} },
    options: { headingDivider: headingDividerOption },
  })

  const markdownText = '# 1st\n## 2nd\n### 3rd\n#### 4th'

  const pickHrAndHeading = tokens =>
    tokens.filter(
      (t, idx) => t.type === 'hr' || (idx > 0 && tokens[idx - 1].type === 'hr')
    )

  describe('Constructor option', () => {
    const md = marpitInstance => {
      const instance = new MarkdownIt('commonmark')
      instance.marpit = marpitInstance

      return instance
        .use(pluginMd => pluginMd.core.ruler.push('marpit_slide', () => {}))
        .use(headingDivider)
    }

    context('with headingDivider option as false', () => {
      const markdown = md(marpitStub(false))

      it('does not add any horizontal ruler tokens', () => {
        const tokens = markdown.parse(markdownText)
        expect(tokens.filter(t => t.type === 'hr')).toHaveLength(0)
      })
    })

    context('with headingDivider option as 3', () => {
      const markdown = md(marpitStub(3))

      it('adds hidden hr token to before until 3rd level headings except first', () => {
        const tokens = markdown.parse(markdownText)
        expect(tokens.filter(t => t.type === 'hr')).toHaveLength(2)

        const hrAndHeadings = pickHrAndHeading(tokens)
        expect(hrAndHeadings[0].type).toBe('hr')
        expect(hrAndHeadings[0].hidden).toBe(true)
        expect(hrAndHeadings[1].type).toBe('heading_open')
        expect(hrAndHeadings[1].tag).toBe('h2')
        expect(hrAndHeadings[2].type).toBe('hr')
        expect(hrAndHeadings[2].hidden).toBe(true)
        expect(hrAndHeadings[3].type).toBe('heading_open')
        expect(hrAndHeadings[3].tag).toBe('h3')
      })
    })

    context('with headingDivider option as array contained 3', () => {
      const markdown = md(marpitStub([3]))

      it('adds hidden hr token to before 3rd level heading', () => {
        const tokens = markdown.parse(markdownText)
        expect(tokens.filter(t => t.type === 'hr')).toHaveLength(1)

        const hrAndHeadings = pickHrAndHeading(tokens)
        expect(hrAndHeadings[0].type).toBe('hr')
        expect(hrAndHeadings[0].hidden).toBe(true)
        expect(hrAndHeadings[1].type).toBe('heading_open')
        expect(hrAndHeadings[1].tag).toBe('h3')
      })
    })

    context('with headingDivider option as array contained 2 and 4', () => {
      const markdown = md(marpitStub([2, 4]))

      it('adds hidden hr token to before 2nd and 4th level heading', () => {
        const tokens = markdown.parse(markdownText)
        expect(tokens.filter(t => t.type === 'hr')).toHaveLength(2)

        const hrAndHeadings = pickHrAndHeading(tokens)
        expect(hrAndHeadings[0].type).toBe('hr')
        expect(hrAndHeadings[0].hidden).toBe(true)
        expect(hrAndHeadings[1].type).toBe('heading_open')
        expect(hrAndHeadings[1].tag).toBe('h2')
        expect(hrAndHeadings[2].type).toBe('hr')
        expect(hrAndHeadings[2].hidden).toBe(true)
        expect(hrAndHeadings[3].type).toBe('heading_open')
        expect(hrAndHeadings[3].tag).toBe('h4')
      })
    })

    context('with headingDivider option as 4 and slide plugin', () => {
      const mdWithSlide = marpitInstance => {
        const instance = new MarkdownIt('commonmark')
        instance.marpit = marpitInstance

        return instance.use(slide).use(headingDivider)
      }

      it('renders four <section> elements', () => {
        const $ = cheerio.load(mdWithSlide(marpitStub(4)).render(markdownText))
        expect($('section')).toHaveLength(4)
      })
    })

    context('with invalid headingDivider option', () => {
      const markdown = md(marpitStub('invalid'))

      it('does not add any horizontal ruler tokens', () => {
        const tokens = markdown.parse(markdownText)
        expect(tokens.filter(t => t.type === 'hr')).toHaveLength(0)
      })
    })
  })

  describe('Global directive', () => {
    const md = (
      marpitInstance = {
        customDirectives: { global: {}, local: {} },
        options: {},
      }
    ) => {
      const instance = new MarkdownIt('commonmark')
      instance.marpit = marpitInstance

      return instance
        .use(comment)
        .use(pluginMd => pluginMd.core.ruler.push('marpit_slide', () => {}))
        .use(parseDirectives)
        .use(headingDivider)
    }

    const markdownTextWithDirective = level =>
      `---\nheadingDivider: ${level}\n---\n\n${markdownText}`

    const markdownTextWithComment = level =>
      `${markdownText}\n<!-- headingDivider: ${level} -->`

    context('with headingDivider directive as 3', () => {
      const markdown = md()
      const text = markdownTextWithDirective(3)

      it('adds hidden hr token to before until 3rd level headings except first', () => {
        const tokens = markdown.parse(text)
        expect(tokens.filter(t => t.type === 'hr')).toHaveLength(2)

        const hrAndHeadings = pickHrAndHeading(tokens)
        expect(hrAndHeadings[0].type).toBe('hr')
        expect(hrAndHeadings[0].hidden).toBe(true)
        expect(hrAndHeadings[1].type).toBe('heading_open')
        expect(hrAndHeadings[1].tag).toBe('h2')
        expect(hrAndHeadings[2].type).toBe('hr')
        expect(hrAndHeadings[2].hidden).toBe(true)
        expect(hrAndHeadings[3].type).toBe('heading_open')
        expect(hrAndHeadings[3].tag).toBe('h3')
      })
    })

    context(
      'with headingDivider directive with comment as array contained 2 and 4',
      () => {
        const markdown = md()
        const text = markdownTextWithComment('[2,4]')

        it('adds hidden hr token to before 2nd and 4th level heading', () => {
          const tokens = markdown.parse(text)
          expect(tokens.filter(t => t.type === 'hr')).toHaveLength(2)

          const hrAndHeadings = pickHrAndHeading(tokens)
          expect(hrAndHeadings[0].type).toBe('hr')
          expect(hrAndHeadings[0].hidden).toBe(true)
          expect(hrAndHeadings[1].type).toBe('heading_open')
          expect(hrAndHeadings[1].tag).toBe('h2')
          expect(hrAndHeadings[2].type).toBe('hr')
          expect(hrAndHeadings[2].hidden).toBe(true)
          expect(hrAndHeadings[3].type).toBe('heading_open')
          expect(hrAndHeadings[3].tag).toBe('h4')
        })
      }
    )

    context('with headingDivider constructor option', () => {
      const markdown = md(marpitStub(4))

      it('overrides headingDivider option by directive', () => {
        const tokens = markdown.parse(markdownText)
        expect(tokens.filter(t => t.type === 'hr')).toHaveLength(3)

        const overridden = markdown.parse(markdownTextWithDirective('false'))
        expect(overridden.filter(t => t.type === 'hr')).toHaveLength(0)
      })

      it('ignores invalid headingDivider directive', () => {
        const overridden = markdown.parse(markdownTextWithDirective('invalid'))
        expect(overridden.filter(t => t.type === 'hr')).toHaveLength(3)
      })
    })
  })
})
