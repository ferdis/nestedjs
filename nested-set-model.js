// nested set model (l;r) parent search

var NestedSetModel = function(model) {
	this.model = [];

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
	var self = this;

	this.model.map(function(node) {
		if (self.left < node.left && self.right > node.right) {
			children.push(node);
		}
	});

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

// An example input set
/*

			 root
			/   \
	     middle  parent
	      /
	    last

 */

var set = [
	{
		id: 1,
		title: 'root',
		left: 1,
		right: 8
	},
	{
		id: 2,
		title: 'middle',
		left: 2,
		right: 5,
	},
	{
		id: 4,
		title: 'last',
		left: 3,
		right: 4
	},
	{
		id: 3,
		title: 'parent',
		left: 6,
		right: 7
	}
];

var model = new NestedSetModel(set);

if (model.find({ title: 'middle'}).isLeaf() === false) {
	console.info('SUCCESS: {title: "middle"} is not a leaf node');
} else {
	console.error('FAIL: {title: "middle"} is a leaf node, but shouldn\'t be');
}

console.log('It\'s parents:', model.find({title: 'middle'}).parents());

console.log('It\'s childrne:', model.find({title: 'middle'}).children());

