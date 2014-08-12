// nested set model (l;r) parent search

var NestedSetModel = function(model) {
    this.model = [];

    // sort the set for deterministic order
    model.sort(function(a, b)
    {
    	return a.left > b.left;
    });

    for(var entry in model) {
        if (!model.hasOwnProperty(entry)) {
            continue;
        }

        var node = new NestedSetModelNode(model[entry], model);
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
            return this.model[key];
        }
    }
}

var NestedSetModelNode = function(node, model) {
    this.model = model;

    var self = this;
    Object.keys(node).forEach(function(prop) {
        self[prop] = node[prop];
    });
}

NestedSetModelNode.prototype.parents = function() {
    var parents = [];
    var self = this;

    this.model.map(function(node) {
        if (self.left > node.left && self.right < node.right) {
            parents.push(node);
        }
    });

    return parents;
}

NestedSetModelNode.prototype.children = function() {
    var children = [];
    var num_items = Math.floor((this.right - this.left) / 2);

    // model has been sorted by left ascending, we can determine
    // amount of children for this node, and optimize the lookup.
    for (var i = this.left; i <= ((this.left + num_items) - 1); i++) {
    	var node = this.model[i];
        children.push(node);
    }

    return children;
}


NestedSetModelNode.prototype.isLeaf = function() {
    return this.right - this.left === 1;
}

NestedSetModelNode.prototype.isParent = function() {
    return !this.isLeaf();
}

NestedSetModelNode.prototype.isChild = function() {
    return this.left > 0 && this.right < (this.model.length * 2);
}

// bootstrap
if (typeof define !== 'undefined') {
	define('NestedSetModel', NestedSetModel);
} 

module.exports = NestedSetModel;
