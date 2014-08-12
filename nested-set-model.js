// nested set model (l;r) parent search

var NestedSetModel = function(model) {
	this.model = [];
	
	for(var entry in model) {
		var node = new NestedSetModelNode(model[entry], this);
		this.model.push(node);
	}

	return this;
}

NestedSetModel.prototype.find = function(partial, strict) {
	var results = [];
	var strict = arguments.length === 2 ? strict : false;

	this.model.map(function(node) {
		for(var prop in Object.keys(partial)) {
			if (node[prop] == partial[prop]) {
				results.push(node);
			}
		}
	});

	return new NestedSetModel(results);
}

var NestedSetModelNode = function(node, model) {
	this.model = model;

	var self = this;
	Object.keys(node).forEach(function(v, k) {
		self[k] = v;
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
	return this.left - this.right === 1;
}

NestedSetModelNode.prototype.isParent = function() {
	return !this.isLeaf();
}

NestedSetModelNode.prototype.isChild = function() {
	return this.left > 0 && this.right < this.model.length;
}

var set = [
	{
		id: 1,
		title: 'root',
		left: 1,
		right: 6
		}, {
			id: 2,
			title: 'middle',
			left: 2,
			right: 5,
				}, {
					id: 3,
					title: 'last',
					left: 3, 
					right: 4
		}
	];


var model = new NestedSetModel(set);

console.log(
	model.find({ title: 'middle' })
);

