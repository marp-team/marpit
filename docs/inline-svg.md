# Inline SVG slide _(experimental)_

!> 📐 This feature is experimental because of a strange rendering in WebKit browsers.

When you set [`inlineSVG: true` in Marpit constructor option](/usage#triangular_ruler-inline-svg-slide), each `<section>` elements are wrapped with inline SVG.

```html
<svg data-marpit-svg viewBox="0 0 1280 960">
  <foreignObject width="1280" height="960">
    <section><h1>Page 1</h1></section>
  </foreignObject>
</svg>
<svg data-marpit-svg viewBox="0 0 1280 960">
  <foreignObject width="1280" height="960">
    <section><h1>Page 2</h1></section>
  </foreignObject>
</svg>
```

### Options <!-- {docsify-ignore} -->

`inlineSVG` constructor option also allows setting the option object. Refer to [Marpit API documentation](https://marpit-api.marp.app/marpit#~InlineSVGOptions) for details.

## Motivation

You may feel it a bit strange. Why we have taken this approach?

### Pixel-perfect scaling

You may delegate a logic of pixel-perfect scaling for slide page to SVG. You have to do is only defining a size for viewing.

```css
/* Fit slide page to viewport */
svg[data-marpit-svg] {
  display: block;
  width: 100vw;
  height: 100vh;
}
```

Developer can handle the slide much easier in Marpit integrated apps.

> [@marp-team/marp-core](https://github.com/marp-team/marp-core), has extended from Marpit, has [useful auto-scaling features](https://github.com/marp-team/marp-core#auto-scaling-features) that are taken this advantage.

!> WebKit cannot scale HTML elements in `<foreignObject>` ([Bug 23113](https://bugs.webkit.org/show_bug.cgi?id=23113)). You can mitigate by [polyfill](#polyfill).

### JavaScript not required

Marpit's scaffold style has defined `scroll-snap-align` declaration to `section` elements. They can align and fit to viewport by defining `scroll-snap-type` to the scroll container. ([CSS Scroll Snap](https://developers.google.com/web/updates/2018/07/css-scroll-snap))

Thus, a minimal web-based presentation no longer requires JavaScript. We strongly believe that keeping logic-less is important for performance and maintaining framework.

> By using Marpit, [@marp-team/marp-cli](https://github.com/marp-team/marp-cli) can output HTML file for presentation that is consisted of _only HTML and CSS_.
>
> ```bash
> npm i -g @marp-team/marp-cli
> npm i @marp-team/marpit
>
> marp --template bare --engine @marp-team/marpit marpit-deck.md
> ```

### Isolated layer

Marpit's [advanced backgrounds](/image-syntax#advanced-backgrounds) will work within the isolated `<foreignObject>` from the content. It means that the original Markdown DOM structure per page are keeping.

If advanced backgrounds were injected into the same layer as the Markdown content, inserted elements may break CSS selectors like [`:first-child` pseudo-class](https://developer.mozilla.org/docs/Web/CSS/:first-child) and [adjacent combinator (`+`)](https://developer.mozilla.org/docs/Web/CSS/Adjacent_sibling_combinator).

## Webkit polyfill

We provide a polyfill for WebKit based browsers in [@marp-team/marpit-svg-polyfill](https://github.com/marp-team/marpit-svg-polyfill).

```html
<svg data-marpit-svg viewBox="0 0 1280 960">
  <foreignObject width="1280" height="960">
    <section><h1>Page 1</h1></section>
  </foreignObject>
</svg>

<!-- Apply polyfill -->
<script src="https://cdn.jsdelivr.net/npm/@marp-team/marpit-svg-polyfill/lib/polyfill.browser.js"></script>
```

## `::backdrop` CSS selector

If enabled inline SVG mode, Marpit theme CSS and inline styles will redirect [`::backdrop` CSS selector](https://developer.mozilla.org/docs/Web/CSS/::backdrop) to the SVG container.

A following rule matches to `<svg data-marpit-svg>` element.

```css
::backdrop {
  background-color: #448;
}
```

Some of Marpit integrated apps treats the background of SVG container as like as the backdrop of slide. By setting `background` style to the SVG container, you can change the color/image of slide [letterbox](<https://en.wikipedia.org/wiki/Letterboxing_(filming)>)/[pillarbox](https://en.wikipedia.org/wiki/Pillarbox).

Try resizing SVG container in below:

<div style="width:300px;height:250px;min-width:100px;min-height:100px;max-width:100%;resize:both;margin:0 auto;overflow: scroll;">
<svg data-marpit-svg viewBox="0 0 1280 720" style="background-color:#448;width:100%;height:100%;display:block;">
  <foreignObject width="1280" height="720">
    <section style="width:1280px;height:720px;background:url('https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=720&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYzNzMzMDc0Ng&ixlib=rb-1.2.1&q=80&w=1280');">
    </section>
  </foreignObject>
</svg>
</div>

!> `::backdrop` pseudo-element does not limit applicable styles. To avoid unexpected effects into slides and apps, we strongly recommend to use this selector _only for changing the backdrop color_.

### Disable

If concerned conflict with styles for SVG container provided by app you are creating, you can disable `::backdrop` selector redirection separately by setting `backdropSelector` option as `false`.

```javascript
const marpit = new Marpit({
  inlineSVG: { backdropSelector: false },
})
```
