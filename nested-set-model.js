// nested set model (l;r) parent search

var NestedSetModel = function(model, options) {

    options = options || {};
    this.leftKey = options.left || 'left';
    this.rightKey =  options.right || 'key';

    this.model = [];
    this.index = {};

    var self = this;

    // sort the set for deterministic order
    model.sort(function(a, b)
    {
        return a[self.leftKey] - b[self.leftKey];
    });

    // create an index
    for(var index in model) {
        if (!model.hasOwnProperty(index)) {
            continue;
        }

        this.index[model[index][this.rightKey]] = index;
    }

    for(var entry in model) {
        if (!model.hasOwnProperty(entry)) {
            continue;
        }

        var node = new NestedSetModelNode(model[entry], model, this.index);
        this.model.push(node);
    }

    return this;
}

NestedSetModel.prototype.compareNodes = function(a, b, strict) {
    var strict = strict || false;

    if (a === b) {
        return true;
    }

    var keys = [
        Object.keys(a),
        Object.keys(b)
    ];

    if (strict && keys[0].length !== keys[1].length) {
        return false;
    }

    for (var i = 0; i <= keys[1].length; i++) {
        var prop = keys[1][i];


        if (a[prop] !== b[prop]) {
            return false;
        }
    }

    if (!strict) {
        return true;
    }

    for (var prop in keys[0]) {
        if (b[prop] !== undefined && a[prop] !== b[prop]) {
            return false;
        }

        if (typeof a[prop] === 'object'
            && this.compareNodes(a[prop], b[prop], true) === false) {
            return false
        }
    }

    return true;
}

NestedSetModel.prototype.find = function(partial, strict) {
    for (var key in this.model) {
        if (!this.model.hasOwnProperty(key)) {
            continue;
        } else if (this.compareNodes(this.model[key], partial, strict)) {
            return new NestedSetModelNode(this.model[key], this.model, this.index);
        }
    }
}

var NestedSetModelNode = function(node, model, index) {
    this.model = model;
    this.index = index;

    var self = this;
    Object.keys(node).forEach(function(prop) {
        self[prop] = node[prop];
    });
}

NestedSetModelNode.prototype.parents = function() {
    var parents = [];
    var self = this;

    this.model.map(function(node) {
        if (self[self.model.leftKey] > node[self.model.leftKey] && self[self.model.rightKey] < node[self.model.rightKey]) {
            parents.push(new NestedSetModelNode(node, self.model, self.index));
        }
    });

    return parents;
}

NestedSetModelNode.prototype.descendants = function() {
    var descendants = [];
    var num_items = Math.floor((this.model.rightKey - this.model.leftKey) / 2);

    for(var right in this.index) {
        if (right < this.model.rightKey && right > this.model.leftKey) {
            var node = this.model[this.index[right]];
            descendants.push(new NestedSetModelNode(node, this.model, this.index));
        }
    }

    return descendants;
}

NestedSetModelNode.prototype.children = function() {
    var children = [];
    var right = this.model.rightKey - 1;

    while(true) {
        if (right === this.model.leftKey) {
            break;
        }

        var child = this.model[this.index[right]];
        children.push(new NestedSetModelNode(child, this.model, this.index));
        right = child.model.leftKey - 1;
    }

    return children.reverse();
}


NestedSetModelNode.prototype.isLeaf = function() {
    return this.model.rightKey - this.model.leftKey === 1;
}

NestedSetModelNode.prototype.isParent = function() {
    return !this.isLeaf();
}

NestedSetModelNode.prototype.isDescendant = function() {
    return this.model.leftKey > 0 && this.model.rightKey < (this.model.length * 2);
}

// bootstrap
if (typeof define !== 'undefined') {
	define('NestedSetModel', NestedSetModel);
} else if (typeof module !== 'undefined') {
    module.exports = NestedSetModel;
}

