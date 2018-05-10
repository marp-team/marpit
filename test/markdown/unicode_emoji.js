import assert from 'assert'
import MarkdownIt from 'markdown-it'
import unicodeEmoji from '../../src/markdown/unicode_emoji'

describe('Marpit unicode emoji plugin', () => {
  const md = () => new MarkdownIt('commonmark').use(unicodeEmoji)

  it('wrap each emoji by span tag with data attribute', () => {
    // Simple emoji
    assert(md().renderInline('😃') === '<span data-marpit-emoji>😃</span>')

    // Multiple emojis
    assert(
      md().renderInline('👍+👎') ===
        '<span data-marpit-emoji>👍</span>+<span data-marpit-emoji>👎</span>'
    )

    // Ligatures
    const ligatures = {
      '👨\u{1f3fb}': '👨🏻', // Skin tone
      '👩\u{1f3fc}': '👩🏼',
      '👦\u{1f3fd}': '👦🏽',
      '👧\u{1f3fe}': '👧🏾',
      '👶\u{1f3ff}': '👶🏿',
      '👨\u{200d}👩\u{200d}👦': '👨‍👩‍👦', // Family ligature
      '👨\u{200d}👩\u{200d}👧': '👨‍👩‍👧',
    }
    Object.keys(ligatures).forEach(markdown => {
      const out = md().renderInline(markdown)
      assert(out === `<span data-marpit-emoji>${ligatures[markdown]}</span>`)
    })
  })

  it('wraps emoji in inline code ', () => {
    const out = md().renderInline('`emoji 👌`')
    assert(out === '<code>emoji <span data-marpit-emoji>👌</span></code>')
  })

  it('wraps emoji in code block', () => {
    const fenced = md().render('```\nemoji 👌\n```')
    const indented = md().render('\temoji 👌')
    const expectedStart = '<pre><code>emoji <span data-marpit-emoji>👌</span>'

    assert(fenced.startsWith(expectedStart))
    assert(indented.startsWith(expectedStart))

    // Prevent wrapping in attributes
    const langFence = md().render('```<😃>\n👍\n```')
    assert(
      langFence.startsWith(
        '<pre><code class="language-&lt;😃&gt;"><span data-marpit-emoji>👍</span>'
      )
    )
  })

  it('follows variation sequence', () => {
    // Numbers
    assert(
      md().renderInline('1 2\u{fe0e} 3\u{fe0f}') ===
        '1 2\u{fe0e} <span data-marpit-emoji>3\u{fe0f}</span>'
    )

    // Right arrow
    assert(
      md().renderInline('➡ ➡\u{fe0e} ➡\u{fe0f}') ===
        '➡ ➡\u{fe0e} <span data-marpit-emoji>➡\u{fe0f}</span>'
    )
  })
})
