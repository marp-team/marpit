# Marpit Markdown

Marpit Markdown syntax focuses a compatibility with commonly Markdown documents. It means the result of rendering keeps looking nice even if you open the Marpit Markdown in a general Markdown editor.

## How to write slides?

Marpit splits pages of the slide deck by horizontal ruler (e.g. `---`). It's very simple.

```markdown
# Slide 1

foo

---

# Slide 2

bar
```

?> An empty line may be required before the dash ruler by the spec of [CommonMark](https://spec.commonmark.org/0.28/#example-28). You can use the underline ruler `___`, asterisk ruler `***`, and space-included ruler `- - -` when you not want to add empty lines.

## Directives

Marpit Markdown has extended syntax called **"Directives"** to support writing awesome slides. It can control your slide-deck theme, page number, header, footer, style, and so on.

### Usage

The wrote directives would parse as [YAML](http://yaml.org/).

#### HTML comment

```markdown
<!--
theme: default
paginate: true
-->
```

#### Front-matter

Marpit also supports [YAML front-matter](https://jekyllrb.com/docs/frontmatter/), that is a syntax often used for keeping metadata of Markdown. It must be the first thing of Markdown, and between the dash rulers.

```markdown
---
theme: default
paginate: true
---
```

?> Please not confuse to the ruler for paging slides. The actual slide contents would start after the ending ruler of front-matter.

### Types

#### Global directives

Global directives are _the setting value of the whole slide deck_, like `theme`. Marpit recognizes only the last value if you wrote a same global directives many times.

You may use prefix `$` to the name of global directives for clarity type.

```markdown
<!-- $theme: default -->
```

#### Local directives

Local directives are _the setting value per slide pages._ These would apply to **defined page and following pages.**

```markdown
<!-- backgroundColor: aqua -->

This page has aqua background.

---

The second page also has same color.
```

##### Apply to a single page (Spot directives)

If you want to apply local directives only to current page, you have to use prefix `_` to the name of directives.

```markdown
<!-- _backgroundColor: aqua -->

Add underbar prefix `_` to the name of local directives.

---

The second page would not apply setting of directives.
```

#### Diagram

<p align="center">

[<img src="/assets/directives.png" alt="Diagram" style="box-shadow:0 5px 15px #ccc;max-height:720px;" />](/assets/directives.png ':ignore')

</p>

---

## Global directives

| Name             | Description                      |
| :--------------- | :------------------------------- |
| `theme`          | Specify theme of the slide deck. |
| `style`          | Specify CSS for tweaking theme.  |
| `headingDivider` | Specify heading divider option.  |

### Theme

Choose a theme with `theme` global directive.

```markdown
<!-- theme: registered-theme-name -->
```

It recognizes the name of theme added to [`themeSet` of `Marpit` instance](https://marpit-api.marp.app/marpit#themeSet).

#### Tweak theme style

Normally you may tweak theme by `<style>` element's inline style, but it might break a style for documentation when opening in another Markdown editor. Thus you can use `style` global directive instead of `<style>`.

```markdown
---
theme: base-theme
style: |
  section {
    background-color: #ccc;
  }
---
```

### Heading divider

You may instruct to divide slide pages automatically at before of headings by using `headingDivider` global directive. This feature is similar to [Pandoc](https://pandoc.org/)'s [`--slide-level` option](https://pandoc.org/MANUAL.html#structuring-the-slide-show) and [Deckset 2](https://www.deckset.com/2/)'s "Slide Dividers" option.

It have to specify heading level from 1 to 6, or array of them. This feature is enabled at headings whose the level _larger than or equal to the specified value_ if in a number, and it is enabled at _only specified levels_ if in array.

For example, the below two Markdowns have the same output.

#### Regular syntax

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

#### Heading divider

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

It is useful when you want to create a slide deck from a plain Markdown. Even if you opened Markdown that is using `headingDivider` in general editor, it keeps a beautiful rendering with no unsightly rulers.

?> [`Marpit` constructor](https://marpit-api.marp.app/marpit) can set a default level of heading divider.

## Local directives

| Name                 | Description                                        |
| :------------------- | :------------------------------------------------- |
| `paginate`           | Show page number on the slide if you set `true`.   |
| `header`             | Specify the content of slide header.               |
| `footer`             | Specify the content of slide footer.               |
| `class`              | Specify HTML class of slide's `<section>` element. |
| `backgroundColor`    | Setting `background-color` style of slide.         |
| `backgroundImage`    | Setting `background-image` style of slide.         |
| `backgroundPosition` | Setting `background-position` style of slide.      |
| `backgroundRepeat`   | Setting `background-repeat` style of slide.        |
| `backgroundSize`     | Setting `background-size` style of slide.          |
| `color`              | Setting `color` style of slide.                    |

### Pagination

We support a pagination by the `paginate` local directive.

```
<!-- paginate: true -->

You would be able to see a page number of slide in the lower right.
```

#### Skip pagination on title slide

Simply you have to move a definition of `paginate` directive to an inside of a second page.

```markdown
# Title slide

(This page will not paginate by lack of `paginate` local directive)

---

<!-- paginate: true -->

It will paginate slide from a this page.
```

### Header and footer

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

#### Formatting support

In addition, you can format the header and footer content with inline styling through markdown syntax. You can also insert inline images.

```html
---
header: "**bold** _italic_"
footer: "![image](https://example.com/image.jpg)"
---
```

!> Marpit uses YAML for parsing directives, so **you should wrap with (double-)quotes** when the value includes invalid chars in YAML. You can enable [lazy YAML parsing by `lazyYAML` Marpit constructor option](https://marpit-api.marp.app/marpit) if you want to recognize defined directive's string without quotes.

?> Due to the parsing order of Markdown, you cannot use [slide backgrounds](#slide-backgrounds) in `header` and `footer` directives.

### Styling slide

#### Class

#### Backgrounds

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

- `backgroundColor`
- `backgroundImage`
- `backgroundPosition` (`center` by default)
- `backgroundRepeat` (`no-repeat` by default)
- `backgroundSize` (`cover` by default)
- `color`
