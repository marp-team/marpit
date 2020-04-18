import postcss from 'postcss'
import pagination from '../../src/postcss/pagination'

describe('Marpit PostCSS pagination plugin', () => {
  const run = (input) =>
    postcss([pagination()])
      .process(input, { from: undefined })
      .then(({ css }) => css)

  it('comments out the content declaration of section::after not for pagination', () =>
    Promise.all([
      expect(run("section::after { content: 'test'; }")).resolves.toBe(
        "section::after { /* content: 'test'; */ }"
      ),
      expect(run("section:after { content: 'test'; }")).resolves.toBe(
        "section:after { /* content: 'test'; */ }"
      ),
    ]))

  it('comments out the content declaration of section::after with id/class selector', () =>
    Promise.all([
      expect(run("section#id::after { content: ''; }")).resolves.toBe(
        "section#id::after { /* content: ''; */ }"
      ),
      expect(run("section.class::after { content: ''; }")).resolves.toBe(
        "section.class::after { /* content: ''; */ }"
      ),
    ]))

  it('comments out the content declaration of section::after with attribute selector', () =>
    Promise.all([
      expect(run("section[abc='1']::after { content: ''; }")).resolves.toBe(
        "section[abc='1']::after { /* content: ''; */ }"
      ),
      expect(run("section[abc][def]::after { content: ''; }")).resolves.toBe(
        "section[abc][def]::after { /* content: ''; */ }"
      ),
      expect(run('section[a*="b"]::after { content: \'\'; }')).resolves.toBe(
        'section[a*="b"]::after { /* content: \'\'; */ }'
      ),
    ]))

  it('comments out the content declaration of section::after with pseudo-class', () =>
    Promise.all([
      expect(run("section:hover::after { content: ''; }")).resolves.toBe(
        "section:hover::after { /* content: ''; */ }"
      ),
      expect(run("section:not(:empty)::after { content: ''; }")).resolves.toBe(
        "section:not(:empty)::after { /* content: ''; */ }"
      ),
    ]))

  it('keeps the content declaration of section::after for pagination', () =>
    Promise.all([
      expect(
        run('section::after { content: attr(data-marpit-pagination); }')
      ).resolves.toBe(
        'section::after { content: attr(data-marpit-pagination); }'
      ),
      expect(
        run(
          'section::after { content: attr(data-marpit-pagination) "/" attr(data-marpit-pagination-total); }'
        )
      ).resolves.toBe(
        'section::after { content: attr(data-marpit-pagination) "/" attr(data-marpit-pagination-total); }'
      ),
    ]))

  it('keeps the content declaration of section::after with combinators', () =>
    Promise.all([
      expect(run("section div::after { content: ''; }")).resolves.toBe(
        "section div::after { content: ''; }"
      ),
      expect(run("section > div::after { content: ''; }")).resolves.toBe(
        "section > div::after { content: ''; }"
      ),
      expect(run("section+section::after { content: ''; }")).resolves.toBe(
        "section+section::after { content: ''; }"
      ),
      expect(run("section~p::after { content: ''; }")).resolves.toBe(
        "section~p::after { content: ''; }"
      ),
    ]))

  it('keeps the content declaration of section-like-element::after', () =>
    expect(run("section-like-element::after { content: ''; }")).resolves.toBe(
      "section-like-element::after { content: ''; }"
    ))
})
