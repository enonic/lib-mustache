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
pnpm build:types            # @enonic-types/lib-mustache package -> build/types (version from gradle.properties)
pnpm test:types             # build:types + verify:types, the one-command developer entry point
pnpm verify:types           # packlist check + type-check types/test against an existing build/types
```

`./gradlew build` runs `buildTypes` (into `assemble`) and `testTypes` (into `check`); CI publishes
`build/types` to npm right after the Maven publish, on release versions only.

`testTypes` runs `verify:types`, not `test:types`, because `types/build.mjs` opens by deleting
`build/types` — running the full `test:types` there would have a verification task destroy and
rewrite `buildTypes`' declared output. lib-cors still has that wiring; this repo deliberately
diverges, as lib-cron does.

## Types package

The types package is generated, never hand-written. `tsconfig.types.json` emits declarations from
`mustache.ts`, and `types/build.mjs` assembles `build/types` with the version from
`gradle.properties`. A type reaches the package only if it is `export`ed, and the
`declare global { interface XpLibraries }` block in `mustache.ts` is what types
`require('/lib/mustache')` for consumers — esbuild erases it from the bundle.

Unlike `@enonic-types/lib-cron` and `@enonic-types/lib-cors`, this package declares a real
dependency on `@enonic-types/core`: `render` takes a `ResourceKey`, so the emitted declaration
imports it. Dropping that dependency would leave consumers resolving the import by luck.

`types/verify.mjs` checks the built package rather than the emitted file: the npm packlist, an
import-style consumer (`types/test/consumer.ts`) and a `require()`-only one
(`types/test/require-only.ts`), both with `skipLibCheck: false`.

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
