<p align="center">
  <img src="docs/marpit.png#gh-light-mode-only" alt="Marpit" width="500" />
  <img src="docs/marpit-dark.png#gh-dark-mode-only" alt="Marpit" width="500" />
</p>
<p align="center">
  <strong>Marpit</strong>: Markdown slide deck framework
</p>
<p align="center">
  <a href="https://circleci.com/gh/marp-team/marpit/"><img src="https://img.shields.io/circleci/project/github/marp-team/marpit/main.svg?style=flat-square&logo=circleci" alt="CircleCI" /></a>
  <a href="https://codecov.io/gh/marp-team/marpit"><img src="https://img.shields.io/codecov/c/github/marp-team/marpit/main.svg?style=flat-square&logo=codecov" alt="Codecov" /></a>
  <a href="https://www.npmjs.com/package/@marp-team/marpit"><img src="https://img.shields.io/npm/v/@marp-team/marpit.svg?style=flat-square&logo=npm" alt="npm" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/marp-team/marpit.svg?style=flat-square" alt="LICENSE" /></a>
</p>

<div align="center">

### [🗒 Documentation](https://marpit.marp.app/) | [⚙ API](https://marpit-api.marp.app/)

</div>

---

**Marpit** /mɑːrpɪt/ is the skinny framework for creating slide deck from Markdown. It can transform Markdown and CSS theme(s) to slide deck composed of static HTML and CSS and create a web page convertible into slide PDF by printing.

Marpit is designed to _output minimum assets for the slide deck_. You can use the bare assets as a logicless slide deck, but mainly we expect to integrate output with other tools and applications.

In fact, this framework is created for using as the base of [a core converter][marp-core] in [Marp ecosystem][marp].

[marp]: https://github.com/marp-team/marp/
[marp-core]: https://github.com/marp-team/marp-core/

## Features

### [:pencil: **Marpit Markdown**](https://marpit.marp.app/markdown)

We have extended several features into [markdown-it](https://github.com/markdown-it/markdown-it) parser to support writing awesome slides, such as [_Directives_](https://marpit.marp.app/directives) and [_Slide backgrounds_](https://marpit.marp.app/image-syntax?id=slide-backgrounds). Additional syntaxes place importance on a compatibility with general Markdown documents.

### [:art: **Theme CSS by clean markup**](https://marpit.marp.app/theme-css)

Marpit has the CSS theming system that can design slides everything. Unlike other slide frameworks, there are not any predefined classes and mixins. You have only to focus styling HTML elements by pure CSS. Marpit would take care of the selected theme's necessary conversion.

### [:triangular_ruler: **Inline SVG slide**](https://marpit.marp.app/inline-svg) _(Experimental)_

Optionally `<svg>` element can use as the container of each slide page. It can be realized the pixel-perfect scaling of the slide only by CSS, so handling slides in integrated apps become simplified. The isolated layer made by `<foreignObject>` can provide [_advanced backgrounds_](https://marpit.marp.app/image-syntax?id=advanced-backgrounds) for the slide with keeping the original Markdown DOM structure.

> We not provide any themes because Marpit is just a framework. You can use [@marp-team/marp-core][marp-core] if you want. It has the official themes, and practical features extended from Marpit.

## Getting started

See [the documentation of Marpit](https://marpit.marp.app/?id=getting-started) to get started.

- **[Documentation](https://marpit.marp.app/)**
- [API (JSDoc)](https://marpit-api.marp.app/)

## Contributing

Are you interested in contributing? See [CONTRIBUTING.md](.github/CONTRIBUTING.md) and [the common contributing guideline for Marp team](https://github.com/marp-team/.github/blob/master/CONTRIBUTING.md).

### Development

```bash
git clone https://github.com/marp-team/marpit
cd marpit

npm install
npm run build
```

## Sub-projects

- **[@marp-team/marpit-svg-polyfill](https://github.com/marp-team/marpit-svg-polyfill)** - A polyfill of the inline SVG slide in Safari based browsers.

## Author

Managed by [@marp-team](https://github.com/marp-team).

- <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

This framework releases under the [MIT License](LICENSE).
