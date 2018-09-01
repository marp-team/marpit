<div align="center">
  <p>
    <a href="https://marpit.marp.app"><img src="./docs/marpit.png" alt="Marpit" width="500" /></a>
  </p>
  <p>
    <strong>Marpit</strong>: Markdown slide deck framework
  </p>
  <p>

[![CircleCI](https://img.shields.io/circleci/project/github/marp-team/marpit/master.svg?style=flat-square)](https://circleci.com/gh/marp-team/marpit/)
[![Codecov](https://img.shields.io/codecov/c/github/marp-team/marpit/master.svg?style=flat-square)](https://codecov.io/gh/marp-team/marpit)
[![npm](https://img.shields.io/npm/v/@marp-team/marpit.svg?style=flat-square)](https://www.npmjs.com/package/@marp-team/marpit)
[![LICENSE](https://img.shields.io/github/license/marp-team/marpit.svg?style=flat-square)](./LICENSE)

  </p>
</div>

---

**Marpit** /mɑːrpɪt/ is the skinny framework for creating slide deck from Markdown. It can transform Markdown and CSS theme(s) to slide deck composed of static HTML and CSS and create a web page convertible into slide PDF by printing.

Marpit is designed to _output minimum assets for the slide deck_. You can use the bare assets as a logicless slide deck, but mainly we expect to integrate output with other tools and applications.

This framework is actually created for use as [a core][marp-core] of the next version of [Marp](https://github.com/yhatt/marp/).

[marp-core]: https://github.com/marp-team/marp-core/

> :warning: **This framework is under development and not ready to use.** In addition, we are not ready to accept your contributes because it is proof of concept about the next version of Marp.

## Features

### [:pencil: **Marpit Markdown**](#marpit-markdown)

We have extended several features into [markdown-it](https://github.com/markdown-it/markdown-it) parser to support writing awesome slides, such as [Directives](#directives) and [Slide backgrounds](#slide-backgrounds). Additional syntaxes place importance on a compatibility with general Markdown documents.

### [:art: **CSS theme by clear markup**](#theme-css)

Marpit has the CSS theming system that can design slides everything. Unlike other slide frameworks, there are not any predefined classes and mixins. You have only to focus styling HTML elements by pure CSS. Marpit would take care of the selected theme's necessary conversion.

### [:triangular_ruler: **Inline SVG slide**][inline-svg] <i>(Experimental)</i>

Optionally `<svg>` element can use as the container of each slide page. It can be realized the pixel-perfect scaling of the slide only by CSS, so handling slides in integrated apps become simplified. The isolated HTML space made by `<foreignObject>` can provide [_Advanced backgrounds_][advanced-bg] for the slide with keeping the original Markdown DOM structure.

> :information_source: We not provide any themes because Marpit is just a framework. You can use [@marp-team/marp-core][marp-core] if you want. It has the official themes, and practical features extended from Marpit.

## Marpit Markdown

**Marpit Markdown** syntax focuses a compatibility with commonly Markdown documents. It means the result of rendering keeps looking nice even if you open the Marpit Markdown in a general Markdown editor.

### Directives

#### Difference from [pre-released Marp](https://github.com/yhatt/marp/)

- Removed directives about slide size. [Use `width` / `height` declaration of theme CSS.](#slide-size)
- Parse directives by YAML parser. ([js-yaml](https://github.com/nodeca/js-yaml) + [`FAILSAFE_SCHEMA`](http://www.yaml.org/spec/1.2/spec.html#id2802346), but we still support lazy YAML for directives by `lazyYAML` option)
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
header: 'Header content'
footer: 'Footer content'
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

> :warning: Marpit uses YAML for parsing directives, so **you should wrap with (double-)quotes** when the value includes invalid chars in YAML.
>
> You can enable a lazy YAML parsing by `lazyYAML` Marpit constructor option if you want to recognize defined directive's string without quotes.

> :information_source: Due to the parsing order of Markdown, you cannot use [slide backgrounds](#slide-backgrounds) in `header` and `footer` directives.

#### Heading divider

This feature is similar to [Pandoc](https://pandoc.org/)'s [`--slide-level` option](https://pandoc.org/MANUAL.html#structuring-the-slide-show) and [Deckset 2](https://www.deckset.com/2/)'s "Slide Dividers" option.

By using `headingDivider` global directive, you can instruct to divide slide pages automatically at before of headings whose larger than or equal to specified level.

For example, the below 2 markdowns have the same output.

<table>
<thead>
<tr>
<th style="text-align:center;">Regular syntax</th>
<th style="text-align:center;">Heading divider</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```markdown
# 1st page

The content of 1st page

---

## 2nd page

### The content of 2nd page

Hello, world!

---

# 3rd page

😃
```

</td><td>

```markdown
<!-- headingDivider: 2 -->

# 1st page

The content of 1st page

## 2nd page

### The content of 2nd page

Hello, world!

# 3rd page

😃
```

</td>
</tr>
</tbody>
</table>

It is useful when you want to create a slide deck from a plain Markdown. Even if you opened an example about `headingDivider` in general Markdown editor, it keeps a beautiful rendering without horizontal rulers.

#### Styling backgrounds

If you want to use any color or the gradient as background, you can set style through `backgroundColor` or `backgroundImage` local directives.

```markdown
<!-- backgroundImage: "linear-gradient(to bottom, #67b8e3, #0288d1)" -->

Gradient background

---

<!--
_backgroundColor: black
_color: white
-->

Black background + White text
```

|     Local directives | Description                                                     | Default     |
| -------------------: | --------------------------------------------------------------- | ----------- |
|    `backgroundColor` | Specify `background-color` style.                               |             |
|    `backgroundImage` | Specify `background-image` style.                               |             |
| `backgroundPosition` | Specify `background-position` style.                            | `center`    |
|   `backgroundRepeat` | Specify `background-repeat` style.                              | `no-repeat` |
|     `backgroundSize` | Specify `background-size` style.                                | `cover`     |
|              `color` | Specify `color` style. It's usable if the text is hard to read. |             |

### Image syntaxes

Marpit provides Markdown image syntaxes `![](image.jpg)` with extended to be helpful creating beautiful slides.

|                 Extended features                 |       Inline image       | [Slide backgrounds](#slide-backgrounds) | [Advanced backgrounds][advanced-bg] |
| :-----------------------------------------------: | :----------------------: | :-------------------------------------: | :---------------------------------: |
|    **[Resizing](#resizing-image)** by keywords    |       `auto` only        |           :heavy_check_mark:            |         :heavy_check_mark:          |
|            **Resizing** by percentage             | :heavy_multiplication_x: |           :heavy_check_mark:            |         :heavy_check_mark:          |
|              **Resizing** by length               |    :heavy_check_mark:    |           :heavy_check_mark:            |         :heavy_check_mark:          |
|        **[Image filters](#image-filters)**        |    :heavy_check_mark:    |        :heavy_multiplication_x:         |         :heavy_check_mark:          |
| **[Multiple backgrounds](#multiple-backgrounds)** |            -             |        :heavy_multiplication_x:         |         :heavy_check_mark:          |
|    **[Split backgrounds](#split-backgrounds)**    |            -             |        :heavy_multiplication_x:         |         :heavy_check_mark:          |

Basically the extended features can turn enable by including corresponded keywords to the image's alternative text.

#### Resizing image

You can resize image by using `width` and `height` keyword options.

```markdown
![width:200px](image.jpg) <!-- Setting width to 200px -->
![height:30cm](image.jpg) <!-- Setting height to 300px -->
![width:200px height:30cm](image.jpg) <!-- Setting both lengths -->
```

We also support the shorthand options `w` and `h`. Normally it's useful to use these.

```markdown
![w:32 h:32](image.jpg) <!-- Setting size to 32x32 px -->
```

Inline images _only allow `auto` keyword and the length units defined in CSS._

> :warning: Several units related to the size of the viewport (e.g. `vw`, `vh`, `vmin`, `vmax`) cannot use to ensure immutable render result.

#### Image filters

You can apply CSS filters to image through markdown image syntax. Include `<filter-name>(:<param>(,<params>...))` to the alternate text of image.

Filters can use in the inline image and [the advanced backgrounds][advanced-bg].

| Markdown           | (with arguments)                             | Corresponded [`filter` style][filter-mdn]   |
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

[filter-mdn]: https://developer.mozilla.org/en-US/docs/Web/CSS/filter

Marpit will use the default arguments shown in above when you omit arguments.

Naturally multiple filters can apply to a image.

```markdown
![brightness:.8 sepia:50%](https://example.com/image.jpg)
```

> :information_source: You can disable this feature with `filters: false` in Marpit constructor option if you not want.

#### Slide backgrounds

We provide a background image syntax to specify slide's background through Markdown. It only have to include `bg` keyword to the alternate text.

```markdown
![bg](https://example.com/background.jpg)
```

When you defined two or more background images in a slide, Marpit will show the last defined image only. If you want to show multiple images, try [the advanced backgrounds][advanced-bg] by enabling [inline SVG mode][inline-svg].

> :information_source: You can disable by `backgroundSyntax: false` in Marpit constructor option if you not want. However, you can still style background image through [directives](#styling-backgrounds).

#### Background size

You can resize the background image by keywords. The basic keyword value follows `background-size` style.

```markdown
![bg contain](https://example.com/background.jpg)
```

|       Keyword | Description                                     | Example                    |
| ------------: | :---------------------------------------------- | :------------------------- |
|   **`cover`** | Scale image to fill the slide. _(Default)_      | `![bg cover](image.jpg)`   |
| **`contain`** | Scale image to fit the slide.                   | `![bg contain](image.jpg)` |
|         `fit` | Alias to `contain`, compatible with Deckset.    | `![bg fit](image.jpg)`     |
|    **`auto`** | Not scale image, and use the original size.     | `![bg auto](image.jpg)`    |
|        _`x%`_ | Specify the scaling factor by percentage value. | `![bg 150%](image.jpg)`    |

You also can continue to use [`width` (`w`) and `height` (`h`) option keywords](#resizing-image) to specify size by length.

#### Advanced backgrounds with inline SVG mode

[advanced-bg]: #advanced-backgrounds-with-inline-svg-mode

The advanced backgrounds will work _only with [`inlineSVG: true`][inline-svg]_. It supports image filters, multiple backgrounds, and split backgrounds.

##### Multiple backgrounds

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

<!-- Multiple backgrounds will work well in the specified background side. -->

![bg right](https://example.com/backgroundB.jpg)
![bg](https://example.com/backgroundC.jpg)

# Slide contents

The space of a slide content will shrink to the left side.
```

This feature is similar to [Deckset's Split Slides](https://docs.decksetapp.com/English.lproj/Images%20and%20Videos/01-background-images.html).

> :information_source: Marpit uses a last defined keyword in a slide when `left` and `right` keyword is mixed in the same slide by using multiple backgrounds.

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

> :information_source: Marpit provides only [the minimum style for scaffolding presentation](src/theme/scaffold.js), and does not provide default theme. You can use [`@marp-team/marp-core`][marp-core] if you want.

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

[inline-svg]: #inline-svg-slide-experimental

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

In addition, [the advanced backgrounds][advanced-bg] will support in the layer of this SVG. The injected elements to support advanced background will not affect the DOM structure of each slide.

## API

Refer JSDoc: **[https://marpit-api.marp.app/](https://marpit-api.marp.app/)**

## Development

Under construction.

### Contributing

We are sorry but currently we are not ready to accept your contribute because it is under developing for proof of concept.

## Author

Managed by [@marp-team](https://github.com/marp-team).

- <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

[MIT License](LICENSE)
