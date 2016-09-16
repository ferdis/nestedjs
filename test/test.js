var assert = require('assert');
var NestedSetModel = require('./../nested-set-model');

var fixture = require('./fixture.json');
var customKeyFixture = require('./custom-keys.json');

describe('NestedSetModel', function() {
    describe('default configuration', function() {
        it('properly walks the tree', function() {
            var model = new NestedSetModel(fixture);
            assert(!model.find({ title: 'child', left: 3 }).isLeaf())
            assert(model.find({ title: 'child', left: 3 }).parents().length);
            assert(model.find({ title: 'child', left: 3 }).children().length);
            assert(model.find({ title: 'child', left: 3 }).descendants().length);
        });
    });
    describe('custom configuration', function() {
        it('properly walks the tree using the given keys', function() {
            var model = new NestedSetModel(customKeyFixture, {left: 'lf', right: 'rg'});
            assert(!model.find({ title: 'child', lf: 3}).isLeaf())
            assert(model.find({title: 'child', lf: 3}).parents().length);
            assert(model.find({title: 'child', lf: 3}).children().length);
            assert(model.find({title: 'child', lf: 3}).descendants().length);
        });
    });
});
