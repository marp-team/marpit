import assert from 'assert'
import MarkdownIt from 'markdown-it'
import unicodeEmoji from '../../src/markdown/unicode_emoji'

describe('Marpit unicode emoji plugin', () => {
  const md = () => new MarkdownIt('commonmark').use(unicodeEmoji)

  it('wrap emoji by span tag', () => {
    assert(md().renderInline('👨‍👩‍👧‍👦') === '<span data-marpit-emoji>👨‍👩‍👧‍👦</span>')
  })
})
