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

QUnit.module('Dropdown - attachBody - positioning');

QUnit.test('appends to the dropdown parent', function (assert) {
    assert.expect(4);

    var Utils = window.require('select2/utils');
    var Options = window.require('select2/options');

    var Dropdown = window.require('select2/dropdown');
    var AttachBody = window.require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var select = document.createElement('select');
    var parent = document.createElement('div');

    var containerElement = document.createElement('span');
    var container = new MockContainer();

    document.getElementById('qunit-fixture').appendChild(parent);
    parent.appendChild(select);

    var dropdown = new DropdownAdapter(select, new Options({
        dropdownParent: parent
    }));

    assert.equal(
        parent.children.length,
        1,
        'Only the select should be in the container'
    );

    var dropdownElement = dropdown.render();

    dropdown.bind(container, containerElement);

    dropdown.position(dropdownElement, containerElement);

    assert.equal(
        parent.children.length,
        1,
        'The dropdown should not be placed until after it is opened'
    );

    dropdown._showDropdown();

    assert.equal(
        parent.children.length,
        2,
        'The dropdown should now be in the container as well'
    );

    assert.ok(
        parent.contains(dropdownElement),
        'The dropdown should be contained within the parent container'
    );
});

QUnit.test('dropdown is positioned down with static margins', function (assert) {
    var select = document.createElement('select');
    var parent = document.createElement('div');
    parent.style.position = 'static';
    parent.style.marginTop = '5px';
    parent.style.marginLeft = '10px';

    var containerElement = document.createElement('span');
    containerElement.textContent = 'test';
    var container = new MockContainer();

    document.getElementById('qunit-fixture').innerHTML = '';

    document.getElementById('qunit-fixture').appendChild(parent);
    parent.appendChild(containerElement);

    var Utils = window.require('select2/utils');
    var Options = window.require('select2/options');

    var Dropdown = window.require('select2/dropdown');
    var AttachBody = window.require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter(select, new Options({
        dropdownParent: parent
    }));
    var dropdownElement = dropdown.render();

    assert.equal(
        dropdownElement.firstChild.style.top,
        '',
        'The dropdown should not have any offset before it is displayed'
    );

    dropdown.bind(container, containerElement);
    dropdown.position(dropdownElement, containerElement);
    dropdown._showDropdown();
    assert.ok(
        dropdownElement.firstChild.classList.contains('select2-dropdown--below'),
        'The dropdown should be forced down'
    );


    assert.equal(
        dropdownElement.style.left,
        '10px',
        'The offset should be 10px on the left'
    );
});

QUnit.test('dropdown is positioned down with absolute offsets', function (assert) {
    var select = document.createElement('select');
    var parent = document.createElement('div');
    parent.style.position = 'absolute';
    parent.style.top = '10px';
    parent.style.left = '5px';

    var containerElement = document.createElement('span');
    containerElement.textContent = 'test';
    var container = new MockContainer();

    document.getElementById('qunit-fixture').appendChild(parent);
    parent.appendChild(containerElement);

    var Utils = window.require('select2/utils');
    var Options = window.require('select2/options');

    var Dropdown = window.require('select2/dropdown');
    var AttachBody = window.require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter(select, new Options({
        dropdownParent: parent
    }));

    var dropdownElement = dropdown.render();

    assert.equal(
        dropdownElement.firstChild.style.top,
        '',
        'The dropdown should not have any offset before it is displayed'
    );

    dropdown.bind(container, containerElement);
    dropdown.position(dropdownElement, containerElement);
    dropdown._showDropdown();

    assert.ok(
        dropdownElement.firstChild.classList.contains('select2-dropdown--below'),
        'The dropdown should be forced down'
    );



    assert.equal(
        dropdownElement.style.left,
        '0px',
        'There should not be an extra left offset'
    );
});

QUnit.test('dropdown is positioned even when not in document', function (assert) {
    var select = document.createElement('select');

    var containerElement = document.createElement('span');
    containerElement.textContent = 'test';
    var container = new MockContainer();

    var Utils = window.require('select2/utils');
    var Options = window.require('select2/options');

    var Dropdown = window.require('select2/dropdown');
    var AttachBody = window.require('select2/dropdown/attachBody');

    var DropdownAdapter = Utils.Decorate(Dropdown, AttachBody);

    var dropdown = new DropdownAdapter(select, new Options({
        dropdownParent: document.documentElement
    }));

    var dropdownElement = dropdown.render();

    assert.equal(
        dropdownElement.firstChild.style.top,
        '',
        'The dropdown should not have any offset before it is displayed'
    );

    dropdown.bind(container, containerElement);
    dropdown.position(dropdownElement, containerElement);
    dropdown._showDropdown();

    assert.ok(
        dropdownElement.firstChild.classList.contains('select2-dropdown--below'),
        'The dropdown should be forced down'
    );

    assert.equal(
        dropdownElement.style.top,
        '0px',
        'The offset should be 0px at the top'
    );

    assert.equal(
        dropdownElement.style.left,
        '0px',
        'The offset should be 0px on the left'
    );
});
