var mustache = require('/lib/mustache');

function assertHtmlEquals(res, actual) {
    testInstance.assertHtmlEquals(resolve(res), actual);
}

exports.testRender = function () {
    var view = resolve('view/test.html');
    var result = mustache.render(view, {
            fruits: [
                {
                    name: 'Apple',
                    color: 'Red'
                },
                {
                    name: 'Pear',
                    color: 'Green'
                }
            ]
        }
    );

    assertHtmlEquals('view/test-result.html', result);
};

exports.testExamples = function () {
    testInstance.runScript('/lib/examples/mustache/render.js')
};


exports.testLambda = function () {
    const view = resolve('view/lambda.html');
    const result = mustache.render(view, {
            name: "Willy",
            wrapped() {
                return function(text, render) {
                    return "<b>" + render(text) + "</b>"
                }
            }
        }
    );

    assertHtmlEquals('view/lambda-result.html', result);
};
