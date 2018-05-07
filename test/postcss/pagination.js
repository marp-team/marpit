import assert from 'assert'
import postcss from 'postcss'
import pagination from '../../src/postcss/pagination'

describe('Marpit PostCSS pagination plugin', () => {
  const run = input =>
    postcss([pagination()]).process(input, { from: undefined })

  it('comments out the content declaration of section::after not for pagination', () =>
    Promise.all([
      run("section::after { content: 'test'; }").then(result =>
        assert(result.css === "section::after { /* content: 'test'; */ }")
      ),
      run("section:after { content: 'test'; }").then(result =>
        assert(result.css === "section:after { /* content: 'test'; */ }")
      ),
    ]))

  it('comments out the content declaration of section::after with id/class selector', () =>
    Promise.all([
      run("section#id::after { content: ''; }").then(result =>
        assert(result.css === "section#id::after { /* content: ''; */ }")
      ),
      run("section.class::after { content: ''; }").then(result =>
        assert(result.css === "section.class::after { /* content: ''; */ }")
      ),
    ]))

  it('comments out the content declaration of section::after with attribute selector', () =>
    Promise.all([
      run("section[abc='1']::after { content: ''; }").then(result =>
        assert(result.css === "section[abc='1']::after { /* content: ''; */ }")
      ),
      run("section[abc][def]::after { content: ''; }").then(result =>
        assert(result.css === "section[abc][def]::after { /* content: ''; */ }")
      ),
      run('section[a*="b"]::after { content: \'\'; }').then(result =>
        assert(result.css === 'section[a*="b"]::after { /* content: \'\'; */ }')
      ),
    ]))

  it('comments out the content declaration of section::after with pseudo-class', () =>
    Promise.all([
      run("section:hover::after { content: ''; }").then(result =>
        assert(result.css === "section:hover::after { /* content: ''; */ }")
      ),
      run("section:not(:empty)::after { content: ''; }").then(result =>
        assert(
          result.css === "section:not(:empty)::after { /* content: ''; */ }"
        )
      ),
    ]))

  it('keeps the content declaration of section::after for pagination', () =>
    run('section::after { content: attr(data-marpit-pagination); }').then(
      result =>
        assert(
          result.css ===
            'section::after { content: attr(data-marpit-pagination); }'
        )
    ))

  it('keeps the content declaration of section::after with combinators', () =>
    Promise.all([
      run("section div::after { content: ''; }").then(result =>
        assert(result.css === "section div::after { content: ''; }")
      ),
      run("section > div::after { content: ''; }").then(result =>
        assert(result.css === "section > div::after { content: ''; }")
      ),
      run("section+section::after { content: ''; }").then(result =>
        assert(result.css === "section+section::after { content: ''; }")
      ),
      run("section~p::after { content: ''; }").then(result =>
        assert(result.css === "section~p::after { content: ''; }")
      ),
    ]))

  it('keeps the content declaration of section-like-element::after', () =>
    run("section-like-element::after { content: ''; }").then(result =>
      assert(result.css === "section-like-element::after { content: ''; }")
    ))
})
