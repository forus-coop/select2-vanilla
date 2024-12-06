QUnit.module('Dropdown - attachBody - dropdownParent option');

QUnit.test('can be a selector string', function (assert) {
    assert.expect(1);

    var Utils = window.require('select2/utils');
    var Options = window.require('select2/options');

    var Dropdown = window.require('select2/dropdown');
    var AttachBody = window.require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var select = document.createElement('select');
    var parent = document.createElement('div');
    parent.id = 'parent';

    document.getElementById('qunit-fixture').appendChild(parent);

    var dropdown = new DropdownAdapter(select, new Options({
        dropdownParent: 'parent'
    }));

    assert.equal(
        dropdown.dropdownParent,
        parent.id,
        'Should be parsed using the selector as a jQuery object'
    );
});

QUnit.test('can be a DOM element', function (assert) {
    assert.expect(1);

    var Utils = window.require('select2/utils');
    var Options = window.require('select2/options');

    var Dropdown = window.require('select2/dropdown');
    var AttachBody = window.require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var select = document.createElement('select');
    var parent = document.createElement('div');
    parent.id = 'parent';

    document.getElementById('qunit-fixture').appendChild(parent);

    var dropdown = new DropdownAdapter(select, new Options({
        dropdownParent: parent
    }));


    assert.equal(
        dropdown.dropdownParent,
        parent,
        'Should just take the passed in DOM element'
    );
});

QUnit.test('defaults to the document body', function (assert) {
    assert.expect(1);

    var Utils = window.require('select2/utils');
    var Options = window.require('select2/options');

    var Dropdown = window.require('select2/dropdown');
    var AttachBody = window.require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var select = document.createElement('select');

    var dropdown = new DropdownAdapter(select, new Options({}));

    assert.equal(
        dropdown.dropdownParent,
        document.body,
        'Should default to wrapping document.body'
    );
});
