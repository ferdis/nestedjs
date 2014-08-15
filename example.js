var NestedSetModel = require('./nested-set-model');

// An example input set
/*

             1 root 12
             /      \
        2 parent 9 10 middle 11
           /
       3 child 8
         /
      4 child 7
       /
   5 leaf 6

 */

var set = [
    {
        id: 1,
        title: 'root',
        left: 1,
        right: 12
    },
    {
        id: 4,
        title: 'child',
        left: 3,
        right: 8
    },
    {
        id: 2,
        title: 'parent',
        left: 2,
        right: 9,
    },
    {
        id: 3,
        title: 'middle',
        left: 10,
        right: 11
    },
    {
        id:5,
        title: 'child',
        left: 4,
        right: 7
    },
    {
        id:6,
        title: 'leaf',
        left: 5,
        right: 6
    }
];

var model = new NestedSetModel(set);

if (model.find({ title: 'child', left: 3}).isLeaf() === false) {
    console.info('SUCCESS: {title: "child", left: 3} is not a leaf node');
} else {
    console.error('FAIL: {title: "child", left: 3} is a leaf node, but shouldn\'t be');
}

console.log('It\'s parents:', model.find({title: 'child', left: 3}).parents());

console.log('It\'s children:', model.find({title: 'child', left: 3}).children());

console.log('It\'s descendants:', model.find({title: 'child', left: 3}).descendants());

