# Change Log

## [Unreleased]

### Changed

- Support Node 10.x and use it for development ([#84](https://github.com/marp-team/marpit/pull/84))

## v0.2.0 - 2018-10-10

### Added

- Collect HTML comments per page to be usable as presenter note ([#82](https://github.com/marp-team/marpit/issues/82), [#83](https://github.com/marp-team/marpit/pull/83))

### Changed

- Update license author to marp-team ([#81](https://github.com/marp-team/marpit/pull/81))

## v0.1.3 - 2018-10-05

### Fixed

- Improve conversion performance by using `for-of` loop (40-70% faster) ([#79](https://github.com/marp-team/marpit/pull/79))

### Changed

- Upgrade dependent packages to latest version ([#80](https://github.com/marp-team/marpit/pull/80))

## v0.1.2 - 2018-09-20

### Fixed

- Fix to parse metadata of theme within important comments ([#74](https://github.com/marp-team/marpit/pull/74), [#76](https://github.com/marp-team/marpit/pull/76))
- Update [documentation of customized theme](https://marpit.marp.app/theme-css?id=customized-theme) to apply changed behavior on v0.1.1 ([#75](https://github.com/marp-team/marpit/pull/75), [#77](https://github.com/marp-team/marpit/pull/77))

### Changed

- Upgrade devDependencies to latest version ([#78](https://github.com/marp-team/marpit/pull/78))

## v0.1.1 - 2018-09-18

### Fixed

- Fix that `before` option of `ThemeSet.pack` breaks importing another theme ([#71](https://github.com/marp-team/marpit/pull/71), [#72](https://github.com/marp-team/marpit/pull/72))

## v0.1.0 - 2018-09-14

### Breaking

- Rename `lazyYAML` constructor option into `looseYAML` ([#68](https://github.com/marp-team/marpit/pull/68))

### Added

- Add [CONTRIBUTING.md](.github/CONTRIBUTING.md) ([#69](https://github.com/marp-team/marpit/pull/69))

### Changed

- Move documentation from README.md to [https://marpit.marp.app/](https://marpit.marp.app/) ([#67](https://github.com/marp-team/marpit/pull/67))
- Upgrade Node LTS and depenent packages ([#70](https://github.com/marp-team/marpit/pull/70))

---

<details><summary>History of pre-release versions</summary>

## v0.0.15 - 2018-09-06

### Fixed

- Improve rendering header and footer to use inline tokens ([#66](https://github.com/marp-team/marpit/pull/66))

## v0.0.14 - 2018-09-02

### Added

- Support image resizing with `width` and `height` keyword ([#62](https://github.com/marp-team/marpit/pull/62))
- Add document page on [https://marpit.marp.app/](https://marpit.marp.app/) ([#60](https://github.com/marp-team/marpit/pull/60), [#61](https://github.com/marp-team/marpit/pull/61), [#63](https://github.com/marp-team/marpit/pull/63))

### Changed

- Upgrade Babel to 7 stable ([#64](https://github.com/marp-team/marpit/pull/64))
- Update Marpit API URL to use own domains ([#59](https://github.com/marp-team/marpit/pull/59))

## v0.0.13 - 2018-08-27

### Added

- Support CSS scoping by element id ([#57](https://github.com/marp-team/marpit/pull/57))

### Fixed

- Improve type definition about slide containers, theme metas, and internal variables ([#56](https://github.com/marp-team/marpit/pull/56), [#58](https://github.com/marp-team/marpit/pull/58))

## v0.0.12 - 2018-08-18

### Removed

- Remove Unicode Emoji support due to many issues on stable Chrome ([#53](https://github.com/marp-team/marpit/pull/53))

### Changed

- Improve lazy YAML parsing to apply in defined directives only ([#54](https://github.com/marp-team/marpit/pull/54))
- Upgrade Node LTS and depenent packages ([#55](https://github.com/marp-team/marpit/pull/55))

## v0.0.11 - 2018-08-12

### Added

- Lazy yaml support by `lazyYAML` option ([#49](https://github.com/marp-team/marpit/pull/49))
- Support `class` directive defined by array ([#51](https://github.com/marp-team/marpit/pull/51))
- Parse inline comment ([#52](https://github.com/marp-team/marpit/pull/52))

### Fixed

- Bugfix: Pass `class` attribute to pseudo section on advanced background ([#48](https://github.com/marp-team/marpit/pull/48))

### Changed

- Migrate coverage report service from [Coveralls](https://coveralls.io/github/marp-team/marpit?branch=master) to [Codecov](https://codecov.io/gh/marp-team/marpit) ([#50](https://github.com/marp-team/marpit/pull/50))

## v0.0.10 - 2018-08-05

### Breaking

- Improve appending/prepending style on `ThemeSet#pack` ([`appendStyle` option](https://github.com/marp-team/marpit/blob/c1fce7c7f80fb563111b8b0e34d98eabc5c834a3/src/theme_set.js#L171) is renamed to [`after`](https://github.com/marp-team/marpit/blob/e68f0bb38a6d894cce80fa811d41952635a886b6/src/theme_set.js#L172)) ([#47](https://github.com/marp-team/marpit/pull/47))

### Changed

- Mark Marpit's `options` property as immutable ([#46](https://github.com/marp-team/marpit/pull/46))
- Migrate test framework from mocha to jest ([#43](https://github.com/marp-team/marpit/pull/43))
- Migrate CI from Travis CI to CircleCI ([#44](https://github.com/marp-team/marpit/pull/44))

## v0.0.9 - 2018-07-23

### Added

- Add the basic TypeScript definition ([#40](https://github.com/marp-team/marpit/pull/40))
- Support heading divider ([#41](https://github.com/marp-team/marpit/pull/41))

### Changed

- Upgrade Node LTS and depenent packages ([#42](https://github.com/marp-team/marpit/pull/42))

## v0.0.8 - 2018-06-28

### Added

- Support Unicode 11.0 emoji ([#39](https://github.com/marp-team/marpit/pull/39))

### Fixed

- Apply `color` style to pseudo layer of advanced backgrounds ([#37](https://github.com/marp-team/marpit/pull/37))
- Fix JSDoc: Missing `color` prop in the definition of local directives ([#38](https://github.com/marp-team/marpit/pull/38))

## v0.0.7 - 2018-06-04

### Added

- Support `backgroundColor` and `color` local directives ([#32](https://github.com/marp-team/marpit/pull/32))

### Fixed

- Suppress confusable theme import when tweaking ([#33](https://github.com/marp-team/marpit/pull/33))

### Removed

- Remove `workaround` flag support from Marpit's `inlineSVG` option ([#35](https://github.com/marp-team/marpit/pull/35))

## v0.0.6 - 2018-05-29

### Added

- Add `header` and `footer` directives ([#22](https://github.com/marp-team/marpit/pull/22))
- Support importing other theme CSS with `@import` (or `@import-theme`) ([#24](https://github.com/marp-team/marpit/pull/24))
- Support tweaking theme style through `<style>` element or `style` global directive ([#25](https://github.com/marp-team/marpit/pull/25))
- Add PostCSS import rollup plugin to work `@charset` and `@import` at-rules correctly ([#26](https://github.com/marp-team/marpit/pull/26))

### Fixed

- Fix over-stripped comments in the inline code ([#28](https://github.com/marp-team/marpit/pull/28))
- Hide `section::after` pseudo-element without pagination ([#29](https://github.com/marp-team/marpit/pull/29))

### Changed

- Change role of pagination layer to pseudo layer on advanced background ([#27](https://github.com/marp-team/marpit/pull/27))

## v0.0.5 - 2018-05-12

### Added

- Add `paginate` local directive ([#17](https://github.com/marp-team/marpit/pull/17))
- Make Unicode emoji printable ([#18](https://github.com/marp-team/marpit/pull/18))

### Security

- Prevent style injections ([#19](https://github.com/marp-team/marpit/pull/19))

## v0.0.4 - 2018-05-05

### Added

- Implement CSS filter for image and advanced backgrounds ([#14](https://github.com/marp-team/marpit/pull/14))
- Implement split backgrounds in advanced background mode ([#16](https://github.com/marp-team/marpit/pull/16))

### Fixed

- Fix PostCSS printable plugin to allow printing the advanced backgrounds ([#15](https://github.com/marp-team/marpit/pull/15))

## v0.0.3 - 2018-05-02

### Added

- Implement background image resizing with keyword and scale ([#10](https://github.com/marp-team/marpit/pull/10))
- Support advanced background mode with inline SVG, for multiple images and filters ([#11](https://github.com/marp-team/marpit/pull/11))
- Update docs about background images ([#13](https://github.com/marp-team/marpit/pull/13))

### Changed

- Upgrade node to the latest LTS version v8.11.1 ([#12](https://github.com/marp-team/marpit/pull/12))

## v0.0.2 - 2018-04-28

### Added

- Support background image syntax ([#4](https://github.com/marp-team/marpit/pull/4), [#5](https://github.com/marp-team/marpit/pull/5), and [#8](https://github.com/marp-team/marpit/pull/8))
- Add [JSDoc documentation to `ThemeSet` class methods](https://marpit-api.marp.app/themeset) ([#7](https://github.com/marp-team/marpit/pull/7))

### Changed

- Improve the sweep logic of blank paragraphs by split into another plugin ([#8](https://github.com/marp-team/marpit/pull/8))

## v0.0.1 - 2018-03-28

### Added

- Add JSDoc about `Marpit` class

### Changed

- Optional inline SVG workaround ([#1](https://github.com/marp-team/marpit/pull/1))
- Split the injection of markdown-it plugins and provide interface of markdown-it plugin ([#2](https://github.com/marp-team/marpit/pull/2))
- Split rendering style into `Marpit#renderStyle` ([#3](https://github.com/marp-team/marpit/pull/3))

## v0.0.0 - 2018-03-24

- Initial release. It does not cover integration test and document fully.

</details>
