# Image syntax

Marpit has extended Markdown image syntax `![](image.jpg)` to be helpful creating beautiful slides.

|              Features              |       Inline image       |         Slide BG         |    Advanced BG     |
| :--------------------------------: | :----------------------: | :----------------------: | :----------------: |
|  [Resizing by keywords][resizing]  |       `auto` only        |    :heavy_check_mark:    | :heavy_check_mark: |
| [Resizing by percentage][resizing] | :heavy_multiplication_x: |    :heavy_check_mark:    | :heavy_check_mark: |
|   [Resizing by length][resizing]   |    :heavy_check_mark:    |    :heavy_check_mark:    | :heavy_check_mark: |
|      [Image filters][filters]      |    :heavy_check_mark:    | :heavy_multiplication_x: | :heavy_check_mark: |
|  [Multiple backgrounds][multiple]  |            -             | :heavy_multiplication_x: | :heavy_check_mark: |
|     [Split backgrounds][split]     |            -             | :heavy_multiplication_x: | :heavy_check_mark: |

[resizing]: #resizing-image
[filters]: #image-filters
[advanced-bg]: #advanced-backgrounds
[multiple]: #multiple-backgrounds
[split]: #split-backgrounds
[constructor]: https://marpit-api.marp.app/marpit/

Basically the extended features can turn enable by including corresponded keywords to the image's alternative text.

### Resizing image

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

!> Several units related to the size of the viewport (e.g. `vw`, `vh`, `vmin`, `vmax`) cannot use to ensure immutable render result.

### Image filters

You can apply [CSS filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) to image through markdown image syntax. Include `<filter-name>(:<param>(,<param>...))` to the alternate text of image.

Filters can use in the inline image and [the advanced backgrounds][advanced-bg].

| Markdown           | w/ arguments                                 |
| ------------------ | -------------------------------------------- |
| `![blur]()`        | `![blur:10px]()`                             |
| `![brightness]()`  | `![brightness:1.5]()`                        |
| `![contrast]()`    | `![contrast:200%]()`                         |
| `![drop-shadow]()` | `![drop-shadow:0,5px,10px,rgba(0,0,0,.4)]()` |
| `![grayscale]()`   | `![grayscale:1]()`                           |
| `![hue-rotate]()`  | `![hue-rotate:180deg]()`                     |
| `![invert]()`      | `![invert:100%]()`                           |
| `![opacity]()`     | `![opacity:.5]()`                            |
| `![saturate]()`    | `![saturate:2.0]()`                          |
| `![sepia]()`       | `![sepia:1.0]()`                             |

Marpit will use the default arguments shown in above when you omit arguments.

Naturally multiple filters can apply to a image.

```markdown
![brightness:.8 sepia:50%](https://example.com/image.jpg)
```

?> You can disable this feature with [`filters: false` in Marpit constructor option][constructor] if you not want.

## Slide backgrounds

We provide a background image syntax to specify slide's background through Markdown. It only have to include `bg` keyword to the alternate text.

```markdown
![bg](https://example.com/background.jpg)
```

When you defined two or more background images in a slide, Marpit will show the last defined image only. If you want to show multiple images, try [the advanced backgrounds][advanced-bg] by enabling [inline SVG slide](/inline-svg).

?> You can disable by [`backgroundSyntax: false` in Marpit constructor option][constructor] if you not want. However, you can still style background image through [directives](/directives#backgrounds).

### Background size

You can resize the background image by keywords. The keyword value basically follows [`background-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) style.

```markdown
![bg contain](https://example.com/background.jpg)
```

|   Keyword | Description                                     | Example                    |
| --------: | :---------------------------------------------- | :------------------------- |
|   `cover` | Scale image to fill the slide. _(Default)_      | `![bg cover](image.jpg)`   |
| `contain` | Scale image to fit the slide.                   | `![bg contain](image.jpg)` |
|     `fit` | Alias to `contain`, compatible with Deckset.    | `![bg fit](image.jpg)`     |
|    `auto` | Not scale image, and use the original size.     | `![bg auto](image.jpg)`    |
|    _`x%`_ | Specify the scaling factor by percentage value. | `![bg 150%](image.jpg)`    |

You also can continue to use [`width` (`w`) and `height` (`h`) option keywords][resizing] to specify size by length.

## Advanced backgrounds

!> :triangular_ruler: It will work only in experimental [inline SVG slide](/inline-svg).

The advanced backgrounds support [multiple backgrounds][multiple], [split backgrounds][split], and [image filters for background][filters].

### Multiple backgrounds

```markdown
![bg](https://example.com/backgroundA.jpg)
![bg](https://example.com/backgroundB.jpg)
![bg](https://example.com/backgroundC.jpg)
```

These images will arrange in a row.

### Split backgrounds

The `left` or `right` keyword with `bg` keyword make a space for the background to the specified side. It has a half of slide size, and the space of a slide content will shrink too.

```markdown
![bg left](https://example.com/backgroundA.jpg)

# Split backgrounds

The space of a slide content will shrink to the right side.

---

<!-- Multiple backgrounds will work well in the specified background side. -->

![bg right](https://example.com/backgroundB.jpg)
![bg](https://example.com/backgroundC.jpg)

# Split + Multiple BGs

The space of a slide content will shrink to the left side.
```

This feature is similar to [Deckset's Split Slides](https://docs.decksetapp.com/English.lproj/Images%20and%20Videos/01-background-images.html#split-slides-1).

?> Marpit uses a last defined keyword in a slide when `left` and `right` keyword is mixed in the same slide by using multiple backgrounds.
