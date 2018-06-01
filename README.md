<div align="center">
  <p>
    <img src="marpit.png" alt="Marpit" width="500" />
  </p>
  <p>
    <strong>Marpit</strong>: Markdown slide deck framework
  </p>
  <p>

[![Travis CI](https://img.shields.io/travis/marp-team/marpit/master.svg?style=flat-square)](https://travis-ci.org/marp-team/marpit)
[![Coveralls](https://img.shields.io/coveralls/marp-team/marpit/master.svg?style=flat-square)](https://coveralls.io/github/marp-team/marpit?branch=master)
[![npm](https://img.shields.io/npm/v/@marp-team/marpit.svg?style=flat-square)](https://www.npmjs.com/package/@marp-team/marpit)
[![LICENSE](https://img.shields.io/github/license/marp-team/marpit.svg?style=flat-square)](./LICENSE)

  </p>
</div>

---

**Marpit** /mɑːrpɪt/ is the skinny framework for creating slide deck from Markdown.

It could transform the Markdown and CSS theme(s) to slide deck composed by static HTML and CSS. (powered by [markdown-it](https://github.com/markdown-it/markdown-it) and [PostCSS](https://github.com/postcss/postcss))

- **[Marpit Markdown](#marpit-markdown)** - Based on CommonMark, and have extended _Directives_.
- **[Clear markup](#markup)** - Marpit theme CSS has no own class, so you can focus on _your_ markup.
- **[Inline SVG slide](#inline-svg-slide-experimental)** _(Experimental)_ - Support slide auto-scaling without extra JavaScript.

Marpit will become a core of _the next version of **[Marp](https://github.com/yhatt/marp/)**_.

> :warning: **This framework is under development and not ready to use.** In addition, we are not ready to accept your contributes because it is proof of concept about the next version of Marp.

## Marpit Markdown

**Marpit Markdown** syntax focuses a compatibility with commonly Markdown documents. It means the result of rendering keeps looking nice even if you open the Marpit Markdown in a general Markdown editor.

### Directives

#### Difference from [pre-released Marp](https://github.com/yhatt/marp/)

- Removed directives about slide size. [Use `width` / `height` declaration of theme CSS.](#slide-size)
- Parse directives by YAML parser. ([js-yaml](https://github.com/nodeca/js-yaml) + [`FAILSAFE_SCHEMA`](http://www.yaml.org/spec/1.2/spec.html#id2802346))
- Support [Jekyll style front-matter](https://jekyllrb.com/docs/frontmatter/).
- _[Global directives](https://github.com/yhatt/marp/blob/master/example.md#global-directives)_ is no longer requires `$` prefix. (but it still supports because of compatibility and clarity)
- [Page directives](https://github.com/yhatt/marp/blob/master/example.md#page-directives) is renamed to _local directives_.
- _Spot directives_, that is known as scoped page directive to current slide, has prefix `_`.

#### Pagination

We support a pagination by the `paginate` local directive. It is same as [the `page_number` directive in pre-released Marp](https://github.com/yhatt/marp/blob/master/example.md#page_number).

```
<!-- paginate: true -->

You would be able to see a page number of slide in the lower right.
```

##### Skip pagination on title slide

Simply you have to move a definition of `paginate` directive to an inside of a second page.

```markdown
# Title slide

(This page will not paginate by lack of `paginate` local directive)

---

<!-- paginate: true -->

It will paginate slide from a this page.
```

#### Header and footer

When you have to be shown the same content across multiple slides like a title of the slide deck, you can use `header` or `footer` local directives.

```markdown
---
header: "Header content"
footer: "Footer content"
---

# Page 1

---

## Page 2
```

In above case, it will render to HTML like this:

```html
<section>
  <header>Header content</header>
  <h1>Page 1</h1>
  <footer>Footer content</footer>
</section>
<section>
  <header>Header content</header>
  <h2>Page 2</h2>
  <footer>Footer content</footer>
</section>
```

The specified contents will wrap by a corresponding element, and insert to a right place of each slide.

If you want to place these contents in the marginals of the slide, **you have to use a theme that is supported it.** If not, you could simply see header and footer as the part of slide content.

##### Styling header and footer

In addition, you can format the header and footer content with inline styling through markdown syntax. You can also insert inline images.

```html
---
header: "**bold** _italic_"
footer: "![image](https://example.com/image.jpg)"
---
```

> :warning: Marpit uses YAML for parsing directives, so **you should wrap with quotes** when the value includes invalid chars in YAML.

> :information_source: Due to the parsing order of Markdown, you cannot use [slide background images](#slide-background) in `header` and `footer` directives.

### Slide backgrounds

We provide a background image syntax to specify slide's background through Markdown. Include `bg` to the alternate text.

```markdown
![bg](https://example.com/background.jpg)
```

When you defined 2 or more background images in a slide, Marpit will show the last defined image only. If you want to show multiple images, try [the advanced backgrounds](#advanced-backgrounds-with-inline-svg-mode) by enabling [inline SVG mode](#inline-svg-slide-experimental).

You can disable by `backgroundSyntax: false` in Marpit constructor option if you not want the `bg` syntax.

#### Resize images

You can resize the image by space-separated options. The basic option value follows `background-size` style (but except length).

```markdown
`cover` will scale image to fill the slide (default):
![bg cover](https://example.com/background.jpg)

---

`contain` will scale image to fit the slide:
![bg contain](https://example.com/background.jpg)

You can also use the `fit` keyword like Deckset:
![bg fit](https://example.com/background.jpg)

---

`auto` will not scale image, and use the original size:
![bg auto](https://example.com/background.jpg)

---

The percentage value will specify the scaling factor of image.
![bg 150%](https://example.com/background.jpg)
```

#### Styling through directives

If you want to use any color or the gradient as background, you can set style directly through local or spot directives.

```markdown
<!-- _backgroundImage: "linear-gradient(to bottom, #67b8e3, #0288d1)" -->

Gradient background

---

<!--
_backgroundColor: black
_color: white
-->

Black background + White text
```

This feature is available regardless of `backgroundSyntax` option in Marpit constructor.

##### Directives

| Spot directive        | Description                                                     | Default     |
| --------------------- | --------------------------------------------------------------- | ----------- |
| `_backgroundColor`    | Specify `background-color` style.                               |             |
| `_backgroundImage`    | Specify `background-image` style.                               |             |
| `_backgroundPosition` | Specify `background-position` style.                            | `center`    |
| `_backgroundRepeat`   | Specify `background-repeat` style.                              | `no-repeat` |
| `_backgroundSize`     | Specify `background-size` style.                                | `cover`     |
| `_color`              | Specify `color` style. It's usable if the text is hard to read. |             |

The beginning underbar of directive means "_Apply only to current slide page_". (Spot directive)

When you remove the underbar, the background would apply to current and _the following pages_ (Local directive).

#### Advanced backgrounds with inline SVG mode

The advanced backgrounds will work _only with [`inlineSVG: true`](#inline-svg-slide-experimental)_. It supports multiple background images, image filters, and split backgrounds.

##### Multiple background images

```markdown
![bg](https://example.com/backgroundA.jpg)
![bg](https://example.com/backgroundB.jpg)
```

These images will arrange in a row.

##### Split backgrounds

The `left` or `right` keyword with `bg` keyword make a space for the background to the specified side. It has a half of slide size, and the space of a slide content will shrink too.

```markdown
![bg left](https://example.com/backgroundA.jpg)

# Slide contents

The space of a slide content will shrink to the right side.

---

<!-- Multiple background images will work well in the specified background side. -->

![bg right](https://example.com/backgroundB.jpg)
![bg](https://example.com/backgroundC.jpg)

# Slide contents

The space of a slide content will shrink to the left side.
```

This feature is similar to [Deckset's Split Slides](https://docs.decksetapp.com/English.lproj/Images%20and%20Videos/01-background-images.html).

> Marpit uses a last defined keyword in a slide when `left` and `right` keyword is mixed in the same slide by using multiple background images.

### Image filters

You can apply CSS filters to image through markdown image syntax. Include `<filter-name>(:<param>(,<params>...))` to the space-separated alternate text of image syntax.

Filters can use in the inline image and [the advanced backgrounds](#advanced-backgrounds-with-inline-svg-mode). You can disable this feature with `filters: false` in Marpit constructor option.

#### Filters

We are following the function of the [`filter` style](https://developer.mozilla.org/en-US/docs/Web/CSS/filter).

| Markdown           | (with arguments)                             | `filter` style                              |
| ------------------ | -------------------------------------------- | ------------------------------------------- |
| `![blur]()`        | `![blur:10px]()`                             | `blur(10px)`                                |
| `![brightness]()`  | `![brightness:1.5]()`                        | `brightness(1.5)`                           |
| `![contrast]()`    | `![contrast:200%]()`                         | `contrast(200%)`                            |
| `![drop-shadow]()` | `![drop-shadow:0,5px,10px,rgba(0,0,0,.4)]()` | `drop-shadow(0 5px 10px rgba(0, 0, 0, .4))` |
| `![grayscale]()`   | `![grayscale:1]()`                           | `grayscale(1)`                              |
| `![hue-rotate]()`  | `![hue-rotate:180deg]()`                     | `hue-rotate(180deg)`                        |
| `![invert]()`      | `![invert:100%]()`                           | `invert(100%)`                              |
| `![opacity]()`     | `![opacity:.5]()`                            | `opacity(.5)`                               |
| `![saturate]()`    | `![saturate:2.0]()`                          | `saturate(2.0)`                             |
| `![sepia]()`       | `![sepia:1.0]()`                             | `sepia(1.0)`                                |

Marpit will use the default arguments shown in above when you omit arguments.

Naturally multiple filters can apply to a image.

```markdown
![brightness:.8 sepia:50%](https://example.com/image.jpg)
```

## Markup

### HTML output

The basic idea is that `<section>` element is corresponding to each slide. It is same as [reveal.js](https://github.com/hakimel/reveal.js/#markup).

```html
<section>
  <h1>First page</h1>
</section>
<section>
  <h1>Second page</h1>
</section>
```

By default, Marpit wraps whole slides by `<div class="marpit">` for scoping CSS.

```html
<div class="marpit">
  <section>
    ...
  </section>
</div>
```

This container element(s) can change in Marpit constructor option. Also `container: false` can disable wrapping.

### Theme CSS

> :information_source: Marpit provides only [the minimum style for scaffolding presentation](src/theme/scaffold.js), and does not provide default theme. You can use the [`@marp-team/marp`](https://github.com/marp-team/marp/tree/master/packages/marp) package if you want (UNDER CONSTRUCTION).

In theme CSS, you need not think about the hierarchy of Marpit. All that you have to know is just that a `<section>` element becomes a slide.

```css
/**
 * @theme marpit-theme
 */

section {
  width: 1280px;
  height: 960px;
  font-size: 40px;
  padding: 40px;
}

h1 {
  font-size: 60px;
}
```

#### The root `section` selector

In Marpit theme CSS, the root `section` selector means like a viewport of each slide.

##### Slide size

`width` and `height` declaration in `section` selector can specify a slide size. (1280x720 pixels by default)

The specified size is not only used in the section element size but also used in the size of each page of printed PDF.

For example, try these declarations in your theme CSS if you want a classic 4:3 slide:

```css
section {
  width: 960px;
  height: 720px;
}
```

Please notice _these must define a length in **an absolute unit.**_ We support `cm`, `in`, `mm`, `pc`, `pt`, and `px`.

> :warning: Currently, you cannot tweak slide size through [`<style>` elements](#tweak-theme-in-markdown) or [`style` global directive](#style-global-directive).

##### Styling paginations

You can style the page number through `section::after` pseudo-element. (It is shown by `paginate` local directive)

```css
section::after {
  font-weight: bold;
  text-shadow: 1px 1px 0 #fff;
}
```

Please refer to [the default style of `section::after` in a scaffold theme](src/theme/scaffold.js) as well.

> :information_source: The root `section::after` has preserved a content of page number from Marpit. At present, you cannot use the root `section::after` selector for other use.

#### Header and footer

`header` element and `footer` element have a possible to be rendered by [local directives](#header-and-footer). _Marpit has no default style for these elements._

If you want to place to marginals of slide, using `position: absolute` would be a good solution.

```css
section {
  padding: 50px;
}

header,
footer {
  position: absolute;
  left: 50px;
  right: 50px;
  height: 20px;
}

header {
  top: 30px;
}

footer {
  bottom: 30px;
}
```

Of course, you can use the other way as needed (Flexbox, Grid, etc...).

You can even hide by `display: none` when you are scared a corrupted layout caused by inserted elements. Poof!

#### `@import` another theme

We support importing another theme with CSS [`@import`](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) rule. You can make a customized theme based on any theme.

For example, you can dye a boring monochrome theme to a brilliant orange as follows:

```css
/* @theme base */

section {
  background: #fff;
  color: #333;
}
```

```css
/* @theme customized */

@import 'base';

section {
  background: #f80;
  color: #fff;
}
```

`@import` must precede all other statements excepted `@charset`. (It follows [the original specification](https://developer.mozilla.org/en-US/docs/Web/CSS/@import))

> :information_source: An importing theme must add by using `Marpit.themeSet.add(css)` in advance.

##### `@import-theme`

When you are using CSS preprocessors like [Sass](https://sass-lang.com/), _`@import` might resolve path in compiling_ and be lost definitions. So you can use `@import-theme` rule alternatively.

```scss
$bg-color: #f80;
$text-color: #fff;

@import-theme 'base';

section {
  background: $bg-color;
  color: $text-color;
}
```

`@import-theme` can place on anywhere of the root of CSS, and the imported contents is inserted to the beginning of CSS in order.

> :warning: You cannot import another theme while [tweaking style by using inline `<style>`](#tweak-theme-in-markdown) and [`style` global directive](#style-global-directive).

#### Tweak theme in Markdown

You can tweak the theme's style in Markdown. Marpit parses `<style>` HTML element in the context of as same as a theme.

```markdown
---
theme: base
---

<style>
section {
  background: yellow;
}
</style>

# Tweak theme through the `style` element

You would see a yellow slide.
```

> :information_source: By default, `<style>` elements will not render in HTML because of processing to bundle additional CSS with theme.
>
> You can set `inlineStyle: false` in Marpit constructor option to disable bundling the style elements. In this case, it follows `html` markdown-it option whether render `<style>` as HTML element. Marpit would NOT apply post-processing even though the raw style was rendered as HTML. (e.g. scoping, import theme, etc.)

##### `style` global directive

Instead of a `<style>` element, you can use a [global directive](#directives) too. It could prevent additional styling in the other Markdown editor.

```yaml
theme: base
style: |
  section {
    background: yellow;
  }
```

#### Theme set

The `Marpit` instance has a `themeSet` member that manages usable themes in the `theme` directive of Marpit Markdown. You have to add theme CSS by using `themeSet.add(string)`.

```javascript
import Marpit from '@marp-team/marpit'
import fs from 'fs'

const marpit = new Marpit()
marpit.themeSet.add(fs.readFileSync('marpit-theme.css', 'utf-8'))
```

A specified theme will convert to static CSS in rendering by `marpit.render()`. It will make it printable to pdf, and add scope with the container element(s) to each selector.

## Inline SVG slide _(experimental)_

> :warning: This feature is experimental because of some strange rendering in Chrome. [Track chromium issues about `<foreignObject>`.](https://bugs.chromium.org/p/chromium/issues/list?q=foreignObject&sort=-stars)

When you set `inlineSVG: true` in Marpit constructor option, the each `<section>` are wrapped by inline SVG.

```html
<svg viewBox="0 0 1280 960">
  <foreignObject width="1280" height="960">
    <section>
      ...
    </section>
  </foreignObject>
</svg>
```

SVG elements can scale contents with keeping aspect ratio. If you are creating an app that integrated Marpit, it would become easy to handle the layout of slides by CSS.

If it combines with [CSS Scroll Snap](https://www.w3.org/TR/css-scroll-snap-1/), _we would not need to require any JavaScript logic_ for the simple HTML-based presentation.

In addition, [the advanced backgrounds](#advanced-backgrounds-with-inline-svg-mode) will support in the layer of this SVG. The injected elements to support advanced background will not affect the DOM structure of each slide.

## API

Refer JSDoc: **[https://marpit.netlify.com/](https://marpit.netlify.com/)**

## Development

Under construction.

### Contributing

We are sorry but currently we are not ready to accept your contribute because it is under developing for proof of concept.

## Author

Managed by [@marp-team](https://github.com/marp-team).

- <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

[MIT License](LICENSE)
