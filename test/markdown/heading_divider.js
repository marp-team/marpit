import assert from 'assert'
import MarkdownIt from 'markdown-it'
import headingDivider from '../../src/markdown/heading_divider'

describe('Marpit heading divider plugin', () => {
  const marpitStub = headingDividerOption => ({
    options: { headingDivider: headingDividerOption },
  })

  const md = marpitInstance =>
    new MarkdownIt('commonmark')
      .use(pluginMd => pluginMd.core.ruler.push('marpit_slide', () => {}))
      .use(headingDivider, marpitInstance)

  const markdownText = '# 1st\n## 2nd\n### 3rd\n#### 4th'

  context('with headingDivider option as false', () => {
    const markdown = md(marpitStub(false))

    it('does not add any horizontal ruler tokens', () => {
      const tokens = markdown.parse(markdownText)
      assert(tokens.filter(t => t.type === 'hr').length === 0)
    })
  })

  context('with headingDivider option as array contained "3"', () => {
    const markdown = md(marpitStub([3]))

    it('adds hidden horizontal ruler to before 3rd level heading', () => {
      const tokens = markdown.parse(markdownText)
      const filtered = tokens.filter(
        (t, idx) =>
          t.type === 'hr' || (idx > 0 && tokens[idx - 1].type === 'hr')
      )

      assert(tokens.filter(t => t.type === 'hr').length === 1)
      assert(filtered[1].type === 'heading_open')
      assert(filtered[1].tag === 'h3')
    })
  })
})
