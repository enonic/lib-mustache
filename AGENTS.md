## Project

**lib-mustache** (`com.enonic.lib.mustache`) is an Enonic XP library that renders
[Mustache](http://mustache.github.io/) templates. Targets XP 8+. The Java side is a
`MustacheService` script bean wrapping [jmustache](https://github.com/samskivert/jmustache); the
JavaScript surface is a single `render(view, model)` function that marshals the model into that
bean.

`jmustache` is **not** unpacked into the jar — it ships as a POM runtime dependency. Do not adopt
lib-cron's `includeLib`/`copyLibFiles` pattern here; it would change the published artifact.

The library runs under the consuming app's script engine, which defaults to Nashorn in XP 8, so the
shipped JavaScript must stay ES5-safe.

`lib/mustache.js` is a fixed path — 3.x consumers call `require('/lib/mustache')`.

## Branches

`master` is the 3.x development line. `3.x` and `2.x` are maintenance branches; both, plus
`master`, are listed in the workflow's `releaseBranch` and in `docs/versions.json`.

## Git & GitHub

**`gh` CLI:** Do not assume `gh` is available. Use raw `git` commands if missing.

### Commits

- **With issue**: `<Issue Title> #<number>` — e.g. `Modernize the Gradle and TypeScript toolchain #75`
- **Without issue**: plain text description — e.g. `Fix model handling for null values`
- Never add a `Co-Authored-By` trailer for an assistant, and no generated-by lines.

### Pull Requests

- No emojis. Be concise — list only the changes, one line each.
- Any `Closes #<number>` goes last.
