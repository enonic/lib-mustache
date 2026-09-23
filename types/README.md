# @enonic-types/lib-mustache

TypeScript declarations for [lib-mustache](https://github.com/enonic/lib-mustache), the Enonic XP
Mustache library. They are generated from the library source on every release, so the version
matches the jar.

## Setup

```bash
npm install --save-dev @enonic-types/lib-mustache
```

The package is types-only, so it belongs in `devDependencies`. Add it to both `types` and `paths`
in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "types": ["@enonic-types/global", "@enonic-types/lib-mustache"],
        "paths": {
            "/lib/mustache": ["./node_modules/@enonic-types/lib-mustache"]
        }
    }
}
```

Both entries are needed, one per module style. The `types` entry — next to
[`@enonic-types/global`](https://www.npmjs.com/package/@enonic-types/global) — loads the package's
`XpLibraries` augmentation, which is what types `require('/lib/mustache')`; `paths` alone does not
type `require()` in a file that never imports the module. The `paths` entry is what resolves
`import ... from '/lib/mustache'`, and needs no `baseUrl` on modern TypeScript.

## Usage

```js
const mustacheLib = require('/lib/mustache');

const view = resolve('view/fruit.html');
const result = mustacheLib.render(view, {
    fruits: [
        { name: 'Apple', color: 'Red' },
        { name: 'Pear', color: 'Green' },
    ],
});
```

```ts
import { render } from '/lib/mustache';

export function fruitList(fruits: { name: string; color: string }[]): string {
    return render(resolve('view/fruit.html'), { fruits });
}
```

The model is optional — `render(view)` renders the template against an empty model rather than
failing.

Template syntax and rendering behavior are documented in the
[lib-mustache documentation](https://github.com/enonic/lib-mustache/tree/master/docs/index.adoc).
