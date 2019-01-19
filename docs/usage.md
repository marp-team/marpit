# Usage

Marpit has only a feature: Convert Markdown and theme set into HTML/CSS. Thus the basic usage is completely simple.

## Marpit class

At first you must create an instance of [**`Marpit`**](https://marpit-api.marp.app/marpit) class.

```javascript
const { Marpit } = require('@marp-team/marpit')

// Create Marpit instance
const marpit = new Marpit()
```

### Constructor options

By passing object of options, you can customize the behavior of Marpit instance when creating.

_**[See all options at JSDoc](https://marpit-api.marp.app/marpit)** to details._ Here we will introduce useful recipes.

#### :pencil: [markdown-it](https://github.com/markdown-it/markdown-it) parser setting

You can customize the behavior of Markdown parser by `markdown` option. It will pass to [markdown-it initializer](https://github.com/markdown-it/markdown-it#init-with-presets-and-options) as it is.

```javascript
const marpit = new Marpit({
  markdown: {
    html: true, // Enable HTML tags
    breaks: true, // Convert line breaks into `<br />`
  },
})
```

#### :package: Customize container elements

You can customize container HTML elements too. These settings are using to scope the converted CSS. [`Element` class](https://marpit-api.marp.app/element) helps to specify container(s).

```javascript
const { Marpit, Element } = require('@marp-team/marpit')

const marpit = new Marpit({
  container: [
    new Element('article', { id: 'presentation' }),
    new Element('div', { class: 'slides' }),
  ],
  slideContainer: new Element('div', { class: 'slide' }),
})
```

It would render elements like this:

```html
<!-- Container elements -->
<article id="presentation">
  <div class="slides">
    <!-- Slide container elements -->
    <div class="slide"><section>Page 1</section></div>
    <div class="slide"><section>Page 2</section></div>
  </div>
</article>
```

The default container is [`<div class="marpit">`](https://marpit-api.marp.app/module-element.html#.marpitContainer), and no slide containers (render only `<section>`). If you may not use any containers and CSS scoping, please set `container` option as `false`.

#### :triangular_ruler: Inline SVG slide

Turn on the _(experimental)_ [inline SVG slide](/inline-svg).

```javascript
const marpit = new Marpit({
  inlineSVG: true,
})
```

## Render Markdown

Now, let's render Markdown. Just only pass a string of Markdown to [**`marpit.render(markdown)`**](https://marpit-api.marp.app/marpit#render).

```javascript
// Output rendered HTML, CSS, and collected HTML comments (See "Advanced")
const { html, css, comments } = marpit.render('# Hello, Marpit!')
```

The HTML output is like this. (Formatted)

```html
<div class="marpit">
  <section id="1"><h1>Hello, Marpit!</h1></section>
</div>
```

If the outputted CSS applies into this HTML, [it become to be able to print slide deck as PDF in Chrome](/assets/hello-marpit.pdf ':ignore').

`render()` method is an only key feature of Marpit instance.

## Apply theme

We had not assigned any theme in previous example. The rendered CSS only includes minimum declarations to work as slide deck.

You may assign the set of [theme CSS](/theme-css) through Marpit instance's [**`themeSet`** property](https://marpit-api.marp.app/marpit#themeSet).

### Add to theme set

Use [**`themeSet.add(css)`**](https://marpit-api.marp.app/themeset#add) to add theme CSS. It returns created [`Theme`](https://marpit-api.marp.app/theme) instance.

```javascript
const theme = marpit.themeSet.add(`
/* @theme my-first-theme */

section {
  background-color: #123;
  color: #fff;
  font-size: 30px;
  padding: 40px;
}

h1 {
  color: #8cf;
}
`)
```

We require `@theme` meta comment in CSS. You can use added theme if you are selected it [through directive (`<!-- theme: my-first-theme -->`)](/directives#theme).

### Default theme

By assigning `Theme` instance to [**`themeSet.default`**](https://marpit-api.marp.app/themeset#default) property, you can specify default theme. It allows using theme without directive.

```javascript
marpit.themeSet.default = marpit.themeSet.add('...')
```

[The applied example is here.](/assets/hello-marpit-theme.pdf ':ignore')

## Advanced

### Output HTML as array

[`marpit.render()`](https://marpit-api.marp.app/marpit#render) has an optional second argument `env`, to pass data object into [markdown-it](https://markdown-it.github.io/markdown-it/#MarkdownIt.render).

When you passed `htmlAsArray: true`, the renderer will output HTML as array, that has consisted HTML per slide pages.

```javascript
const markdown = `
# Page 1

---

# Page 2
`

const { html } = marpit.render(markdown, { htmlAsArray: true })
/*
[ '<section id="1">\n<h1>Page 1</h1>\n</section>\n',
  '<section id="2">\n<h1>Page 2</h1>\n</section>\n' ]
*/
```

!> Marpit initializer's `container` option is still enabled to scope CSS, so you have to render these HTMLs within `<div class="marpit">` or [customized element(s)](#package-customize-container-elements).

### Presenter notes

Marpit can collect HTML comments written in Markdown while rendering, except [directives](/directives). The collected `comments` are returned in the result of [`marpit.render()`](https://marpit-api.marp.app/marpit#render).

You may use it as the presenter notes in Marpit integrated apps.

```javascript
const { comments } = marpit.render(`
<!-- theme: default -->

# First page

<!-- HTML comment recognizes as a presenter note per pages. -->
<!-- You may place multiple comments in a single page. -->

---

## Second page

<!--
Also supports multiline.
We bet these comments would help your presentation...
-->
`)
```

The returned value is a two-dimensional array composed by comments per slide pages.

```json
[
  [
    "HTML comment recognizes as a presenter note per pages.",
    "You may place multiple comments in a single page."
  ],
  [
    "Also supports multiline.\nWe bet these comments would help your presentation..."
  ]
]
```

### Extend Marpit by plugins

You can extend Marpit Markdown parser by [`marpit.use()`](https://marpit-api.marp.app/marpit#use) with [markdown-it plugin](https://www.npmjs.com/search?q=keywords:markdown-it-plugin).

Due to our policy, Marpit has not extended Markdown syntax such as to break CommonMark. But you may use plugins if you want the aggressive extended syntax.

For example, let's say you want to use the custom container by [markdown-it-container](https://github.com/markdown-it/markdown-it-container) to support multi-column block.

```javascript
const { Marpit } = require('@marp-team/marpit')
const markdownItContainer = require('markdown-it-container')

// Create the extended Marpit instance
const marpit = new Marpit().use(markdownItContainer, 'columns')

// Setting default theme for styling multi-column
marpit.themeSet.default = marpit.themeSet.add(`
/* @theme custom-container */
section { padding: 50px; }
.columns { column-count: 2; }
`)

// Render HTML and CSS from Markdown that includes custom container
const { html, css } = marpit.render(`
::: columns
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perspiciatis
perferendis, dolorem amet adipisci quas rem iusto excepturi ipsam aperiam quo
expedita totam a laborum ut voluptatibus voluptate fugit voluptatem eum?
:::
`)
```

You're ready to use multi-column through custom container! The rendered slide is as follows.

<p align="center">

[<img src="/assets/plugin-custom-container.png" alt="Rendered custom container" style="box-shadow:0 5px 15px #ccc;" />](/assets/plugin-custom-container.png ':ignore')

</p>

!> Marpit has already many extends to support converting Markdown into slide deck. So some markdown-it plugins that are not created for Marpit would not work as expected because of existing extends.

## Full API documentation

The documentation of Marpit API, created by JSDoc, is hosted on another site. Please refer to **[https://marpit-api.marp.app/](https://marpit-api.marp.app/)**.
