NestedJS
========

NestedJS is a lightweight library to implement the nested set model 
in JavaScript applications. 

The [Nested Sets Model](https://en.wikipedia.org/wiki/Nested_set_model)
is a technique used for representing hierarchical data as a tree-like data
structure.

Although very convienient and fast when implemented using a relational 
database system, it's troublesome to implement procedurally.

This library helps bridging the gap between back-end data structures
and front-end implementations. 

Example
----
Please refer to [example.js](example.js) for an example on usage.

This library is also available as an npm package:
```
npm install --save nestedjs
```

API
----
The library follows a DSL-like usage structure, whereby method chaining
is encouraged. Currently it provides methods to verify relationships,
retrieve relationships and to find a particular node in the tree
by matching meta data within nodes or co-ordinates.

Please see [API.md](API.md) for more information.

Requests
----
I highly encourage anybody using this library to suggest features
that will find useful, or features that are simply lacking.

Please either create a issue, or feel free to submit a pull request.

License
----
This project is licensed under the BSD 2-clause license.
See [LICENSE.md](LICENSE.md) for more information.
