/**
 * Mustache template library for Enonic XP.
 *
 * Renders a view resolved from the application's resources against a model, using the
 * [Mustache](http://mustache.github.io/) templating language. Targets XP 8+.
 *
 * ```js
 * var mustacheLib = require('/lib/mustache');
 *
 * var view = resolve('view/fruit.html');
 * var result = mustacheLib.render(view, {
 *     fruits: [
 *         { name: 'Apple', color: 'Red' },
 *         { name: 'Pear', color: 'Green' },
 *     ],
 * });
 * ```
 *
 * @module /lib/mustache
 */
import type { ResourceKey } from '@enonic-types/core';
declare global {
    interface XpLibraries {
        '/lib/mustache': typeof import('./mustache');
    }
}
/**
 * Renders a view using Mustache.
 *
 * @param view - Location of the view. Use `resolve(...)` to resolve a view.
 * @param model - Model that is passed to the view. Omitted or `undefined` renders against an
 *   empty model rather than failing.
 * @returns The rendered output.
 */
export declare function render(view: ResourceKey, model?: object): string;
