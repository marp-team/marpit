# Change Log

## [Unreleased]

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
