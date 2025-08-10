# Change Log

## [Unreleased]

### Changed

- Upgrade dependent packages to the latest version ([#423](https://github.com/marp-team/marpit/pull/423))

## v3.1.3 - 2025-05-13

### Added

- Test against Node.js 24 ([#413](https://github.com/marp-team/marpit/pull/413))
- Added `print-color-adjust` property to print CSS ([#410](https://github.com/marp-team/marpit/issues/410), [#412](https://github.com/marp-team/marpit/pull/412))

### Changed

- Upgrade Node.js LTS and dependent packages to the latest version ([#413](https://github.com/marp-team/marpit/pull/413))

### Fixed

- Scaffold theme: Don't overload UA's inline margin for `<h1>` element ([#414](https://github.com/marp-team/marpit/pull/414))

## v3.1.2 - 2024-12-23

### Changed

- Upgrade Node.js LTS and dependent packages to the latest version ([#405](https://github.com/marp-team/marpit/pull/405))

## v3.1.1 - 2024-08-31

### Fixed

- Update type definition to add `cssNesting` constructor option ([#401](https://github.com/marp-team/marpit/pull/401))

## v3.1.0 - 2024-08-30

### Added

- Support for CSS nesting (`cssNesting` constructor option) ([#397](https://github.com/marp-team/marpit/issues/397), [#399](https://github.com/marp-team/marpit/pull/399))
- Allow CSS `Q` unit as slide size definitions ([#400](https://github.com/marp-team/marpit/pull/400))

### Changed

- Upgrade development Node.js and dependent packages to the latest ([#398](https://github.com/marp-team/marpit/issues/398))

## v3.0.0 - 2024-05-17

### Breaking

- Drop support against end-of-life Node.js versions (v16 and earlier) ([#291](https://github.com/marp-team/marpit/issues/291), [#380](https://github.com/marp-team/marpit/pull/380))

### Added

- Add `-webkit-text-size-adjust: 100%;` to the scaffold theme ([#389](https://github.com/marp-team/marpit/pull/389))

### Changed

- Bump markdown-it to [v14.1.0](https://github.com/markdown-it/markdown-it/blob/master/CHANGELOG.md#1410---2024-03-19), and follow the latest spec of [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/) ([#393](https://github.com/marp-team/marpit/pull/393))
- Switch package manager from yarn to npm ([#391](https://github.com/marp-team/marpit/pull/391))
- Upgrade development Node.js to v20 LTS ([#392](https://github.com/marp-team/marpit/pull/392))
- Upgrade dependent packages to the latest version ([#393](https://github.com/marp-team/marpit/pull/393))
- Migrate ESLint config to Flat config ([#394](https://github.com/marp-team/marpit/pull/394))

### Removed

- Deprecated color setting shorthand via Markdown image syntax ([#331](https://github.com/marp-team/marpit/issues/331), [#379](https://github.com/marp-team/marpit/pull/379))

## v2.6.1 - 2023-10-15

### Fixed

- Add TypeScript definition for `cssContainerQuery` constructor option ([#378](https://github.com/marp-team/marpit/pull/378))

## v2.6.0 - 2023-10-15

### Added

- `cssContainerQuery` constructor option ([#355](https://github.com/marp-team/marpit/issues/355), [#377](https://github.com/marp-team/marpit/pull/377))
- `lang` global directive and constructor option ([#376](https://github.com/marp-team/marpit/pull/376))

### Changed

- Upgrade dependent packages to the latest version ([#375](https://github.com/marp-team/marpit/pull/375))

## v2.5.3 - 2023-09-11

### Fixed

- Advanced background: Exclude Marpit reserved image keywords from `<figcaption>` correctly ([#373](https://github.com/marp-team/marpit/pull/373))

## v2.5.2 - 2023-09-11

### Fixed

- Fix blocking `paginate: skip` and `hold` in v2.5.1 inline SVG mode ([#372](https://github.com/marp-team/marpit/pull/372))

## v2.5.1 - 2023-09-09

### Added

- Advanced background: Render the image's alt text to `<figcaption>` ([#368](https://github.com/marp-team/marpit/issues/368), [#371](https://github.com/marp-team/marpit/pull/371))

### Fixed

- Begin the page number from 1 even if used `paginate: hold` at the first page ([#365](https://github.com/marp-team/marpit/issues/365), [#370](https://github.com/marp-team/marpit/pull/370))

### Changed

- Upgrade Node.js and dependent packages to the latest version ([#369](https://github.com/marp-team/marpit/pull/369))

## v2.5.0 - 2023-06-06

### Added

- `paginate: skip` and `paginate: hold` ([#218](https://github.com/marp-team/marpit/issues/218), [#359](https://github.com/marp-team/marpit/pull/359) by [@JannikWibker](https://github.com/JannikWibker))

### Changed

- Upgrade Node.js LTS and dependent packages to the latest version ([#360](https://github.com/marp-team/marpit/pull/360))
- New looks for Marpit API documentation ([#360](https://github.com/marp-team/marpit/pull/360))

## v2.4.2 - 2022-11-13

### Added

- Test against Node.js 18 LTS ([#344](https://github.com/marp-team/marpit/issues/344), [#345](https://github.com/marp-team/marpit/pull/345))

### Changed

- Upgrade dependent packages to the latest version ([#345](https://github.com/marp-team/marpit/pull/345))

## v2.4.1 - 2022-09-10

### Fixed

- Improve module interface of `@marp-team/marpit/plugin` to make compatible with CJS ([#341](https://github.com/marp-team/marpit/pull/341))

### Changed

- Upgrade dependent packages to the latest version ([#342](https://github.com/marp-team/marpit/pull/342))

### Removed

- Continuous test against EoL Node.js 12 ([#291](https://github.com/marp-team/marpit/issues/291), [#342](https://github.com/marp-team/marpit/pull/342))

## v2.4.0 - 2022-08-11

### Added

- `anchor` constructor option for slide anchor customization ([#335](https://github.com/marp-team/marpit/issues/335), [#340](https://github.com/marp-team/marpit/pull/340))

### Changed

- Upgrade dependent packages to the latest version ([#339](https://github.com/marp-team/marpit/pull/339))

## v2.3.1 - 2022-05-21

### Fixed

- Fix invalid scoping for updated `:root` selector ([#336](https://github.com/marp-team/marpit/issues/336), [#337](https://github.com/marp-team/marpit/pull/337))

## v2.3.0 - 2022-05-21

### Changed

- Upgrade dependent packages to the latest version ([#332](https://github.com/marp-team/marpit/pull/332))

### Fixed

- Match `:root` selector specificity to original exactly ([#330](https://github.com/marp-team/marpit/issues/330), [#333](https://github.com/marp-team/marpit/pull/333))

### Deprecated

- Emit deprecation warning when used color setting shorthand via Markdown image syntax ([#331](https://github.com/marp-team/marpit/issues/331), [#334](https://github.com/marp-team/marpit/pull/334))

### Removed

- Continuous test against EoL Node.js 10 ([#291](https://github.com/marp-team/marpit/issues/291), [#332](https://github.com/marp-team/marpit/pull/332))

## v2.2.4 - 2022-04-12

### Fixed

- Scoped style does not style pseudo elements `section::before` and `section::after` in advanced background ([#328](https://github.com/marp-team/marpit/issues/328), [#329](https://github.com/marp-team/marpit/pull/329))

## v2.2.3 - 2022-03-27

### Changed

- Upgrade dependent packages to the latest version ([#327](https://github.com/marp-team/marpit/pull/327))

## v2.2.2 - 2022-01-23

### Changed

- Upgrade dependent packages to the latest version ([#325](https://github.com/marp-team/marpit/pull/325))

## v2.2.1 - 2022-01-07

### Changed

- Upgrade dependent packages to the latest version ([#322](https://github.com/marp-team/marpit/pull/322))

## v2.2.0 - 2021-11-19

### Added

- [`::backdrop` pseudo-element](https://marpit.marp.app/inline-svg?id=backdrop-css-selector) matches to the container SVG when enabled inline SVG mode ([#313](https://github.com/marp-team/marpit/issues/313), [#319](https://github.com/marp-team/marpit/pull/319))
- Allow setting [the option object](https://marpit-api.marp.app/marpit#~InlineSVGOptions) to `inlineSVG` constructor option ([#319](https://github.com/marp-team/marpit/pull/319))

### Fixed

- Remove recognized image keywords from alt text ([#316](https://github.com/marp-team/marpit/issues/316), [#318](https://github.com/marp-team/marpit/pull/318))

### Changed

- Upgrade dependent packages to the latest version ([#320](https://github.com/marp-team/marpit/pull/320))

## v2.1.2 - 2021-10-26

### Changed

- Upgrade development Node to v16 LTS ([#314](https://github.com/marp-team/marpit/pull/314))
- Upgrade dependent packages to the latest version ([#315](https://github.com/marp-team/marpit/pull/315))

## v2.1.1 - 2021-08-14

### Changed

- Upgrade dependent packages to the latest version ([#308](https://github.com/marp-team/marpit/pull/308))

## v2.1.0 - 2021-07-08

### Added

- CI test against Node 16 ([#306](https://github.com/marp-team/marpit/pull/306))

### Changed

- Change how to increase specificity of `section` defined by `:root` selector ([#302](https://github.com/marp-team/marpit/pull/302))
- Upgrade dependent packages to the latest version ([#301](https://github.com/marp-team/marpit/pull/301), [#306](https://github.com/marp-team/marpit/pull/306))
- Follow the latest [CommonMark spec 0.30](https://spec.commonmark.org/0.30/) ([#306](https://github.com/marp-team/marpit/pull/306))

## v2.0.1 - 2021-04-27

### Fixed

- Fix regression: Append inline styles into the end of CSS correctly ([#288](https://github.com/marp-team/marpit/issues/288), [#289](https://github.com/marp-team/marpit/pull/289))

## v2.0.0 - 2021-03-26

### Breaking

- Marpit requires Node.js >= 10 to install ([#284](https://github.com/marp-team/marpit/pull/284))

### Fixed

- Reset CSS columns in advanced background ([#283](https://github.com/marp-team/marpit/pull/283))

### Changed

- Upgrade to PostCSS 8 ([#260](https://github.com/marp-team/marpit/issues/260), [#284](https://github.com/marp-team/marpit/pull/284))
- Upgrade Node and dependent packages to the latest version ([#285](https://github.com/marp-team/marpit/pull/285))

### Removed

- Remove deprecated `markdownItPlugins`, the getter of plugin interface for markdown-it ([#286](https://github.com/marp-team/marpit/pull/286))

## v1.6.4 - 2021-02-06

### Fixed

- Split slides only in first level rulers ([#273](https://github.com/marp-team/marpit/issues/273), [#277](https://github.com/marp-team/marpit/pull/277))
- Fix loose YAML parsing for quoted spot directive ([#278](https://github.com/marp-team/marpit/pull/278))

### Changed

- Upgrade dependent packages to the latest version ([#276](https://github.com/marp-team/marpit/pull/276))
- Rename `master` branch to `main` ([#279](https://github.com/marp-team/marpit/pull/279))

## v1.6.3 - 2020-12-05

### Added

- Node 14 support ([#267](https://github.com/marp-team/marpit/pull/267))

### Fixed

- Escape the built selector for scoping CSS ([#256](https://github.com/marp-team/marpit/pull/256))

### Changed

- Upgrade Node and dependent packages to the latest version ([#255](https://github.com/marp-team/marpit/pull/255), [#266](https://github.com/marp-team/marpit/pull/266))

## v1.6.2 - 2020-06-08

### Changed

- Upgrade dependent packages to the latest version ([#249](https://github.com/marp-team/marpit/pull/249))

## v1.6.1 - 2020-05-17

### Fixed

- Slide size defined in `:root` selector does not reflect to the theme instance ([#244](https://github.com/marp-team/marpit/issues/244), [#246](https://github.com/marp-team/marpit/pull/246))
- `:root` selector in Marpit is not following the specification of specificity ([#245](https://github.com/marp-team/marpit/issues/245), [#247](https://github.com/marp-team/marpit/pull/247))

## v1.6.0 - 2020-05-09

### Added

- Make scoped keyframe names if defined `@keyframes` in `<style scoped>` ([#231](https://github.com/marp-team/marpit/issues/231), [#237](https://github.com/marp-team/marpit/pull/237))
- Correct support of `:root` pseudo-class selector and `rem` unit for theme CSS ([#232](https://github.com/marp-team/marpit/issues/232), [#240](https://github.com/marp-team/marpit/pull/240))

### Fixed

- Disable CSS transitions and animations in the style for print ([#238](https://github.com/marp-team/marpit/issues/238), [#239](https://github.com/marp-team/marpit/pull/239))

### Changed

- Upgrade dependent packages to the latest version ([#241](https://github.com/marp-team/marpit/pull/241))
- Use ESLint recommended config instead of `eslint-config-airbnb` ([#242](https://github.com/marp-team/marpit/pull/242))

## v1.5.3 - 2020-05-04

### Fixed

- Don't prepend scoping selector into keyframes in `<style scoped>` ([#236](https://github.com/marp-team/marpit/pull/236))

### Changed

- Upgrade dependent packages to the latest version ([#234](https://github.com/marp-team/marpit/pull/234))
- Bump Node LTS version ([#234](https://github.com/marp-team/marpit/pull/234))

### Removed

- Get rid of `browser-sync` for previewing docs ([#235](https://github.com/marp-team/marpit/pull/235))

## v1.5.2 - 2020-04-18

### Changed

- Upgrade dependent packages to the latest version ([#225](https://github.com/marp-team/marpit/pull/225), [#226](https://github.com/marp-team/marpit/pull/226), [#229](https://github.com/marp-team/marpit/pull/229))

## v1.5.1 - 2020-03-15

### Changed

- On the basis of [the YAML specification](https://yaml.org/spec/1.2/spec.html#id2760395), 3 dots `...` can use as an alternative to indicate the end of YAML front-matter ([#224](https://github.com/marp-team/marpit/pull/224))
- Upgrade Node and dependent packages to the latest version ([#224](https://github.com/marp-team/marpit/pull/224))

## v1.5.0 - 2020-01-12

### Added

- `@marp-team/marpit/plugin` for creating Marpit plugin ([#214](https://github.com/marp-team/marpit/issues/214), [#217](https://github.com/marp-team/marpit/pull/217))

### Changed

- Upgrade dependent packages to the latest version ([#211](https://github.com/marp-team/marpit/pull/211), [#213](https://github.com/marp-team/marpit/pull/213), [#216](https://github.com/marp-team/marpit/pull/216), [#220](https://github.com/marp-team/marpit/pull/220))
- Bump Node LTS version ([#213](https://github.com/marp-team/marpit/pull/213), [#216](https://github.com/marp-team/marpit/pull/216), [#220](https://github.com/marp-team/marpit/pull/220))
- Update community health files ([#212](https://github.com/marp-team/marpit/pull/212))

### Removed

- CI test against EOL Node 8 ([#216](https://github.com/marp-team/marpit/pull/216))
- `Marpit` prefixes in the name of some type definitions for TypeScript ([#217](https://github.com/marp-team/marpit/pull/217))

## v1.4.2 - 2019-11-06

### Fixed

- Apply workaround for glitched video control on Chromium ([#205](https://github.com/marp-team/marpit/issues/205), [#208](https://github.com/marp-team/marpit/pull/208))

### Changed

- Upgrade Node for development to v12 LTS ([#202](https://github.com/marp-team/marpit/pull/202))
- Upgrade dependent packages to the latest version ([#207](https://github.com/marp-team/marpit/pull/207))

## v1.4.1 - 2019-10-18

### Changed

- Ignore well-known magic comments in collected comments ([#191](https://github.com/marp-team/marpit/issues/191), [#199](https://github.com/marp-team/marpit/pull/199))
- Upgrade dependent packages to the latest version ([#196](https://github.com/marp-team/marpit/pull/196), [#201](https://github.com/marp-team/marpit/pull/201))

## v1.4.0 - 2019-09-12

### Changed

- Update CircleCI configuration to use v2.1 ([#187](https://github.com/marp-team/marpit/pull/187))
- Bump markdown-it to [v10.0.0](https://github.com/markdown-it/markdown-it/blob/master/CHANGELOG.md#1000---2019-09-11) ([#190](https://github.com/marp-team/marpit/pull/190))
- Upgrade Node and dependent packages to the latest version ([#190](https://github.com/marp-team/marpit/pull/190))

### Removed

- Deprecated dollar prefix alias for global directive ([#182](https://github.com/marp-team/marpit/issues/182), [#189](https://github.com/marp-team/marpit/pull/189))

## v1.3.2 - 2019-08-23

### Fixed

- Override declaration of `<section>` for advanced background to `display: block` ([#185](https://github.com/marp-team/marpit/pull/185))

### Changed

- Upgrade dependent packages to the latest version ([#186](https://github.com/marp-team/marpit/pull/186))

## v1.3.1 - 2019-08-11

### Added

- Documentation of [custom directives](https://marpit.marp.app/directives?id=custom-directives) ([#183](https://github.com/marp-team/marpit/pull/183))

### Changed

- Allow aliasing from custom directive to built-in directives ([#183](https://github.com/marp-team/marpit/pull/183))
- Upgrade dependent packages to the latest version ([#184](https://github.com/marp-team/marpit/pull/184))

### Deprecated

- Dollar prefix for global directive ([#182](https://github.com/marp-team/marpit/issues/182), [#183](https://github.com/marp-team/marpit/pull/183))

## v1.3.0 - 2019-07-11

### Added

- Loose YAML parsing for custom directives ([#173](https://github.com/marp-team/marpit/pull/173))

### Changed

- Follow the latest spec of [CommonMark 0.29](https://spec.commonmark.org/0.29/) by upgraded markdown-it v9 ([#174](https://github.com/marp-team/marpit/pull/174))
- Allow customization the content of pagination ([#175](https://github.com/marp-team/marpit/pull/175))
- Upgrade dependent packages to the latest version ([#176](https://github.com/marp-team/marpit/pull/176))

### Removed

- Remove deprecated dot notation support for meta in `ThemeSet#getThemeProp` ([#177](https://github.com/marp-team/marpit/pull/177))

## v1.2.0 - 2019-06-17

### Added

- Add [`metaType` property for `ThemeSet` class](https://marpit-api.netlify.com/themeset#metaType) to make definable array type for theme metadata ([#170](https://github.com/marp-team/marpit/issues/170), [#171](https://github.com/marp-team/marpit/pull/171))
- [`ThemeSet#getThemeMeta`](https://marpit-api.netlify.com/themeset#getThemeMeta) to get correct meta value with array support ([#171](https://github.com/marp-team/marpit/pull/171))

### Fixed

- Finalize token to replace imprimitive attribute string ([#169](https://github.com/marp-team/marpit/pull/169))

### Changed

- Upgrade Node and dependent packages to the latest version ([#172](https://github.com/marp-team/marpit/pull/172))

### Deprecated

- Dot notation path for meta property in [`ThemeSet#getThemeProp`](https://marpit-api.netlify.com/themeset#getThemeProp) is deprecated in favor of using added `ThemeSet#getThemeMeta` ([#171](https://github.com/marp-team/marpit/pull/171))

## v1.1.0 - 2019-06-03

### Added

- Allow passing markdown-it instance as `markdown` constructor option ([#164](https://github.com/marp-team/marpit/pull/164))
- Add size argument for split background ([#166](https://github.com/marp-team/marpit/issues/166), [#168](https://github.com/marp-team/marpit/pull/168))

### Fixed

- Fix color shorthand detection to use the value before of validation ([#165](https://github.com/marp-team/marpit/pull/165))

### Changed

- Upgrade dependent packages to the latest version ([#167](https://github.com/marp-team/marpit/pull/167))

### Deprecated

- A plugin interface for markdown-it (`markdownItPlugins`) is deprecated ([#164](https://github.com/marp-team/marpit/pull/164))

## v1.0.0 - 2019-05-05

### Breaking

- Marpit requires Node >= 8.

### Added

- Add [shorthand for setting text color via image syntax](https://marpit.marp.app/image-syntax?id=shorthand-for-setting-colors) ([#154](https://github.com/marp-team/marpit/issues/154), [#159](https://github.com/marp-team/marpit/pull/159))
- Add [documentation of fragmented list](https://marpit.marp.app/fragmented-list) ([#152](https://github.com/marp-team/marpit/pull/152))
- Test with Node 12 (Erbium) ([#160](https://github.com/marp-team/marpit/pull/160))
- Automate GitHub release ([#161](https://github.com/marp-team/marpit/pull/161))

### Changed

- Use browser-sync instead of docsify-cli to serve docs on local ([#157](https://github.com/marp-team/marpit/pull/157))
- Upgrade dependent packages to the latest version ([#158](https://github.com/marp-team/marpit/pull/158))
- Swap Sass compiler for document from node-sass to Dart Sass ([#158](https://github.com/marp-team/marpit/pull/158))

### Removed

- Drop support for Node 6.x ([#139](https://github.com/marp-team/marpit/issues/139), [#155](https://github.com/marp-team/marpit/pull/155))
- Remove deprecated constructor options: `backgroundSyntax`, `filters`, `inlineStyle`, and `scopedStyle` ([#156](https://github.com/marp-team/marpit/pull/156))

## v0.9.2 - 2019-04-08

### Fixed

- Update slide plugin and heading divider plugin to apply the correct mapped line of slides ([#151](https://github.com/marp-team/marpit/pull/151))

## v0.9.1 - 2019-04-05

### Added

- Allow parsing hyphen and underscore in theme meta ([#150](https://github.com/marp-team/marpit/pull/150))
- Support getting nested prop by `ThemeSet#getThemeProp` ([#150](https://github.com/marp-team/marpit/pull/150))

## v0.9.0 - 2019-04-03

### Added

- Parse lists in `*` and `1)` marker as fragmented list ([#145](https://github.com/marp-team/marpit/issues/145), [#148](https://github.com/marp-team/marpit/pull/148))

### Changed

- Upgrade dependent packages to the latest version ([#143](https://github.com/marp-team/marpit/pull/143), [#149](https://github.com/marp-team/marpit/pull/149))
- Simplify Marpit plugins by using injected instance into markdown-it instance ([#147](https://github.com/marp-team/marpit/pull/147))

### Deprecated

- Mark unused constructor options as deprecated: `backgroundSyntax`, `filters`, `inlineStyle`, and `scopedStyle` ([#144](https://github.com/marp-team/marpit/pull/144))

### Removed

- Enhanced plugin system ([#146](https://github.com/marp-team/marpit/pull/146))

## v0.8.0 - 2019-03-13

### Added

- Direction keyword for advanced background ([#138](https://github.com/marp-team/marpit/pull/138))

### Changed

- Upgrade Node and dependent packages to the latest version ([#140](https://github.com/marp-team/marpit/pull/140))

## v0.7.2 - 2019-02-13

### Fixed

- Use re-exported markdown-it Token from state ([#132](https://github.com/marp-team/marpit/pull/132))
- Fix broken emoji on docs ([#134](https://github.com/marp-team/marpit/pull/134))

### Changed

- Upgrade dependent packages to the latest version ([#133](https://github.com/marp-team/marpit/pull/133))

## v0.7.1 - 2019-02-04

### Fixed

- Fix type definition of custom directive parser to allow array and object ([#130](https://github.com/marp-team/marpit/pull/130))

### Changed

- Upgrade Node and dependent packages to the latest version ([#131](https://github.com/marp-team/marpit/pull/131))

## v0.7.0 - 2019-01-30

### Added

- Make custom directives definable via `customDirectives` member ([#124](https://github.com/marp-team/marpit/issues/124), [#125](https://github.com/marp-team/marpit/pull/125), [#128](https://github.com/marp-team/marpit/pull/128))
- Enhance plugin system to control Marpit features ([#127](https://github.com/marp-team/marpit/pull/127))

### Changed

- Update printable plugin to use [CSS Fragmentation](https://drafts.csswg.org/css-break-3/) to control page break ([#126](https://github.com/marp-team/marpit/pull/126))
- Upgrade dependent packages to latest version ([#129](https://github.com/marp-team/marpit/pull/129))

## v0.6.1 - 2019-01-25

### Fixed

- Include inline SVG elements when rendered with `htmlAsArray` env ([#123](https://github.com/marp-team/marpit/pull/123))

### Changed

- Small update for README and docs ([#122](https://github.com/marp-team/marpit/pull/122))

## v0.6.0 - 2019-01-19

### Added

- Add `env` argument to [`Marpit.render()`](https://marpit-api.marp.app/marpit#render) ([#118](https://github.com/marp-team/marpit/pull/118))
- Output HTML per slide page as array by passing `htmlAsArray` env ([#112](https://github.com/marp-team/marpit/issues/112), [#119](https://github.com/marp-team/marpit/pull/119))
- Update docs to explain SVG slide polyfill ([#117](https://github.com/marp-team/marpit/pull/117))
- Update docs to explain usage of plugin ([#120](https://github.com/marp-team/marpit/pull/120))

### Changed

- Upgrade dependent packages to latest version ([#121](https://github.com/marp-team/marpit/pull/121))

## v0.5.0 - 2018-12-28

### Added

- Support setting background color by Markdown image syntax ([#92](https://github.com/marp-team/marpit/issues/92), [#113](https://github.com/marp-team/marpit/pull/113))
- Add `data-marpit-svg` attribute to SVG element outputted by inline SVG mode ([#115](https://github.com/marp-team/marpit/pull/115))

### Fixed

- Fix remaining orphan break by sweeping hidden inline token forcibly ([#114](https://github.com/marp-team/marpit/pull/114))

### Changed

- Upgrade Node and dependent packages to latest version ([#116](https://github.com/marp-team/marpit/pull/116))

## v0.4.1 - 2018-12-18

### Fixed

- Prevent leaking header and footer when printing by added normalization of HTML background ([#108](https://github.com/marp-team/marpit/pull/108), [#109](https://github.com/marp-team/marpit/pull/109))
- Fix the version badge in docs sidebar ([#110](https://github.com/marp-team/marpit/pull/110))

### Changed

- Upgrade Node and dependent packages to latest version ([#111](https://github.com/marp-team/marpit/pull/111))

## v0.4.0 - 2018-12-02

### Added

- Add `use` method to extend markdown-it parser by plugin ([#105](https://github.com/marp-team/marpit/pull/105))

### Changed

- Upgrade dependent packages to latest version ([#106](https://github.com/marp-team/marpit/pull/106))

## v0.3.3 - 2018-11-30

### Fixed

- Revert resolutions for `ajv` ([#102](https://github.com/marp-team/marpit/pull/102))
- Fix over-scoped selectors injected by printable plugin ([#104](https://github.com/marp-team/marpit/pull/104))

### Added

- Run `yarn audit` while running CI / publish processes ([#103](https://github.com/marp-team/marpit/pull/103))

## v0.3.2 - 2018-11-29

### Fixed

- Disable CSS scoping into declarations within `@keyframes` at-rule ([#97](https://github.com/marp-team/marpit/issues/97), [#99](https://github.com/marp-team/marpit/pull/99))

### Changed

- Disable styling `html` and `body` elements through theme CSS ([#98](https://github.com/marp-team/marpit/issues/98), [#100](https://github.com/marp-team/marpit/pull/100))
- Upgrade dependent packages to latest version ([#101](https://github.com/marp-team/marpit/pull/101))

## v0.3.1 - 2018-11-24

### Security

- Upgrade dependent packages to prevent the malicious attack in dependencies ([#96](https://github.com/marp-team/marpit/pull/96))

## v0.3.0 - 2018-11-14

### Breaking

- No longer work with Node v6.14.2 and v6.14.3 ([#93](https://github.com/marp-team/marpit/pull/93))

### Added

- Add docsify style and its build script ([#91](https://github.com/marp-team/marpit/issues/91), [#93](https://github.com/marp-team/marpit/pull/93))
- Support the scoped inline style through `<style scoped>` ([#85](https://github.com/marp-team/marpit/issues/85), [#94](https://github.com/marp-team/marpit/pull/94))

### Changed

- Upgrade dependent packages to latest version ([#95](https://github.com/marp-team/marpit/pull/95))

## v0.2.1 - 2018-11-05

### Changed

- Support Node 10.x and use its LTS for development ([#84](https://github.com/marp-team/marpit/pull/84), [#88](https://github.com/marp-team/marpit/pull/88))
- Upgrade dependent packages to latest version ([#90](https://github.com/marp-team/marpit/pull/90))

### Fixed

- Fix docs to work docsify scripts correctly ([#89](https://github.com/marp-team/marpit/pull/89))

### Removed

- Remove `defer` attribute from `<inline>` script tag on docs ([#87](https://github.com/marp-team/marpit/pull/87))

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
- Upgrade Node LTS and dependent packages ([#70](https://github.com/marp-team/marpit/pull/70))

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
- Upgrade Node LTS and dependent packages ([#55](https://github.com/marp-team/marpit/pull/55))

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

- Upgrade Node LTS and dependent packages ([#42](https://github.com/marp-team/marpit/pull/42))

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
