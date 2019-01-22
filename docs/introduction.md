[marp]: https://github.com/marp-team/marp/
[marp-core]: https://github.com/marp-team/marp-core

<p style="text-align:center;">
  [![Marpit](./marpit.png ':size=500')](/)
</p>
<p style="text-align:center;">
  **Marpit**: Markdown slide deck framework
</p>

---

**Marpit** /mɑːrpɪt/ is the skinny framework for creating slide deck from Markdown. It can transform Markdown and CSS theme(s) to slide deck composed of static HTML and CSS and create a web page convertible into slide PDF by printing.

Marpit is designed to _output minimum assets for the slide deck_. You can use the bare assets as a logicless slide deck, but mainly we expect to integrate output with other tools and applications.

In fact, this framework is created for using as the base of [a core converter][marp-core] in [the next version of Marp][marp].

## Features

### [:pencil: Marpit Markdown](/markdown) {docsify-ignore}

We have extended several features into [markdown-it](https://github.com/markdown-it/markdown-it) parser to support writing awesome slides, such as [_Directives_](/directives) and [_Slide backgrounds_](/image-syntax#slide-backgrounds). Additional syntaxes place importance on a compatibility with general Markdown documents.

### [:art: Theme CSS by clean markup](/theme-css) {docsify-ignore}

Marpit has the CSS theming system that can design slides everything. Unlike other slide frameworks, there are not any predefined classes and mixins. You have only to focus styling HTML elements by pure CSS. Marpit would take care of the selected theme's necessary conversion.

### [:triangular_ruler: Inline SVG slide <i>(Experimental)</i>](/inline-svg) {docsify-ignore}

Optionally `<svg>` element can use as the container of each slide page. It can be realized the pixel-perfect scaling of the slide only by CSS, so handling slides in integrated apps become simplified. The isolated layer made by `<foreignObject>` can provide [_advanced backgrounds_](/image-syntax#advanced-backgrounds) for the slide with keeping the original Markdown DOM structure.

?> We not provide any themes because Marpit is just a framework. You can use [@marp-team/marp-core][marp-core] if you want. It has the official themes, and practical features extended from Marpit.

## Getting started

### Installation

We recommend using [yarn](https://yarnpkg.com/) to install.

```bash
yarn add @marp-team/marpit
```

If you want to use npm, try this:

```bash
npm install @marp-team/marpit --save
```

### How to use

```javascript
import Marpit from '@marp-team/marpit'
import fs from 'fs'

// 1. Create instance (with options if you want)
const marpit = new Marpit()

// 2. Add theme CSS
const theme = `
/* @theme example */

section {
  background-color: #369;
  color: #fff;
  font-size: 30px;
  padding: 40px;
}

h1,
h2 {
  text-align: center;
  margin: 0;
}

h1 {
  color: #8cf;
}
`
marpit.themeSet.default = marpit.themeSet.add(theme)

// 3. Render markdown
const markdown = `

# Hello, Marpit!

Marpit is the skinny framework for creating slide deck from Markdown.

---

## Ready to convert into PDF!

You can convert into PDF slide deck through Chrome.

`
const { html, css } = marpit.render(markdown)

// 4. Use output in your HTML
const htmlFile = `
<!DOCTYPE html>
<html><body>
  <style>${css}</style>
  ${html}
</body></html>
`
fs.writeFileSync('example.html', htmlFile.trim())
```

Outputted HTML is [here](/assets/how-to-use/example.html ':ignore'). It can convert into [PDF slide deck](/assets/how-to-use/example.pdf ':ignore') through printing by Chrome.

We are introducing the basic usage step-by-step in [Usage](usage.md) section.

## Author

Managed by [@marp-team](https://github.com/marp-team).

- ![yhatt](https://github.com/yhatt.png ':size=16') Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

This framework releases under the [MIT License](https://github.com/marp-team/marpit/blob/master/LICENSE).
