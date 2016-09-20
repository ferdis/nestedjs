// nested set model (l;r) parent search

var NestedSetModel = function(model, options) {
    
    var self = this;
    this.model = [];
    this.index = {};

    this.options = options || {};
    this.options.left = this.options.left || 'left'; 
    this.options.right = this.options.right || 'right'; 

    // sort the set for deterministic order
    model.sort(function(a, b)
    {
        return a[self.options.left] - b[self.options.left];
    });

    // create an index
    for(var index in model) {
        if (!model.hasOwnProperty(index)) {
            continue;
        }

        this.index[model[index][this.options.right]] = index;
    }

    for(var entry in model) {
        if (!model.hasOwnProperty(entry)) {
            continue;
        }

        var node = new NestedSetModelNode(model[entry], model, this.index, this.options);
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
            return new NestedSetModelNode(this.model[key], this.model, this.index, this.options);
        }
    }
}

var NestedSetModelNode = function(node, model, index, options) {
    this.model = model;
    this.index = index;
    this.options = options;

    var self = this;
    Object.keys(node).forEach(function(prop) {
        self[prop] = node[prop];
    });
}

NestedSetModelNode.prototype.parents = function() {

    var self = this;

    return this.model.map(function(node) {
        if (self[self.options.left] > node[self.options.left] && self[self.options.right] < node[self.options.right]) {
            return new NestedSetModelNode(node, self.model, self.index, self.options);
        }
        return null;
    }).filter(function(item) {
        return item !== null;
    });

}

NestedSetModelNode.prototype.descendants = function() {
    var descendants = [];
    var num_items = Math.floor((this[this.options.right] - this[this.options.left]) / 2);

    for(var right in this.index) {
        if (right < this[this.options.right] && right > this[this.options.left]) {
            var node = this.model[this.index[right]];
            descendants.push(new NestedSetModelNode(node, this.model, this.index, this.options));
        }
    }

    return descendants;
}

NestedSetModelNode.prototype.children = function() {
    var children = [];
    var right = this[this.options.right] - 1;

    while(true) {
        if (right === this[this.options.left]) {
            break;
        }

        var child = this.model[this.index[right]];
        children.push(new NestedSetModelNode(child, this.model, this.index, this.options));
        right = child[this.options.left] - 1;
    }

    return children.reverse();
}


NestedSetModelNode.prototype.isLeaf = function() {
    return this[this.options.right] - this[this.options.left] === 1;
}

NestedSetModelNode.prototype.isParent = function() {
    return !this.isLeaf();
}

NestedSetModelNode.prototype.isDescendant = function() {
    return this[this.options.left] > 0 && this[this.options.right] < (this.model.length * 2);
}

// bootstrap
if (typeof define !== 'undefined') {
    define('NestedSetModel', NestedSetModel);
} else if (typeof module !== 'undefined') {
    module.exports = NestedSetModel;
}
