<div align="center">
  <p>
    <img src="marpit.png" alt="Marpit" width="500" />
  </p>
  <p>
    <strong>Marpit</strong>: Markdown slide deck framework
  </p>
</div>

---

**Marpit** /mɑːrpɪt/ is the skinny framework for creating slide deck from Markdown.

It could transform the Markdown and CSS theme(s) to slide deck composed by static HTML and CSS. (powered by [markdown-it](https://github.com/markdown-it/markdown-it) and [PostCSS](https://github.com/postcss/postcss))

* **[Marpit Markdown](#marpit-markdown)** - Based on CommonMark, and have extended _Directives_.
* **[Clear markup](#markup)** - Marpit theme CSS has no own class, so you can focus on _your_ markup.
* **[Inline SVG slide](#inline-svg-slide)** _(Experimental)_ - Support slide auto-scaling without extra JavaScript.

Marpit will become a core of _the next version of **[Marp](https://github.com/yhatt/marp/)**_.

> :warning: **This framework is under development and not ready to use.** In addition, we are not ready to accept your contributes because it is proof of concept about the next version of Marp.

## Marpit Markdown

**Marpit Markdown** syntax focuses a compatibility with commonly Markdown documents. It means the result of rendering keeps looking nice even if you open the Marpit Markdown in a general Markdown editor.

### Directives

#### Difference from [pre-released Marp](https://github.com/yhatt/marp/)

* Removed directives about slide size. Use `width` / `height` declaration of theme CSS.
* Parse directives by YAML parser. ([js-yaml](https://github.com/nodeca/js-yaml) + [`FAILSAFE_SCHEMA`](http://www.yaml.org/spec/1.2/spec.html#id2802346))
* Support [Jekyll style front-matter](https://jekyllrb.com/docs/frontmatter/).
* [Global directives](https://github.com/yhatt/marp/blob/master/example.md#global-directives) is no longer requires `$` prefix. (but it still supports because of compatibility and clarity)
* [Page directives](https://github.com/yhatt/marp/blob/master/example.md#page-directives) is renamed to local directives.
* Spot directives, that is known as scoped page directive to current slide, has prefix `_`.

### ToDo

* [ ] Background image (must use _only_ `background-image` style on `<section>`)
  * [ ] Parse `![bg]` syntax
  * [ ] Auto layouting like Deckset
* [ ] Header and footer directive
* [ ] Slide page number

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

> :information_source: Marpit provides only [the minimum style for scaffolding presentation](src/theme/scaffold.js), and does not provide default theme. <!-- You can use the `marp` package if you want (under construction). -->

In theme CSS, you need not think about the hierarchy of Marpit. All that you have to know is just that a `<section>` element becomes a slide.

```css
/**
 * @theme marpit-theme
 */

section {
  width: 1280px;
  height: 960px;
  font-size: 40px;
}

h1 {
  font-size: 60px;
}
```

The `Marpit` instance has a `themeSet` member that manages usable themes in the `theme` directive of Marpit Markdown. You have to add theme CSS by using `themeSet.add(string)`.

```javascript
import Marpit from '@marp-team/marpit'
import fs from 'fs'

const marpit = new Marpit()
marpit.themeSet.add(fs.readFileSync('marpit-theme.css', 'utf-8'))
```

A specified theme will convert to static CSS in rendering by `marpit.render()`. It will make it printable to pdf, and add scope with the container element(s) to each selector.

## Inline SVG slide _(experimental)_

> :warning: _This feature is experimental_ because of [a Chromium issue](https://bugs.chromium.org/p/chromium/issues/detail?id=771852). We are enabling a workaround, but it will disable a few basic styling defined in theme CSS. It includes `position`, `transform` and `overflow` with scrolling (`auto` and `scroll`).

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

## API

Refer JSDoc: **[https://marpit.netlify.com/](https://marpit.netlify.com/)**

## Development

Under construction.

### Contributing

We are sorry but currently we are not ready to accept your contribute because it is under developing for proof of concept.

## Author

Managed by [@marp-team](https://github.com/marp-team).

* <img src="https://github.com/yhatt.png" width="16" height="16"/> Yuki Hattori ([@yhatt](https://github.com/yhatt))

## License

[MIT License](LICENSE)
