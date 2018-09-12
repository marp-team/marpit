<p align="center">
  <a href="https://marpit.marp.app"><img src="https://github.com/marp-team/marpit/blob/master/docs/marpit.png?raw=true" alt="Marpit" width="500" /></a>
</p>
<p align="center">
  <strong>Marpit</strong>: Markdown slide deck framework
</p>
<p align="center">
  <a href="https://circleci.com/gh/marp-team/marpit/"><img src="https://img.shields.io/circleci/project/github/marp-team/marpit/master.svg?style=flat-square" alt="CircleCI" /></a>
  <a href="https://codecov.io/gh/marp-team/marpit"><img src="https://img.shields.io/codecov/c/github/marp-team/marpit/master.svg?style=flat-square" alt="Codecov" /></a>
  <a href="https://www.npmjs.com/package/@marp-team/marpit"><img src="https://img.shields.io/npm/v/@marp-team/marpit.svg?style=flat-square" alt="npm" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/marp-team/marpit.svg?style=flat-square" alt="LICENSE" /></a>
</p>

---

**Marpit** /mɑːrpɪt/ is the skinny framework for creating slide deck from Markdown. It can transform Markdown and CSS theme(s) to slide deck composed of static HTML and CSS and create a web page convertible into slide PDF by printing.

Marpit is designed to _output minimum assets for the slide deck_. You can use the bare assets as a logicless slide deck, but mainly we expect to integrate output with other tools and applications.

This framework is actually created for use as [a core][marp-core] of the next version of [Marp](https://github.com/yhatt/marp/).

[marp-core]: https://github.com/marp-team/marp-core/

## Features

### [:pencil: **Marpit Markdown**](https://marpit.marp.app/markdown)

We have extended several features into [markdown-it](https://github.com/markdown-it/markdown-it) parser to support writing awesome slides, such as [_Directives_](https://marpit.marp.app/directives) and [_Slide backgrounds_](https://marpit.marp.app/image-syntax#slide-backgrounds). Additional syntaxes place importance on a compatibility with general Markdown documents.

### [:art: **Theme CSS by clean markup**](https://marpit.marp.app/theme-css)

Marpit has the CSS theming system that can design slides everything. Unlike other slide frameworks, there are not any predefined classes and mixins. You have only to focus styling HTML elements by pure CSS. Marpit would take care of the selected theme's necessary conversion.

### [:triangular_ruler: **Inline SVG slide**](https://marpit.marp.app/inline-svg) <i>(Experimental)</i>

Optionally `<svg>` element can use as the container of each slide page. It can be realized the pixel-perfect scaling of the slide only by CSS, so handling slides in integrated apps become simplified. The isolated layer made by `<foreignObject>` can provide [_advanced backgrounds_](https://marpit.marp.app/image-syntax#advanced-backgrounds) for the slide with keeping the original Markdown DOM structure.

> :information_source: We not provide any themes because Marpit is just a framework. You can use [@marp-team/marp-core][marp-core] if you want. It has the official themes, and practical features extended from Marpit.

## Getting started

See [the documentation of Marpit](https://marpit.marp.app/?id=getting-started) to get started.

- **[Documentation](https://marpit.marp.app/)**
- [API (JSDoc)](https://marpit-api.marp.app/)

## Development

Under construction.

### Contributing

We are sorry but currently we are not ready to accept your contribute...

## Author

Managed by [@marp-team](https://github.com/marp-team).

- <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

[MIT License](LICENSE)
