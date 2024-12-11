var Utils = window.require('select2/utils');

QUnit.module('Utils - GetUniqueElementId');

QUnit.test('Adds a prefix to the existing ID if one exists', function (assert) {
    var element = document.createElement('select');
    element.id = 'existing-id';

    var id = Utils.GetUniqueElementId(element);

    assert.notEqual(id, 'existing-id');
    assert.notEqual(id.indexOf('existing-id'), -1);
});

QUnit.test('Generated random ID is not a number', function (assert) {
    var element = document.createElement('select');

    var id = Utils.GetUniqueElementId(element);

    assert.ok(isNaN(id));
});

QUnit.module('Utils - RemoveData');

QUnit.test('The data-select2-id attribute is removed', function (assert) {
    var element = document.createElement('select');
    element.setAttribute('data-select2-id', 'test');

    Utils.RemoveData(element);

    assert.notEqual(
        element.getAttribute('data-select2-id'),
        'test',
        'The internal attribute was not removed when the data was cleared'
    );
});

QUnit.test('The internal cache for the element is cleared', function (assert) {
    var element = document.createElement('select');
    element.setAttribute('data-select2-id', 'test');

    Utils.__cache.test = {
        'foo': 'bar'
    };

    Utils.RemoveData(element);

    assert.equal(Utils.__cache.test, null, 'The cache should now be empty');
});

QUnit.test('Calling it on an element without data works', function (assert) {
    assert.expect(0);

    var element = document.createElement('select');

    Utils.RemoveData(element);
});
