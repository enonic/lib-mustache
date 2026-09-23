// require()-only consumer: nothing here imports the module, so typing comes solely from the XpLibraries
// hook in the built package, which tsconfig.require.json pulls in the way a consumer's `types` entry does.
// XpRequire falls back to `unknown`, not `any`, so without the hook every line below fails, not passes.

const mustacheLib = require('/lib/mustache');

const view = resolve('view/fruit.html');

export const html: string = mustacheLib.render(view, {
    fruits: [{ name: 'Apple', color: 'Red' }],
});

export const blank: string = mustacheLib.render(view);

// @ts-expect-error the view is required
mustacheLib.render();

// @ts-expect-error render returns the rendered markup, not a number
export const notANumber: number = mustacheLib.render(view);
