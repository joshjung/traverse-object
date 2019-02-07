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
