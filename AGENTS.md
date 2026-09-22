## Project

**lib-mustache** (`com.enonic.lib.mustache`) is an Enonic XP library that renders
[Mustache](http://mustache.github.io/) templates. Targets XP 8+. The Java side is a
`MustacheService` script bean wrapping [jmustache](https://github.com/samskivert/jmustache); the
JavaScript surface is a single `render(view, model)` function that marshals the model into that
bean.

`jmustache` is **not** unpacked into the jar — it ships as a POM runtime dependency. Do not adopt
lib-cron's `includeLib`/`copyLibFiles` pattern here; it would change the published artifact.

The library runs under the consuming app's script engine, which defaults to Nashorn in XP 8, so the
shipped JavaScript must stay ES5-safe. `tsc` gates the built-ins through `lib: ES5`, and esbuild
gates the syntax through `target: es5` — esbuild is the only one of the two that shapes the output,
since `tsconfig.json` sets `noEmit`. `target` is `ES2015` there only because TypeScript 7 removed
`ES5`.

Do not widen `lib` past `ES5`. It is the gate that fails silently: esbuild passes built-ins through
untouched, so the break lands on the consumer's engine rather than in this build.

The bundle ships as `lib/mustache.js` and that path is fixed — 3.x consumers call
`require('/lib/mustache')`.

`src/main/resources/lib/examples/mustache/render.js` stays plain JavaScript. It is not an entry
point; `MustacheScriptTest` executes it through `testInstance.runScript(...)`, and
`processResources` copies it alongside the esbuild output.

## Commands

```bash
./gradlew build             # full build (production by default): esbuild -> build/esbuild, jar, Java tests on both engines
./gradlew build -Penv=dev   # dev build (source maps)
pnpm build                  # dev esbuild bundle only -> build/esbuild
pnpm check                  # type-check (tsc) + lint/format (biome)
pnpm fix                    # auto-fix lint + formatting
```

`xp.scriptEngines` gives `check` a `test` task on Nashorn and a `testGraalJS` task on GraalJS.
`MustacheScriptTest` drives the emitted bundle through `ScriptRunnerSupport`, so both engines
execute the library's own JavaScript. Both must stay green.

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
