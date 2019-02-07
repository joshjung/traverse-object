var traverse = require('../index');

let user = {
  firstName: 'Joshua',
  lastName: 'Jung',
  profession: {
    name: 'Software Engineer',
    contributions: ['trie-search', 'traverse-object']
  }
};

traverse(user, console.log); // Will output (obj, path, value) for each key in the tree
