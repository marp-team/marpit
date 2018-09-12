# Inline SVG slide _(experimental)_

!> :triangular_ruler: This feature is experimental because of a strange rendering in some browsers.

When you set [`inlineSVG: true` in Marpit constructor option](/usage#triangular_ruler-inline-svg-slide), each `<section>` elements are wrapped with inline SVG.

```html
<svg viewBox="0 0 1280 960">
  <foreignObject width="1280" height="960">
    <section>
      <h1>Page 1</h1>
    </section>
  </foreignObject>
</svg>
<svg viewBox="0 0 1280 960">
  <foreignObject width="1280" height="960">
    <section>
      <h1>Page 2</h1>
    </section>
  </foreignObject>
</svg>
```

## Motivation

It might feel a bit strange, but this approach has certain advantages.

### Pixel-perfect scaling

You may delegate a logic of pixel-perfect scaling for slide page to SVG. You have to do is only defining a size for viewing.

```css
/* Fit slide page to viewport */
svg {
  display: block;
  width: 100vw;
  height: 100vh;
}
```

Developer can handle the slide much easier in Marpit integrated apps.

!> WebKit cannot scale HTML elements in `<foreignObject>`. ([Bug 23113](https://bugs.webkit.org/show_bug.cgi?id=23113)) Blink can scale them, but currently layouting seems not to be stable. ([Bug 467484](https://bugs.chromium.org/p/chromium/issues/detail?id=467484))

?> [@marp-team/marp-core](https://github.com/marp-team/marp-core), has extended from Marpit, has [useful auto-scaling features](https://github.com/marp-team/marp-core#auto-scaling-features) that are applied this feature.

### No require JavaScript

Marpit's scaffold style has defined `scroll-snap-align` declaration to `section` elements. They can align and fit to viewport by defining `scroll-snap-type` to the scroll container. ([CSS Scroll Snap](https://developers.google.com/web/updates/2018/07/css-scroll-snap))

Thus, a minimal web-based presentation no longer requires JavaScript.

### Isolated layer

Marpit's [advanced backgrounds](/image-syntax#advanced-backgrounds) would work within the isolated `<foreignObject>` from the content. It means that the original Markdown DOM structure per page are keeping.
