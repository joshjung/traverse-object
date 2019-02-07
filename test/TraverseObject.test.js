var assert = require('assert'),
  traverse = require('../index');

describe('TraverseObject', function() {
  describe('callback should work', function() {
    it('callback {a}', () => {
      let obj = {
        a: 1
      };

      traverse(obj, (obj, path, value) => {
        assert.equal(obj, obj);
        assert.equal(path.join('.'), 'a');
        assert.equal(value, 1);
      });
    });

    it('callback {a, b}', () => {
      let obj = {
        a: 1,
        b: 2
      };

      let expected = ['a', 'b'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('')));

      assert.equal(actual.join(''), expected.join(''));
    });

    it('callback [{a}, {b}]', () => {
      let obj = [
        {a: 1},
        {b: 2}
      ];

      let expected = ['0', '0.a', '1', '1.b'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('.')));

      assert.equal(actual.join(':'), expected.join(':'));
    });
  });

  describe('search properties should work', function() {
    it('callback {a} search \'a\'', () => {
      let obj = {
        a: 1
      };

      traverse(obj, (obj, path, value) => {
        assert.equal(obj, obj);
        assert.equal(path.join('.'), 'a');
        assert.equal(value, 1);
      }, 'a');
    });

    it('callback {a} search \'b\'', done => {
      let obj = {
        a: 1
      };

      traverse(obj, (obj, path, value) => {
        done('Should not have been called');
      }, 'b');

      done();
    });

    it('callback {a, b} search \'a\'', done => {
      let obj = {
        a: 1,
        b: 2
      };

      traverse(obj, (obj, path, value) => {
        if (path.join('') === 'b') {
          done('Should not have been called');
        }
      }, 'a');

      done();
    });

    it('callback {a, b: {a}} search \'a\'', () => {
      let obj = {
        a: 1,
        b: {
          a: 2
        }
      };

      let expected = ['a'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('.')), 'a');
      assert.equal(actual.join(':'), expected.join(':'));
    });

    it('callback {a, b: {a}} search \'*a\'', () => {
      let obj = {
        a: 1,
        b: {
          a: 2
        }
      };

      let expected = ['a', 'b.a'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('.')), '*a');

      assert.equal(actual.join(':'), expected.join(':'));
    });

    it('callback {a, b: [{a}. {c}]} search \'*a\'', () => {
      let obj = {
        a: 1,
        b: [
          { a: 2 },
          { c: 3 }
        ]
      };

      let expected = ['a', 'b.0.a'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('.')), '*a');

      assert.equal(actual.join(':'), expected.join(':'));
    });

    it('callback {a, b: [{a}. {c}]} search \'/a/\'', () => {
      let obj = {
        a: 1,
        b: [
          { a: 2 },
          { c: 3 }
        ]
      };

      let expected = ['a', 'b.0.a'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('.')), /a/);

      assert.equal(actual.join(':'), expected.join(':'));
    });

    it('callback {a, b: [{a}. {c}]} search \'/^a/\'', () => {
      let obj = {
        a: 1,
        b: [
          { a: 2 },
          { c: 3 }
        ]
      };

      let expected = ['a'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('.')), /^a/);

      assert.equal(actual.join(':'), expected.join(':'));
    });

    it('callback {a, b: [{a}. {c}]} search \'/c$/\'', () => {
      let obj = {
        a: 1,
        b: [
          { a: 2 },
          { c: 3 }
        ]
      };

      let expected = ['b.1.c'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('.')), /c$/);

      assert.equal(actual.join(':'), expected.join(':'));
    });

    it('callback {a, b: [{a}. {c}]} search [/c$/, /a/]', () => {
      let obj = {
        a: 1,
        b: [
          { a: 2 },
          { c: 3 },
          { d: 4 }
        ]
      };

      let expected = ['a', 'b.0.a', 'b.1.c'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('.')), [/c$/, /a/]);

      assert.equal(actual.join(':'), expected.join(':'));
    });

    it('callback {a, b: [{a}. {c}]} search [/c$/, \'a\']', () => {
      let obj = {
        a: 1,
        b: [
          { a: 2 },
          { c: 3 },
          { d: 4 }
        ]
      };

      let expected = ['a', 'b.1.c'];
      let actual = [];

      traverse(obj, (obj, path, value) => actual.push(path.join('.')), [/c$/, 'a']);

      assert.equal(actual.join(':'), expected.join(':'));
    });
  });

  describe('search properties should work', function() {
    it('callback cancellation {a, b: [{a}. {c}]} search \'/a/\' cancel on first find', () => {
      let obj = {
        a: 1,
        b: [
          { a: 2 },
          { c: 3 },
          { a: 4 }
        ]
      };

      let expected = ['a'];
      let actual = [];

      traverse(obj, (obj, path, value) => {
        actual.push(path.join('.'));
        return true;
      }, /a/);

      assert.equal(actual.join(':'), expected.join(':'));
    });

    it('callback cancellation {a, b: [{a}. {c}]} search \'/a/\' cancel on second find', () => {
      let obj = {
        a: 1,
        b: [
          { a: 2 },
          { c: 3 },
          { a: 4 }
        ]
      };

      let expected = ['a', 'b.0.a'];
      let actual = [];

      traverse(obj, (obj, path, value) => {
        actual.push(path.join('.'));
        if (path.join('.') === 'b.0.a') {
          assert.equal(value, 2);
          return true;
        }
      }, /a/);

      assert.equal(actual.join(':'), expected.join(':'));
    });
  });
});
