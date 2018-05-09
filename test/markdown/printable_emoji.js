import assert from 'assert'
import MarkdownIt from 'markdown-it'
import printableEmoji from '../../src/markdown/printable_emoji'

describe('Marpit printable emoji plugin', () => {
  const md = () => new MarkdownIt('commonmark').use(printableEmoji)

  it('wrap emoji by span tag', () => {
    assert(md().renderInline('👨‍👩‍👧‍👦') === '<span data-marpit-emoji>👨‍👩‍👧‍👦</span>')
  })
})
