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

?> By the spec of [CommonMark](https://spec.commonmark.org/0.28/#example-28), an empty line may be required before the dash ruler. You can use the underline ruler `___`, asterisk ruler `***`, and space-included ruler `- - -` when you not want to add empty lines.

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

### List of directives

|       Kind       | Name                 | Description                                        |
| :--------------: | :------------------- | :------------------------------------------------- |
| [Global][global] | `headingDivider`     | Specify heading divider option.                    |
| [Global][global] | `style`              | Specify CSS for tweaking theme.                    |
| [Global][global] | `theme`              | Specify theme of the slide deck.                   |
|  [Local][local]  | `backgroundColor`    | Setting `background-color` style of slide.         |
|  [Local][local]  | `backgroundImage`    | Setting `background-image` style of slide.         |
|  [Local][local]  | `backgroundPosition` | Setting `background-position` style of slide.      |
|  [Local][local]  | `backgroundRepeat`   | Setting `background-repeat` style of slide.        |
|  [Local][local]  | `backgroundSize`     | Setting `background-size` style of slide.          |
|  [Local][local]  | `class`              | Specify HTML class of slide's `<section>` element. |
|  [Local][local]  | `color`              | Setting `color` style of slide.                    |
|  [Local][local]  | `footer`             | Specify the content of slide footer.               |
|  [Local][local]  | `header`             | Specify the content of slide header.               |
|  [Local][local]  | `paginate`           | Show page number on the slide if you set `true`.   |

[global]: #global-directives
[local]: #local-directives

### Kinds

#### Global directives

_Global directives are the setting value of the whole slide deck._ Marpit recognizes only the last value if you wrote a same global directives many times.

You may use prefix `$` to the name of global directives for clarity of the kind.

```markdown
<!-- $theme: default -->
```

#### Local directives

_Local directives are the setting value per slide pages._ These would apply to **defined page and following pages.**

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

[<img src="/assets/directives.png" alt="Diagram" style="box-shadow:0 5px 15px #ccc;" />](/assets/directives.png ':ignore')

</p>
