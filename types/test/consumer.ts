// Import-style consumer of the built package: tsconfig.json here resolves '/lib/mustache' through
// build/types/package.json#types and checks the shipped .d.ts itself (skipLibCheck: false).
// require()-only consumption is a separate program, require-only.ts.

import type { ResourceKey } from '@enonic-types/core';
import { render } from '/lib/mustache';

export const view: ResourceKey = resolve('view/fruit.html');

export const html: string = render(view, {
    fruits: [
        { name: 'Apple', color: 'Red' },
        { name: 'Pear', color: 'Green' },
    ],
});

// The model is optional; MustacheProcessor renders against an empty map when it is absent
export const blank: string = render(view);
export const explicitlyUndefined: string = render(view, undefined);

// A declared interface is how consumers usually type a view model, and it has no string index
// signature — so the model parameter cannot be narrowed to Record<string, unknown>
interface FruitPage {
    fruits: { name: string; color: string }[];
}

const page: FruitPage = { fruits: [{ name: 'Apple', color: 'Red' }] };
export const fromInterface: string = render(view, page);

// Each rejection can fail for one reason only, so its directive cannot be satisfied by an unrelated error

// @ts-expect-error the view is required
render();

// @ts-expect-error the view is a ResourceKey from resolve(), not a path string
render('view/fruit.html');

// @ts-expect-error the model is an object of values, not a primitive
render(view, 42);

// @ts-expect-error render returns the rendered markup, not a number
export const notANumber: number = render(view);
