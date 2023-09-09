import postcss from 'postcss'
import { sectionSize } from '../../src/postcss/section_size'

describe('Marpit PostCSS section size plugin', () => {
  const run = (input) =>
    postcss([sectionSize()]).process(input, { from: undefined })

  it('adds marpitSectionSize object to result', () =>
    run('').then((result) => {
      expect(result.marpitSectionSize).toBeInstanceOf(Object)
      expect(result.marpitSectionSize).toStrictEqual({})
    }))

  it('parses width and height declaration on section selector', () =>
    run('section { width: 123px; height: 456px; }').then((result) =>
      expect(result.marpitSectionSize).toStrictEqual({
        width: '123px',
        height: '456px',
      }),
    ))

  it('supports grouping selector', () =>
    run('html, body, section { width: 234px; height: 567px; }').then((result) =>
      expect(result.marpitSectionSize).toStrictEqual({
        width: '234px',
        height: '567px',
      }),
    ))

  it('ignores section selector with pusedo selector', () =>
    run('section:first-child { width: 123px; height: 456px; }').then((result) =>
      expect(result.marpitSectionSize).toStrictEqual({}),
    ))

  context('with preferedPseudoClass', () => {
    const run = (input) =>
      postcss([sectionSize({ preferedPseudoClass: ':test' })]).process(input, {
        from: undefined,
      })

    it('prefers defined size within section selector with specific pseudo selector than plain selector', () =>
      run(
        'section:test { width: 123px; height: 123px; } section { width: 456px; height: 456px; } ',
      ).then((result) =>
        expect(result.marpitSectionSize).toStrictEqual({
          width: '123px',
          height: '123px',
        }),
      ))
  })
})
