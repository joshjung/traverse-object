traverse-object
===============

Traverse a Javascript object tree (assuming it is not cyclic) and call a callback for each found node.

In addition, you can filter all property paths (e.g. 'user.0.firstName') by an Array of `RegExp` or Strings
so that you only visit the nodes you care about.

Definition
==========

    traverse(object, callback, propertiesStrOrRegEx = undefined)
    
- `object` (required): any iterable (e.g. by `in`) Javascript `Object`.
- `callback` (required): a function to call on every matched property. Has signature `(obj, path, value)`. `obj`
  will be the immediate parent object of the match. `path` will be an `Array` of the full path to the current match.
  `value` will be the value of the matched property. Return `true` from the callback if you want to stop traversing.
- `propertiesOrStrOrRegEx` (optional): a filter for which properties to visit. A `String`, `RegExp`, or an `Array`
  of mixed Strings or RegExps. If you do not pass this argument, then every descendent property is visited and the
  callback will be called for all of them.

Property paths and `propertiesOrStrOrRegEx` Wildcards
=====================================================

While traversing the tree of objects, the current path is considered to be a `.`-delimited String. This String is
tested against the value(s) in `propertiesOrStrOrRegEx`, which can zero or more explicit `RegExp` instances or Strings.

Strings are converted to `RegExp` objects where the `*` character is considered a `.*`. For example the String
`'*firstName'` will be converted into `new RegExp(".*firstName")`. Regular expressions are cached between calls but
`lastIndex=0` is explicitly set before each test to ensure that there is not state leaking between calls.

For example, if you want to visit the tree for any property with a path that ends in `'firstName'` you could pass in
`'*firstName'`. If you want to visit the tree for all properties that have `'firstName'` anywhere in their path, you
can pass in `'*firstName*'`.

Simple Example
==============

    var traverse = require('traverse-object');

    let user = {
      firstName: 'Joshua',
      lastName: 'Jung',
      profession: {
        name: 'Software Engineer',
        contributions: ['trie-search', 'traverse-object']
      }
    };
    
    traverse(user, console.log); // Will output (obj, path, value) for each key in the tree


Advanced Example
================

Sanitize an object tree of all passwords and oauth tokens:

    var traverse = require('../index');

    let users = [
      { name: 'Josh', password: 'asdfasdf1234' },
      { name: 'Matej', token: 'testtest' },
      { name: 'Elisia', password: 'asdfasdf1234' },
      { name: 'Jonas' },
      { name: 'Lasse', password: 'asdfasdf1234' },
      { name: 'MyCorp LLC', oauth: { token: 'asdfasdf1234' } },
    ];
    
    let sanitizeCallback = (obj, path, value) => {
      delete obj[path[path.length - 1]];
    };
    
    traverse(users, sanitizeCallback, [/password/, '*token']);
    
    console.log(users);
    
    // [ { name: 'Josh' },
    //   { name: 'Matej' },
    //   { name: 'Elisia' },
    //   { name: 'Jonas' },
    //   { name: 'Lasse' },
    //   { name: 'MyCorp LLC', oauth: {} } ]


Testing
=======

    $ npm i -g mocha
    
    $ npm test
    
    ...
    
    16 passing (10ms)

License
=======

The MIT License (MIT)

Copyright (c) 2019 Joshua Jung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
