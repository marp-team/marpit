# Marpit Markdown {docsify-ignore-all}

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

## Extended features

- [Directives](/directives)
- [Image syntax](/image-syntax)
