# [Marpit API](https://marpit.netlify.com/)

The documentation of Marpit API on `master` branch has been published at **[https://marpit.netlify.com/](https://marpit.netlify.com/)**.

Please run `yarn docs` if you want to build documentation at local. It would build docs in `jsdoc` directory.

## Classes

**Classes** section is documented about public classes.

We are provide **[`Marpit`](Marpit.html)** class by default export.

```javascript
import Marpit from '@marp-team/marpit'
```

And the all classes can use with named export.

```javascript
import { Element, Marpit, Theme, ThemeSet } from '@marp-team/marpit'
```

### For development

**Modules** section is documented about internal modules, that is includes plugins of markdown-it and PostCSS.

Basically, _Marpit user should not use module directly._
