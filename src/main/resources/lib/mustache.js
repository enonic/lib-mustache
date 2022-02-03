/**
 * Mustache template related functions.
 *
 * @example
 * var mustacheLib = require('/lib/mustache');
 *
 * @module mustache
 */

var service = __.newBean('com.enonic.lib.mustache.MustacheService');

/**
 * This function renders a view using mustache.
 *
 * @example-ref examples/mustache/render.js
 *
 * @param view Location of the view. Use `resolve(..)` to resolve a view.
 * @param {object} model Model that is passed to the view.
 * @returns {string} The rendered output.
 */
exports.render = function (view, model) {
    var processor = service.newProcessor();
    processor.setView(view);
    processor.setModel(__.toScriptValue(model));
    return processor.process();
};
