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
    <div class="slide">
      <section>Page 1</section>
    </div>
    <div class="slide">
      <section>Page 2</section>
    </div>
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
  <section id="1">
    <h1>Hello, Marpit!</h1>
  </section>
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

## Full API documentation

The documentation of Marpit API, created by JSDoc, is hosted on another site. Please refer to **[https://marpit-api.marp.app/](https://marpit-api.marp.app/)**.
