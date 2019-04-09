# Fragmented list

Since v0.9.0, Marpit will parse lists with specific markers as the **fragmented list** for appearing contents one by one.

## For bullet list

CommonMark allows `-`, `+`, and `*` as the character of [bullet list marker](https://spec.commonmark.org/0.29/#bullet-list-marker). Marpit would parse as fragmented list if you are using `*` as the marker.

<!-- prettier-ignore-start -->

```markdown
# Bullet list

- One
- Two
- Three

---

# Fragmented list

* One
* Two
* Three
```

<!-- prettier-ignore-end -->

## For ordered list

CommonMark's [ordered list marker](https://spec.commonmark.org/0.29/#ordered-list-marker) must have `.` or `)` after digits. Marpit would parse as fragmented list if you are using `)` as the following character.

<!-- prettier-ignore-start -->

```markdown
# Ordered list

1. One
2. Two
3. Three

---

# Fragmented list

1) One
2) Two
3) Three
```

<!-- prettier-ignore-end -->

## Rendering

A structure of rendered HTML from the fragmented list is same as the regular list. It just adds `data-marpit-fragment` data attribute to list items. They would be numbered from 1 in order of recognized items.

In addition, `<section>` element of the slide that has fragmented list would be added `data-marpit-fragments` data attribute. It shows the number of fragmented list items of its slide.

The below HTML is a rendered result of [bullet list example](#for-bullet-list).

```html
<section id="1">
  <h1>Bullet list</h1>
  <ul>
    <li>One</li>
    <li>Two</li>
    <li>Three</li>
  </ul>
</section>
<section id="2" data-marpit-fragments="3">
  <h1>Fragmented list</h1>
  <ul>
    <li data-marpit-fragment="1">One</li>
    <li data-marpit-fragment="2">Two</li>
    <li data-marpit-fragment="3">Three</li>
  </ul>
</section>
```

?> Fragmented list does not change DOM structure and appearances. It relys on a behavior of the integrated app whether actually treats the rendered list as fragments.
