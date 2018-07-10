import assert from 'assert'
import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import headingDivider from '../../src/markdown/heading_divider'
import slide from '../../src/markdown/slide'

describe('Marpit heading divider plugin', () => {
  const marpitStub = headingDividerOption => ({
    options: { headingDivider: headingDividerOption },
  })

  const md = marpitInstance =>
    new MarkdownIt('commonmark')
      .use(pluginMd => pluginMd.core.ruler.push('marpit_slide', () => {}))
      .use(headingDivider, marpitInstance)

  const markdownText = '# 1st\n## 2nd\n### 3rd\n#### 4th'

  const pickHrAndHeading = tokens =>
    tokens.filter(
      (t, idx) => t.type === 'hr' || (idx > 0 && tokens[idx - 1].type === 'hr')
    )

  context('with headingDivider option as false', () => {
    const markdown = md(marpitStub(false))

    it('does not add any horizontal ruler tokens', () => {
      const tokens = markdown.parse(markdownText)
      assert(tokens.filter(t => t.type === 'hr').length === 0)
    })
  })

  context('with headingDivider option as 3', () => {
    const markdown = md(marpitStub(3))

    it('adds hidden hr token to before until 3rd level headings except first', () => {
      const tokens = markdown.parse(markdownText)
      assert(tokens.filter(t => t.type === 'hr').length === 2)

      const hrAndHeadings = pickHrAndHeading(tokens)
      assert(hrAndHeadings[0].type === 'hr')
      assert(hrAndHeadings[0].hidden)
      assert(hrAndHeadings[1].type === 'heading_open')
      assert(hrAndHeadings[1].tag === 'h2')
      assert(hrAndHeadings[2].type === 'hr')
      assert(hrAndHeadings[2].hidden)
      assert(hrAndHeadings[3].type === 'heading_open')
      assert(hrAndHeadings[3].tag === 'h3')
    })
  })

  context('with headingDivider option as array contained 3', () => {
    const markdown = md(marpitStub([3]))

    it('adds hidden hr token to before 3rd level heading', () => {
      const tokens = markdown.parse(markdownText)
      assert(tokens.filter(t => t.type === 'hr').length === 1)

      const hrAndHeadings = pickHrAndHeading(tokens)
      assert(hrAndHeadings[0].type === 'hr')
      assert(hrAndHeadings[0].hidden)
      assert(hrAndHeadings[1].type === 'heading_open')
      assert(hrAndHeadings[1].tag === 'h3')
    })
  })

  context('with headingDivider option as array contained 2 and 4', () => {
    const markdown = md(marpitStub([2, 4]))

    it('adds hidden hr token to before 2nd and 4th level heading', () => {
      const tokens = markdown.parse(markdownText)
      assert(tokens.filter(t => t.type === 'hr').length === 2)

      const hrAndHeadings = pickHrAndHeading(tokens)
      assert(hrAndHeadings[0].type === 'hr')
      assert(hrAndHeadings[0].hidden)
      assert(hrAndHeadings[1].type === 'heading_open')
      assert(hrAndHeadings[1].tag === 'h2')
      assert(hrAndHeadings[2].type === 'hr')
      assert(hrAndHeadings[2].hidden)
      assert(hrAndHeadings[3].type === 'heading_open')
      assert(hrAndHeadings[3].tag === 'h4')
    })
  })

  context('with headingDivider option as 4 and slide plugin', () => {
    const mdWithSlide = instance =>
      new MarkdownIt('commonmark').use(slide).use(headingDivider, instance)

    it('renders four <section> elements', () => {
      const $ = cheerio.load(mdWithSlide(marpitStub(4)).render(markdownText))
      assert($('section').length === 4)
    })
  })

  context('with invalid headingDivider option', () => {
    const markdown = md(marpitStub('invalid'))
    it('throws error', () => assert.throws(() => markdown.parse(markdownText)))
  })
})
