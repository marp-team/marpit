# Theme CSS

## HTML structure

The basic idea of HTML structure is that `<section>` elements are corresponding to each slide pages. It is same as [reveal.js](https://github.com/hakimel/reveal.js/#markup).

```html
<section><h1>First page</h1></section>
<section><h1>Second page</h1></section>
```

?> When conversion, Marpit would scope CSS selectors by wrapping with [container element(s)](/usage#package-customize-container-elements) automatically. However, the theme creator should not aware of this process.

## Create theme CSS

As indicated preceding, all that you have to know to create theme is just that `<section>` elements are used like a viewport for each slide pages.

```css
/* @theme marpit-theme */

section {
  width: 1280px;
  height: 960px;
  font-size: 40px;
  padding: 40px;
}

h1 {
  font-size: 60px;
  color: #09c;
}

h2 {
  font-size: 50px;
}
```

We have no any predefined classes or mixins, and don't need require extra definitions for creating theme. This is a key factor different from other slide framework.

### Metadata

We can parse any metadata in CSS comments. Especially the `@theme` metadata is always required by Marpit.

```css
/* @theme name */
```

!> You should use the `/*! comment */` syntax to prevent removing comments if you're using the compressed output of [Sass].

## Styling

### Slide size

`width` and `height` declaration in the root `section` selector mean a predefined slide size per theme. The specified size is not only used in the section element size but also in the size of printed PDF.

The default size is `1280` x `720` pixels. Try this if you want a classic 4:3 slide:

```css
section {
  width: 960px;
  height: 720px;
}
```

!> Please notice _it must define the length in **an absolute unit.**_ We support `cm`, `in`, `mm`, `pc`, `pt`, and `px`.

?> It is determined one size per theme. The slide size cannot tweak through using [inline style](#tweak-style-through-markdown) or [custom class](/directives#class), but may shrink the width of contents if user was using [split backgrounds](/image-syntax#split-backgrounds).

### Pagination

[`paginate` local directive](/directives#pagination) may control whether show the page number of slide. The theme creator can style it through `section::after` pseudo-element.

```css
/* Styling page number */
section::after {
  font-weight: bold;
  text-shadow: 1px 1px 0 #fff;
}
```

Please refer to [the default style of `section::after` in a scaffold theme](https://github.com/marp-team/marpit/blob/master/src/theme/scaffold.js) as well.

### Header and footer

`header` and `footer` element have a possible to be rendered by [`header` / `footer` local directives](/directives#header-and-footer). _Marpit has no default style for these elements._

If you want to place to the marginal of slide, using `position: absolute` would be a good solution.

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

## Customized theme

We allow creating a customized theme based on another theme.

### `@import` rule

[@import]: https://developer.mozilla.org/en-US/docs/Web/CSS/@import

We support importing another theme with CSS [`@import`][@import] rule. For example, you can dye a boring monochrome theme to a brilliant orange as follows:

```css
/* @theme base */

section {
  background-color: #fff;
  color: #333;
}
```

```css
/* @theme customized */

@import 'base';

section {
  background-color: #f80;
  color: #fff;
}
```

An importing theme must add to theme set by using [`Marpit.themeSet.add(css)`](/usage#add-to-theme-set) in advance.

### `@import-theme` rule

When you are using CSS preprocessors like [Sass], _`@import` might resolve path in compiling_ and be lost its definitions. So you can use `@import-theme` rule alternatively.

[sass]: https://sass-lang.com/

```scss
$bg-color: #f80;
$text-color: #fff;

@import-theme 'base';

section {
  background: $bg-color;
  color: $text-color;
}
```

`@import` for theme and `@import-theme` can place on anywhere of the root of CSS. The imported contents is inserted to the beginning of CSS in order per rules. (`@import` is processed before `@import-theme`)

## Tweak style through Markdown

Sometimes you might think that want to tweak current theme instead of customizing theme fully.

Marpit gives the `<style>` HTML element a special treatment. The specified inline style would parse in the context of as same as a theme, and bundle to the converted CSS together with it.

```markdown
---
theme: base
---

<style>
section {
  background: yellow;
}
</style>

# Tweak style through Markdown

You would see a yellow slide.
```

`<style>` elements would not find in rendered HTML, and would merge into CSS. [`style` global directive](/directives#tweak-theme-style) also can use as same purpose.

?> You may disable to bundle by setting [`inlineStyle: false` in Marpit constructor option](https://marpit-api.marp.app/marpit). In this case, whether to render `<style>` in HTML would follow `html` flag in `markdown` option. Any post-processing would never be applied to inline styles rendered by HTML. (e.g. scoping, import theme, etc...)

### Scoped style

We also support the scoped inline style through `<style scoped>`. When a `style` element has the `scoped` attribute, its style will apply to the current slide page only.

```markdown
<!-- Global style -->
<style>
h1 {
  color: red;
}
</style>

# Red text

---

<!-- Scoped style -->
<style scoped>
h1 {
  color: blue;
}
</style>

# Blue text (only in the current slide page)

---

# Red text
```

It is useful when you want to fine-tune styles per slide page.

?> This feature is available only when enabled inline style, and you may disable to support scoped style by setting [`scopedStyle: false` in Marpit constructor option](https://marpit-api.marp.app/marpit).
