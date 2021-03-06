var arr = [];
var each = arr.forEach;
var slice = arr.slice;

module.exports.extend = function(obj) {
  each.call(slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

module.exports.processArgs = function(opts, callback, defaultOpts) {
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = null;
  }
  return {
    callback: callback,
    opts: module.exports.extend({}, defaultOpts, opts)
  };
};


/**
 * Parse the given repo tag name (as a string) and break it out into repo/tag pair.
 * // if given the input http://localhost:8080/woot:latest
 * {
 *   repository: 'http://localhost:8080/woot',
 *   tag: 'latest'
 * }
 * @param {String} input Input e.g: 'repo/foo', 'ubuntu', 'ubuntu:latest'
 * @return {Object} input parsed into the repo and tag.
 */
module.exports.parseRepositoryTag = function(input) {
  var separatorPos;
  var digestPos = input.indexOf('@');
  var colonPos = input.lastIndexOf(':');
  // @ symbol is more important
  if (digestPos >= 0) {
    separatorPos = digestPos;
  } else if (colonPos >= 0) {
    separatorPos = colonPos;
  } else {
    // no colon nor @
    return {
      repository: input
    };
  }

  // last colon is either the tag (or part of a port designation)
  var tag = input.slice(separatorPos + 1);

  // if it contains a / its not a tag and is part of the url
  if (tag.indexOf('/') === -1) {
    return {
      repository: input.slice(0, separatorPos),
      tag: tag
    };
  }

  return {
    repository: input
  };
};