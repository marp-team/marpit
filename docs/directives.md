# Directives

Marpit Markdown has extended syntax called **"Directives"** to support writing awesome slides. It can control your slide-deck theme, page number, header, footer, style, and so on.

## Usage

The wrote directives would parse as [YAML](http://yaml.org/).

When the value includes YAML special chars, you should wrap with quotes to be recognized correctly. You may enable a loose parsing by [`looseYAML` Marpit constructor option](https://marpit-api.marp.app/marpit) if you want.

### HTML comment

```markdown
<!--
theme: default
paginate: true
-->
```

?> The HTML comment is also used for [presenter notes](/usage?id=presenter-notes). When it is parsed as a directive, it would not be collected in the `comments` result of `Marpit.render()`.

### Front-matter

Marpit also supports [YAML front-matter](https://jekyllrb.com/docs/frontmatter/), that is a syntax often used for keeping metadata of Markdown. It must be the first thing of Markdown, and between the dash rulers.

```markdown
---
theme: default
paginate: true
---
```

?> Please not confuse to the ruler for paging slides. The actual slide contents would start after the ending ruler of front-matter.

## Type of directives

### Global directives {docsify-ignore}

Global directives are _the setting value of the whole slide deck_, like `theme`. Marpit recognizes only the last value if you wrote a same global directives many times.

You may use prefix `$` to the name of global directives for clarity type.

```markdown
<!-- $theme: default -->
```

### Local directives {docsify-ignore}

Local directives are _the setting value per slide pages._ These would apply to **defined page and following pages.**

```markdown
<!-- backgroundColor: aqua -->

This page has aqua background.

---

The second page also has same color.
```

#### Apply to a single page (Spot directives)

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

Normally [you may tweak theme by `<style>` element](/theme-css#tweak-style-through-markdown), but it might break a style for documentation when opening in another Markdown editor. Thus you can use `style` global directive instead of `<style>`.

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

```markdown
<!-- paginate: true -->

You would be able to see a page number of slide in the lower right.
```

#### Skip pagination on title slide

Simply you have to move a definition of `paginate` directive to an inside of a second page.

```markdown
# Title slide

This page will not paginate by lack of `paginate` local directive.

---

<!-- paginate: true -->

It will paginate slide from a this page.
```

Or also can use the spot directive.

```markdown
---
paginate: true
_paginate: false
---
```

### Header and footer

When you have to be shown the same content across multiple slides like a title of the slide deck, you may use `header` or `footer` local directives.

```markdown
---
header: 'Header content'
footer: 'Footer content'
---

# Page 1

---

## Page 2
```

It will render to HTML like this:

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

The content will be wrapped by a corresponding element, and insert to a right place of each slide. These could see as the part of slide contents.

If you want to place these contents to the marginal of the slide as like as PowerPoint, _you have to use supported theme._

#### Formatting

In addition, you can format the content of header/footer through markdown syntax and insert inline images.

```markdown
---
header: '**bold** _italic_'
footer: '![image](https://example.com/image.jpg)'
---

NOTE: Wrap by (double-)quotes to avoid parsed as invalid YAML.
```

?> You cannot use [`![bg]()` syntax](/image-syntax#slide-backgrounds) in `header` and `footer` directives due to the parsing order of Markdown.

### Styling slide

#### Class

At the some page, you might think want to change the layout, theme color, and so on. `class` local directive can change a class attribute of `<section>` element of slide page.

Let's say you're using a theme includes a rule like this:

```css
section.lead h1 {
  text-align: center;
}
```

You could use the centered leading header by setting `class` spot directive to `lead`.

```markdown
<!-- _class: lead -->

# THE LEADING HEADER
```

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

In addition, we have supported customize for these declarations:

- `backgroundColor`
- `backgroundImage`
- `backgroundPosition` (`center` by default)
- `backgroundRepeat` (`no-repeat` by default)
- `backgroundSize` (`cover` by default)
- `color`

?> It also can use [extended image syntax](/image-syntax#slide-backgrounds) if you want to set image or color as background to single page.
