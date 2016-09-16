var assert = require('assert');
var NestedSetModel = require('./../nested-set-model');

var fixture = require('./fixture.json');
var customKeyFixture = require('./custom-keys.json');

describe('NestedSetModel', function() {
    describe('default configuration', function() {
        it('should properly recognize leaf nodes', function() {
            var model = new NestedSetModel(fixture);
            assert(!model.find({ title: 'root' }).isLeaf())
            assert(!model.find({ title: 'parent' }).isLeaf())
            assert(!model.find({ title: 'child', left: 3 }).isLeaf())
            assert(!model.find({ title: 'child', left: 4 }).isLeaf())
            assert(model.find({ title: 'middle' }).isLeaf());
            assert(model.find({ title: 'leaf' }).isLeaf());            
        });
        it('should properly recognize parent nodes', function() {
            var model = new NestedSetModel(fixture);
            assert(model.find({ title: 'root' }).isParent())
            assert(model.find({ title: 'parent' }).isParent())
            assert(model.find({ title: 'child', left: 3 }).isParent())
            assert(model.find({ title: 'child', left: 4 }).isParent())
            assert(!model.find({ title: 'middle' }).isParent());
            assert(!model.find({ title: 'leaf' }).isParent());            
        });
        it('should return the correct set of children', function() {
            var model = new NestedSetModel(fixture);
            assert.strictEqual(model.find({ title: 'root' }).children().length, 2);
            assert.strictEqual(model.find({ title: 'middle' }).children().length, 0);
            assert.strictEqual(model.find({ title: 'child', left: 3 }).children().length, 1);
            assert.strictEqual(model.find({ title: 'child', left: 4 }).children().length, 1);
            assert.strictEqual(model.find({ title: 'leaf' }).children().length, 0);
        });
        it('should return the correct set of descendants', function() {
            var model = new NestedSetModel(fixture);
            assert.strictEqual(model.find({ title: 'root' }).descendants().length, 5);
            assert.strictEqual(model.find({ title: 'middle' }).descendants().length, 0);
            assert.strictEqual(model.find({ title: 'child', left: 3 }).descendants().length, 2);
            assert.strictEqual(model.find({ title: 'child', left: 4 }).descendants().length, 1);
            assert.strictEqual(model.find({ title: 'leaf' }).descendants().length, 0);
        });
        it('should return the correct set of parents', function() {
            var model = new NestedSetModel(fixture);
            assert.strictEqual(model.find({ title: 'root' }).parents().length, 0);
            assert.strictEqual(model.find({ title: 'middle' }).parents().length, 1);
            assert.strictEqual(model.find({ title: 'child', left: 3 }).parents().length, 2);
            assert.strictEqual(model.find({ title: 'child', left: 4 }).parents().length, 3);
            assert.strictEqual(model.find({ title: 'leaf' }).parents().length, 4);
        });
    });
    describe('custom configuration', function() {
        it('should properly walk the tree using the given keys', function() {
            var model = new NestedSetModel(customKeyFixture, {left: 'lf', right: 'rg'});
            assert(!model.find({ title: 'child' }).isLeaf())
            assert(model.find({ title: 'leaf' }).isLeaf());
            assert(model.find({title: 'child' }).parents().length);
            assert(model.find({title: 'child' }).children().length);
            assert(model.find({title: 'child' }).descendants().length);
        });
    });
});
