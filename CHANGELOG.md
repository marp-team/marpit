# Change Log

## [Unreleased]

- Improve type definition about slide containers, theme metas, and internal variables ([#56](https://github.com/marp-team/marpit/pull/56), [#58](https://github.com/marp-team/marpit/pull/58))
- Support CSS scoping by element id ([#57](https://github.com/marp-team/marpit/pull/57))

## v0.0.12 - 2018-08-18

- Remove Unicode Emoji support due to many issues on stable Chrome ([#53](https://github.com/marp-team/marpit/pull/53))
- Improve lazy YAML parsing to apply in defined directives only ([#54](https://github.com/marp-team/marpit/pull/54))
- Upgrade Node LTS and depenent packages ([#55](https://github.com/marp-team/marpit/pull/55))

## v0.0.11 - 2018-08-12

- Bugfix: Pass `class` attribute to pseudo section on advanced background ([#48](https://github.com/marp-team/marpit/pull/48))
- Lazy yaml support by `lazyYAML` option ([#49](https://github.com/marp-team/marpit/pull/49))
- Migrate coverage report service from [Coveralls](https://coveralls.io/github/marp-team/marpit?branch=master) to [Codecov](https://codecov.io/gh/marp-team/marpit) ([#50](https://github.com/marp-team/marpit/pull/50))
- Support `class` directive defined by array ([#51](https://github.com/marp-team/marpit/pull/51))
- Parse inline comment ([#52](https://github.com/marp-team/marpit/pull/52))

## v0.0.10 - 2018-08-05

- **[BREAKING]** Improve appending/prepending style on `ThemeSet#pack` ([#47](https://github.com/marp-team/marpit/pull/47))
  - `ThemeSet#pack`'s [`appendStyle` option](https://github.com/marp-team/marpit/blob/c1fce7c7f80fb563111b8b0e34d98eabc5c834a3/src/theme_set.js#L171) is renamed to [`after`](https://github.com/marp-team/marpit/blob/e68f0bb38a6d894cce80fa811d41952635a886b6/src/theme_set.js#L172).
- Migrate test framework from mocha to jest ([#43](https://github.com/marp-team/marpit/pull/43))
- Migrate CI from Travis CI to CircleCI ([#44](https://github.com/marp-team/marpit/pull/44))
- Mark Marpit's `options` property as immutable ([#46](https://github.com/marp-team/marpit/pull/46))

## v0.0.9 - 2018-07-23

- Add the basic TypeScript definition ([#40](https://github.com/marp-team/marpit/pull/40))
- Support heading divider ([#41](https://github.com/marp-team/marpit/pull/41))
- Upgrade Node LTS and depenent packages ([#42](https://github.com/marp-team/marpit/pull/42))

## v0.0.8 - 2018-06-28

- Apply `color` style to pseudo layer of advanced backgrounds ([#37](https://github.com/marp-team/marpit/pull/37))
- Fix JSDoc: Missing `color` prop in the definition of local directives ([#38](https://github.com/marp-team/marpit/pull/38))
- Support Unicode 11.0 emoji ([#39](https://github.com/marp-team/marpit/pull/39))

## v0.0.7 - 2018-06-04

- Support `backgroundColor` and `color` local directives ([#32](https://github.com/marp-team/marpit/pull/32))
- Suppress confusable theme import when tweaking ([#33](https://github.com/marp-team/marpit/pull/33))
- Remove `workaround` flag support from Marpit's `inlineSVG` option ([#35](https://github.com/marp-team/marpit/pull/35))

## v0.0.6 - 2018-05-29

- Add `header` and `footer` directives ([#22](https://github.com/marp-team/marpit/pull/22))
- Support importing other theme CSS with `@import` (or `@import-theme`) ([#24](https://github.com/marp-team/marpit/pull/24))
- Support tweaking theme style through `<style>` element or `style` global directive ([#25](https://github.com/marp-team/marpit/pull/25))
- Add PostCSS import rollup plugin to work `@charset` and `@import` at-rules correctly ([#26](https://github.com/marp-team/marpit/pull/26))
- Change role of pagination layer to pseudo layer on advanced background ([#27](https://github.com/marp-team/marpit/pull/27))
- Fix over-stripped comments in the inline code ([#28](https://github.com/marp-team/marpit/pull/28))
- Hide `section::after` pseudo-element without pagination ([#29](https://github.com/marp-team/marpit/pull/29))

## v0.0.5 - 2018-05-12

- Add `paginate` local directive ([#17](https://github.com/marp-team/marpit/pull/17))
- Make Unicode emoji printable ([#18](https://github.com/marp-team/marpit/pull/18))
- Prevent style injections ([#19](https://github.com/marp-team/marpit/pull/19))

## v0.0.4 - 2018-05-05

- Implement CSS filter for image and advanced backgrounds ([#14](https://github.com/marp-team/marpit/pull/14))
- Fix PostCSS printable plugin to allow printing the advanced backgrounds ([#15](https://github.com/marp-team/marpit/pull/15))
- Implement split backgrounds in advanced background mode ([#16](https://github.com/marp-team/marpit/pull/16))

## v0.0.3 - 2018-05-02

- Implement background image resizing with keyword and scale ([#10](https://github.com/marp-team/marpit/pull/10))
- Support advanced background mode with inline SVG, for multiple images and filters ([#11](https://github.com/marp-team/marpit/pull/11))
- Upgrade node to the latest LTS version v8.11.1 ([#12](https://github.com/marp-team/marpit/pull/12))
- Update docs about background images ([#13](https://github.com/marp-team/marpit/pull/13))

## v0.0.2 - 2018-04-28

- Support background image syntax ([#4](https://github.com/marp-team/marpit/pull/4), [#5](https://github.com/marp-team/marpit/pull/5), and [#8](https://github.com/marp-team/marpit/pull/8))
- Add [JSDoc documentation to `ThemeSet` class methods](https://marpit.netlify.com/themeset) ([#7](https://github.com/marp-team/marpit/pull/7))
- Improve the sweep logic of blank paragraphs by split into another plugin ([#8](https://github.com/marp-team/marpit/pull/8))

## v0.0.1 - 2018-03-28

- Optional inline SVG workaround ([#1](https://github.com/marp-team/marpit/pull/1))
- Split the injection of markdown-it plugins and provide interface of markdown-it plugin ([#2](https://github.com/marp-team/marpit/pull/2))
- Split rendering style into Marpit#renderStyle ([#3](https://github.com/marp-team/marpit/pull/3))
- Add JSDoc about `Marpit` class

## v0.0.0 - 2018-03-24

- Initial release. It does not cover integration test and document fully.
