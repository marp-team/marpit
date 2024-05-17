# [Marpit API](https://marpit-api.marp.app/)

The documentation of Marpit API (on `main` branch) has been published at **[https://marpit-api.marp.app/](https://marpit-api.marp.app/)**.

> Please run `npm run jsdoc` if you want to build documentation at local. It would build docs in `jsdoc` directory.

## Documentations

### Classes

**Classes** section is documented about public classes.

We provide **[`Marpit`](Marpit.html)** class by default export.

```javascript
import Marpit from '@marp-team/marpit'
```

And all classes can use with named export. (Recommend if you are using TypeScript)

```javascript
import { Element, Marpit, Theme, ThemeSet } from '@marp-team/marpit'
```

### Modules _(for internal)_

**Modules** section is documented about internal modules, that includes plugins for markdown-it and PostCSS, for helping to learn Marpit's architecture by contributors and plugin authors.

⚠️ **Do not use internal modules directly.** They might be changed the specification without following semantic versioning.

---

## Create plugin

Are you interested to develop third-party plugin for Marpit?

### [markdown-it](https://github.com/markdown-it/markdown-it) plugin

Marpit's plugin interface has compatible with [markdown-it](https://github.com/markdown-it/markdown-it). [Please refer to the documentation of markdown-it](https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md) if you want to manipulate the result of Markdown rendering in plugin.

### Marpit plugin

When plugin was used through [`Marpit.use()`](Marpit.html#use), it can access to current Marpit instance via `marpit` member of the passed markdown-it instance.

`@marp-team/marpit/plugin` provides [a helper for creating Marpit plugin](module-plugin.html). A generated plugin promises an existance of `marpit` member.

```javascript
import { marpitPlugin } from '@marp-team/marpit/plugin'

export default marpitPlugin(({ marpit }) => {
  // Add your plugin code here (Add theme, define custom directives, etc...)
  /*
  marpit.customDirectives.local.yourDirective = (value) => {
    return { yourDirective: value }
  }
  */
})
```

If the user tried to use the generated Marpit plugin from this helper as markdown-it plugin wrongly, the plugin throws an error. Thus, you can mark the plugin as dedicated to Marpit.
