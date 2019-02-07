const RegExpCache = {};

/**
 */
module.exports = function(obj, callback, propertiesStrOrRegEx) {
  var r;

  propertiesStrOrRegEx = propertiesStrOrRegEx || [];
  propertiesStrOrRegEx = Array.isArray(propertiesStrOrRegEx) ? propertiesStrOrRegEx : [propertiesStrOrRegEx];

  var propertiesRegExes = propertiesStrOrRegEx.map(function(p) {
    if (RegExpCache[p]) return RegExpCache[p];

    return RegExpCache[p] = ((typeof p === 'string') ? new RegExp('^' + p.replace('*', '.*') + '$') : p);
  });

  return iterate(obj, []);

  function pathMatch(pathArr) {
    if (!propertiesRegExes.length)
      return true;

    var pathStr = pathArr.join('.');

    return !!propertiesRegExes.find(p => {
      p.lastIndex = 0; // https://stackoverflow.com/questions/11477415/why-does-javascripts-regex-exec-not-always-return-the-same-value
      return p.test(pathStr);
    });
  }

  function iterate(object, path) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        var chainedPath = [...path, key];

        if (pathMatch(chainedPath)) {

          r = callback(object, chainedPath, object[key]);

          if (r === true) {
            return true;
          }
        }

        if (typeof object[key] === 'object') {
          r = iterate(object[key], chainedPath);

          if (r === true) {
            return true;
          }
        }
      }
    }

    return false;
  }
};
