'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _toArray(arr) {return Array.isArray(arr) ? arr : Array.from(arr);}

function checkImports(imported, context) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = imported.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var _ref = _step.value;var _ref2 = _slicedToArray(_ref, 2);var _module = _ref2[0];var nodes = _ref2[1];
      if (nodes.length > 1) {
        var message = '\'' + String(_module) + '\' imported multiple times.';var _nodes = _toArray(
        nodes),first = _nodes[0],rest = _nodes.slice(1);
        var sourceCode = context.getSourceCode();
        var fix = getFix(first, rest, sourceCode);

        context.report({
          node: first.source,
          message: message,
          fix: fix // Attach the autofix (if any) to the first import.
        });var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

          for (var _iterator2 = rest[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var node = _step2.value;
            context.report({
              node: node.source,
              message: message });

          }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
}

function getFix(first, rest, sourceCode) {
  // Sorry ESLint <= 3 users, no autofix for you. Autofixing duplicate imports
  // requires multiple `fixer.whatever()` calls in the `fix`: We both need to
  // update the first one, and remove the rest. Support for multiple
  // `fixer.whatever()` in a single `fix` was added in ESLint 4.1.
  // `sourceCode.getCommentsBefore` was added in 4.0, so that's an easy thing to
  // check for.
  if (typeof sourceCode.getCommentsBefore !== 'function') {
    return undefined;
  }

  // Adjusting the first import might make it multiline, which could break
  // `eslint-disable-next-line` comments and similar, so bail if the first
  // import has comments. Also, if the first import is `import * as ns from
  // './foo'` there's nothing we can do.
  if (hasProblematicComments(first, sourceCode) || hasNamespace(first)) {
    return undefined;
  }

  var defaultImportNames = new Set(
  [first].concat(_toConsumableArray(rest)).map(getDefaultImportName).filter(Boolean));


  // Bail if there are multiple different default import names – it's up to the
  // user to choose which one to keep.
  if (defaultImportNames.size > 1) {
    return undefined;
  }

  // Leave it to the user to handle comments. Also skip `import * as ns from
  // './foo'` imports, since they cannot be merged into another import.
  var restWithoutComments = rest.filter(function (node) {return !(
    hasProblematicComments(node, sourceCode) ||
    hasNamespace(node));});


  var specifiers = restWithoutComments.
  map(function (node) {
    var tokens = sourceCode.getTokens(node);
    var openBrace = tokens.find(function (token) {return isPunctuator(token, '{');});
    var closeBrace = tokens.find(function (token) {return isPunctuator(token, '}');});

    if (openBrace == null || closeBrace == null) {
      return undefined;
    }

    return {
      importNode: node,
      text: sourceCode.text.slice(openBrace.range[1], closeBrace.range[0]),
      hasTrailingComma: isPunctuator(sourceCode.getTokenBefore(closeBrace), ','),
      isEmpty: !hasSpecifiers(node) };

  }).
  filter(Boolean);

  var unnecessaryImports = restWithoutComments.filter(function (node) {return (
      !hasSpecifiers(node) &&
      !hasNamespace(node) &&
      !specifiers.some(function (specifier) {return specifier.importNode === node;}));});


  var shouldAddDefault = getDefaultImportName(first) == null && defaultImportNames.size === 1;
  var shouldAddSpecifiers = specifiers.length > 0;
  var shouldRemoveUnnecessary = unnecessaryImports.length > 0;

  if (!(shouldAddDefault || shouldAddSpecifiers || shouldRemoveUnnecessary)) {
    return undefined;
  }

  return function (fixer) {
    var tokens = sourceCode.getTokens(first);
    var openBrace = tokens.find(function (token) {return isPunctuator(token, '{');});
    var closeBrace = tokens.find(function (token) {return isPunctuator(token, '}');});
    var firstToken = sourceCode.getFirstToken(first);var _defaultImportNames = _slicedToArray(
    defaultImportNames, 1),defaultImportName = _defaultImportNames[0];

    var firstHasTrailingComma =
    closeBrace != null &&
    isPunctuator(sourceCode.getTokenBefore(closeBrace), ',');
    var firstIsEmpty = !hasSpecifiers(first);var _specifiers$reduce =

    specifiers.reduce(
    function (_ref3, specifier) {var _ref4 = _slicedToArray(_ref3, 2),result = _ref4[0],needsComma = _ref4[1];
      return [
      needsComma && !specifier.isEmpty ? String(
      result) + ',' + String(specifier.text) : '' + String(
      result) + String(specifier.text),
      specifier.isEmpty ? needsComma : true];

    },
    ['', !firstHasTrailingComma && !firstIsEmpty]),_specifiers$reduce2 = _slicedToArray(_specifiers$reduce, 1),specifiersText = _specifiers$reduce2[0];


    var fixes = [];

    if (shouldAddDefault && openBrace == null && shouldAddSpecifiers) {
      // `import './foo'` → `import def, {...} from './foo'`
      fixes.push(
      fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ', {' + String(specifiersText) + '} from'));

    } else if (shouldAddDefault && openBrace == null && !shouldAddSpecifiers) {
      // `import './foo'` → `import def from './foo'`
      fixes.push(fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ' from'));
    } else if (shouldAddDefault && openBrace != null && closeBrace != null) {
      // `import {...} from './foo'` → `import def, {...} from './foo'`
      fixes.push(fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ','));
      if (shouldAddSpecifiers) {
        // `import def, {...} from './foo'` → `import def, {..., ...} from './foo'`
        fixes.push(fixer.insertTextBefore(closeBrace, specifiersText));
      }
    } else if (!shouldAddDefault && openBrace == null && shouldAddSpecifiers) {
      if (first.specifiers.length === 0) {
        // `import './foo'` → `import {...} from './foo'`
        fixes.push(fixer.insertTextAfter(firstToken, ' {' + String(specifiersText) + '} from'));
      } else {
        // `import def from './foo'` → `import def, {...} from './foo'`
        fixes.push(fixer.insertTextAfter(first.specifiers[0], ', {' + String(specifiersText) + '}'));
      }
    } else if (!shouldAddDefault && openBrace != null && closeBrace != null) {
      // `import {...} './foo'` → `import {..., ...} from './foo'`
      fixes.push(fixer.insertTextBefore(closeBrace, specifiersText));
    }

    // Remove imports whose specifiers have been moved into the first import.
    var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = specifiers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var specifier = _step3.value;
        var importNode = specifier.importNode;
        fixes.push(fixer.remove(importNode));

        var charAfterImportRange = [importNode.range[1], importNode.range[1] + 1];
        var charAfterImport = sourceCode.text.substring(charAfterImportRange[0], charAfterImportRange[1]);
        if (charAfterImport === '\n') {
          fixes.push(fixer.removeRange(charAfterImportRange));
        }
      }

      // Remove imports whose default import has been moved to the first import,
      // and side-effect-only imports that are unnecessary due to the first
      // import.
    } catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {for (var _iterator4 = unnecessaryImports[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var node = _step4.value;
        fixes.push(fixer.remove(node));

        var charAfterImportRange = [node.range[1], node.range[1] + 1];
        var charAfterImport = sourceCode.text.substring(charAfterImportRange[0], charAfterImportRange[1]);
        if (charAfterImport === '\n') {
          fixes.push(fixer.removeRange(charAfterImportRange));
        }
      }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4['return']) {_iterator4['return']();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}

    return fixes;
  };
}

function isPunctuator(node, value) {
  return node.type === 'Punctuator' && node.value === value;
}

// Get the name of the default import of `node`, if any.
function getDefaultImportName(node) {
  var defaultSpecifier = node.specifiers.
  find(function (specifier) {return specifier.type === 'ImportDefaultSpecifier';});
  return defaultSpecifier != null ? defaultSpecifier.local.name : undefined;
}

// Checks whether `node` has a namespace import.
function hasNamespace(node) {
  var specifiers = node.specifiers.
  filter(function (specifier) {return specifier.type === 'ImportNamespaceSpecifier';});
  return specifiers.length > 0;
}

// Checks whether `node` has any non-default specifiers.
function hasSpecifiers(node) {
  var specifiers = node.specifiers.
  filter(function (specifier) {return specifier.type === 'ImportSpecifier';});
  return specifiers.length > 0;
}

// It's not obvious what the user wants to do with comments associated with
// duplicate imports, so skip imports with comments when autofixing.
function hasProblematicComments(node, sourceCode) {
  return (
    hasCommentBefore(node, sourceCode) ||
    hasCommentAfter(node, sourceCode) ||
    hasCommentInsideNonSpecifiers(node, sourceCode));

}

// Checks whether `node` has a comment (that ends) on the previous line or on
// the same line as `node` (starts).
function hasCommentBefore(node, sourceCode) {
  return sourceCode.getCommentsBefore(node).
  some(function (comment) {return comment.loc.end.line >= node.loc.start.line - 1;});
}

// Checks whether `node` has a comment (that starts) on the same line as `node`
// (ends).
function hasCommentAfter(node, sourceCode) {
  return sourceCode.getCommentsAfter(node).
  some(function (comment) {return comment.loc.start.line === node.loc.end.line;});
}

// Checks whether `node` has any comments _inside,_ except inside the `{...}`
// part (if any).
function hasCommentInsideNonSpecifiers(node, sourceCode) {
  var tokens = sourceCode.getTokens(node);
  var openBraceIndex = tokens.findIndex(function (token) {return isPunctuator(token, '{');});
  var closeBraceIndex = tokens.findIndex(function (token) {return isPunctuator(token, '}');});
  // Slice away the first token, since we're no looking for comments _before_
  // `node` (only inside). If there's a `{...}` part, look for comments before
  // the `{`, but not before the `}` (hence the `+1`s).
  var someTokens = openBraceIndex >= 0 && closeBraceIndex >= 0 ?
  tokens.slice(1, openBraceIndex + 1).concat(tokens.slice(closeBraceIndex + 1)) :
  tokens.slice(1);
  return someTokens.some(function (token) {return sourceCode.getCommentsBefore(token).length > 0;});
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2['default'])('no-duplicates') },

    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        considerQueryString: {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      // Prepare the resolver from options.
      var considerQueryStringOption = context.options[0] &&
      context.options[0]['considerQueryString'];
      var defaultResolver = function () {function defaultResolver(sourcePath) {return (0, _resolve2['default'])(sourcePath, context) || sourcePath;}return defaultResolver;}();
      var resolver = considerQueryStringOption ? function (sourcePath) {
        var parts = sourcePath.match(/^([^?]*)\?(.*)$/);
        if (!parts) {
          return defaultResolver(sourcePath);
        }
        return defaultResolver(parts[1]) + '?' + parts[2];
      } : defaultResolver;

      var imported = new Map();
      var nsImported = new Map();
      var defaultTypesImported = new Map();
      var namedTypesImported = new Map();

      function getImportMap(n) {
        if (n.importKind === 'type') {
          return n.specifiers.length > 0 && n.specifiers[0].type === 'ImportDefaultSpecifier' ? defaultTypesImported : namedTypesImported;
        }

        return hasNamespace(n) ? nsImported : imported;
      }

      return {
        ImportDeclaration: function () {function ImportDeclaration(n) {
            // resolved path will cover aliased duplicates
            var resolvedPath = resolver(n.source.value);
            var importMap = getImportMap(n);

            if (importMap.has(resolvedPath)) {
              importMap.get(resolvedPath).push(n);
            } else {
              importMap.set(resolvedPath, [n]);
            }
          }return ImportDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {
            checkImports(imported, context);
            checkImports(nsImported, context);
            checkImports(defaultTypesImported, context);
            checkImports(namedTypesImported, context);
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kdXBsaWNhdGVzLmpzIl0sIm5hbWVzIjpbImNoZWNrSW1wb3J0cyIsImltcG9ydGVkIiwiY29udGV4dCIsImVudHJpZXMiLCJtb2R1bGUiLCJub2RlcyIsImxlbmd0aCIsIm1lc3NhZ2UiLCJmaXJzdCIsInJlc3QiLCJzb3VyY2VDb2RlIiwiZ2V0U291cmNlQ29kZSIsImZpeCIsImdldEZpeCIsInJlcG9ydCIsIm5vZGUiLCJzb3VyY2UiLCJnZXRDb21tZW50c0JlZm9yZSIsInVuZGVmaW5lZCIsImhhc1Byb2JsZW1hdGljQ29tbWVudHMiLCJoYXNOYW1lc3BhY2UiLCJkZWZhdWx0SW1wb3J0TmFtZXMiLCJTZXQiLCJtYXAiLCJnZXREZWZhdWx0SW1wb3J0TmFtZSIsImZpbHRlciIsIkJvb2xlYW4iLCJzaXplIiwicmVzdFdpdGhvdXRDb21tZW50cyIsInNwZWNpZmllcnMiLCJ0b2tlbnMiLCJnZXRUb2tlbnMiLCJvcGVuQnJhY2UiLCJmaW5kIiwiaXNQdW5jdHVhdG9yIiwidG9rZW4iLCJjbG9zZUJyYWNlIiwiaW1wb3J0Tm9kZSIsInRleHQiLCJzbGljZSIsInJhbmdlIiwiaGFzVHJhaWxpbmdDb21tYSIsImdldFRva2VuQmVmb3JlIiwiaXNFbXB0eSIsImhhc1NwZWNpZmllcnMiLCJ1bm5lY2Vzc2FyeUltcG9ydHMiLCJzb21lIiwic3BlY2lmaWVyIiwic2hvdWxkQWRkRGVmYXVsdCIsInNob3VsZEFkZFNwZWNpZmllcnMiLCJzaG91bGRSZW1vdmVVbm5lY2Vzc2FyeSIsImZpcnN0VG9rZW4iLCJnZXRGaXJzdFRva2VuIiwiZGVmYXVsdEltcG9ydE5hbWUiLCJmaXJzdEhhc1RyYWlsaW5nQ29tbWEiLCJmaXJzdElzRW1wdHkiLCJyZWR1Y2UiLCJyZXN1bHQiLCJuZWVkc0NvbW1hIiwic3BlY2lmaWVyc1RleHQiLCJmaXhlcyIsInB1c2giLCJmaXhlciIsImluc2VydFRleHRBZnRlciIsImluc2VydFRleHRCZWZvcmUiLCJyZW1vdmUiLCJjaGFyQWZ0ZXJJbXBvcnRSYW5nZSIsImNoYXJBZnRlckltcG9ydCIsInN1YnN0cmluZyIsInJlbW92ZVJhbmdlIiwidmFsdWUiLCJ0eXBlIiwiZGVmYXVsdFNwZWNpZmllciIsImxvY2FsIiwibmFtZSIsImhhc0NvbW1lbnRCZWZvcmUiLCJoYXNDb21tZW50QWZ0ZXIiLCJoYXNDb21tZW50SW5zaWRlTm9uU3BlY2lmaWVycyIsImNvbW1lbnQiLCJsb2MiLCJlbmQiLCJsaW5lIiwic3RhcnQiLCJnZXRDb21tZW50c0FmdGVyIiwib3BlbkJyYWNlSW5kZXgiLCJmaW5kSW5kZXgiLCJjbG9zZUJyYWNlSW5kZXgiLCJzb21lVG9rZW5zIiwiY29uY2F0IiwiZXhwb3J0cyIsIm1ldGEiLCJkb2NzIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJjb25zaWRlclF1ZXJ5U3RyaW5nIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjcmVhdGUiLCJjb25zaWRlclF1ZXJ5U3RyaW5nT3B0aW9uIiwib3B0aW9ucyIsImRlZmF1bHRSZXNvbHZlciIsInNvdXJjZVBhdGgiLCJyZXNvbHZlciIsInBhcnRzIiwibWF0Y2giLCJNYXAiLCJuc0ltcG9ydGVkIiwiZGVmYXVsdFR5cGVzSW1wb3J0ZWQiLCJuYW1lZFR5cGVzSW1wb3J0ZWQiLCJnZXRJbXBvcnRNYXAiLCJuIiwiaW1wb3J0S2luZCIsIkltcG9ydERlY2xhcmF0aW9uIiwicmVzb2x2ZWRQYXRoIiwiaW1wb3J0TWFwIiwiaGFzIiwiZ2V0Iiwic2V0Il0sIm1hcHBpbmdzIjoicW9CQUFBLHNEO0FBQ0EscUM7O0FBRUEsU0FBU0EsWUFBVCxDQUFzQkMsUUFBdEIsRUFBZ0NDLE9BQWhDLEVBQXlDO0FBQ3ZDLHlCQUE4QkQsU0FBU0UsT0FBVCxFQUE5Qiw4SEFBa0QsZ0VBQXRDQyxPQUFzQyxnQkFBOUJDLEtBQThCO0FBQ2hELFVBQUlBLE1BQU1DLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNwQixZQUFNQyx3QkFBY0gsT0FBZCxpQ0FBTixDQURvQjtBQUVLQyxhQUZMLEVBRWJHLEtBRmEsYUFFSEMsSUFGRztBQUdwQixZQUFNQyxhQUFhUixRQUFRUyxhQUFSLEVBQW5CO0FBQ0EsWUFBTUMsTUFBTUMsT0FBT0wsS0FBUCxFQUFjQyxJQUFkLEVBQW9CQyxVQUFwQixDQUFaOztBQUVBUixnQkFBUVksTUFBUixDQUFlO0FBQ2JDLGdCQUFNUCxNQUFNUSxNQURDO0FBRWJULDBCQUZhO0FBR2JLLGtCQUhhLENBR1I7QUFIUSxTQUFmLEVBTm9COztBQVlwQixnQ0FBbUJILElBQW5CLG1JQUF5QixLQUFkTSxJQUFjO0FBQ3ZCYixvQkFBUVksTUFBUixDQUFlO0FBQ2JDLG9CQUFNQSxLQUFLQyxNQURFO0FBRWJULDhCQUZhLEVBQWY7O0FBSUQsV0FqQm1CO0FBa0JyQjtBQUNGLEtBckJzQztBQXNCeEM7O0FBRUQsU0FBU00sTUFBVCxDQUFnQkwsS0FBaEIsRUFBdUJDLElBQXZCLEVBQTZCQyxVQUE3QixFQUF5QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFJLE9BQU9BLFdBQVdPLGlCQUFsQixLQUF3QyxVQUE1QyxFQUF3RDtBQUN0RCxXQUFPQyxTQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFJQyx1QkFBdUJYLEtBQXZCLEVBQThCRSxVQUE5QixLQUE2Q1UsYUFBYVosS0FBYixDQUFqRCxFQUFzRTtBQUNwRSxXQUFPVSxTQUFQO0FBQ0Q7O0FBRUQsTUFBTUcscUJBQXFCLElBQUlDLEdBQUo7QUFDekIsR0FBQ2QsS0FBRCw0QkFBV0MsSUFBWCxHQUFpQmMsR0FBakIsQ0FBcUJDLG9CQUFyQixFQUEyQ0MsTUFBM0MsQ0FBa0RDLE9BQWxELENBRHlCLENBQTNCOzs7QUFJQTtBQUNBO0FBQ0EsTUFBSUwsbUJBQW1CTSxJQUFuQixHQUEwQixDQUE5QixFQUFpQztBQUMvQixXQUFPVCxTQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLE1BQU1VLHNCQUFzQm5CLEtBQUtnQixNQUFMLENBQVksd0JBQVE7QUFDOUNOLDJCQUF1QkosSUFBdkIsRUFBNkJMLFVBQTdCO0FBQ0FVLGlCQUFhTCxJQUFiLENBRjhDLENBQVIsRUFBWixDQUE1Qjs7O0FBS0EsTUFBTWMsYUFBYUQ7QUFDaEJMLEtBRGdCLENBQ1osZ0JBQVE7QUFDWCxRQUFNTyxTQUFTcEIsV0FBV3FCLFNBQVgsQ0FBcUJoQixJQUFyQixDQUFmO0FBQ0EsUUFBTWlCLFlBQVlGLE9BQU9HLElBQVAsQ0FBWSx5QkFBU0MsYUFBYUMsS0FBYixFQUFvQixHQUFwQixDQUFULEVBQVosQ0FBbEI7QUFDQSxRQUFNQyxhQUFhTixPQUFPRyxJQUFQLENBQVkseUJBQVNDLGFBQWFDLEtBQWIsRUFBb0IsR0FBcEIsQ0FBVCxFQUFaLENBQW5COztBQUVBLFFBQUlILGFBQWEsSUFBYixJQUFxQkksY0FBYyxJQUF2QyxFQUE2QztBQUMzQyxhQUFPbEIsU0FBUDtBQUNEOztBQUVELFdBQU87QUFDTG1CLGtCQUFZdEIsSUFEUDtBQUVMdUIsWUFBTTVCLFdBQVc0QixJQUFYLENBQWdCQyxLQUFoQixDQUFzQlAsVUFBVVEsS0FBVixDQUFnQixDQUFoQixDQUF0QixFQUEwQ0osV0FBV0ksS0FBWCxDQUFpQixDQUFqQixDQUExQyxDQUZEO0FBR0xDLHdCQUFrQlAsYUFBYXhCLFdBQVdnQyxjQUFYLENBQTBCTixVQUExQixDQUFiLEVBQW9ELEdBQXBELENBSGI7QUFJTE8sZUFBUyxDQUFDQyxjQUFjN0IsSUFBZCxDQUpMLEVBQVA7O0FBTUQsR0FoQmdCO0FBaUJoQlUsUUFqQmdCLENBaUJUQyxPQWpCUyxDQUFuQjs7QUFtQkEsTUFBTW1CLHFCQUFxQmpCLG9CQUFvQkgsTUFBcEIsQ0FBMkI7QUFDcEQsT0FBQ21CLGNBQWM3QixJQUFkLENBQUQ7QUFDQSxPQUFDSyxhQUFhTCxJQUFiLENBREQ7QUFFQSxPQUFDYyxXQUFXaUIsSUFBWCxDQUFnQiw2QkFBYUMsVUFBVVYsVUFBVixLQUF5QnRCLElBQXRDLEVBQWhCLENBSG1ELEdBQTNCLENBQTNCOzs7QUFNQSxNQUFNaUMsbUJBQW1CeEIscUJBQXFCaEIsS0FBckIsS0FBK0IsSUFBL0IsSUFBdUNhLG1CQUFtQk0sSUFBbkIsS0FBNEIsQ0FBNUY7QUFDQSxNQUFNc0Isc0JBQXNCcEIsV0FBV3ZCLE1BQVgsR0FBb0IsQ0FBaEQ7QUFDQSxNQUFNNEMsMEJBQTBCTCxtQkFBbUJ2QyxNQUFuQixHQUE0QixDQUE1RDs7QUFFQSxNQUFJLEVBQUUwQyxvQkFBb0JDLG1CQUFwQixJQUEyQ0MsdUJBQTdDLENBQUosRUFBMkU7QUFDekUsV0FBT2hDLFNBQVA7QUFDRDs7QUFFRCxTQUFPLGlCQUFTO0FBQ2QsUUFBTVksU0FBU3BCLFdBQVdxQixTQUFYLENBQXFCdkIsS0FBckIsQ0FBZjtBQUNBLFFBQU13QixZQUFZRixPQUFPRyxJQUFQLENBQVkseUJBQVNDLGFBQWFDLEtBQWIsRUFBb0IsR0FBcEIsQ0FBVCxFQUFaLENBQWxCO0FBQ0EsUUFBTUMsYUFBYU4sT0FBT0csSUFBUCxDQUFZLHlCQUFTQyxhQUFhQyxLQUFiLEVBQW9CLEdBQXBCLENBQVQsRUFBWixDQUFuQjtBQUNBLFFBQU1nQixhQUFhekMsV0FBVzBDLGFBQVgsQ0FBeUI1QyxLQUF6QixDQUFuQixDQUpjO0FBS2NhLHNCQUxkLEtBS1BnQyxpQkFMTzs7QUFPZCxRQUFNQztBQUNKbEIsa0JBQWMsSUFBZDtBQUNBRixpQkFBYXhCLFdBQVdnQyxjQUFYLENBQTBCTixVQUExQixDQUFiLEVBQW9ELEdBQXBELENBRkY7QUFHQSxRQUFNbUIsZUFBZSxDQUFDWCxjQUFjcEMsS0FBZCxDQUF0QixDQVZjOztBQVlXcUIsZUFBVzJCLE1BQVg7QUFDdkIscUJBQXVCVCxTQUF2QixFQUFxQyxzQ0FBbkNVLE1BQW1DLFlBQTNCQyxVQUEyQjtBQUNuQyxhQUFPO0FBQ0xBLG9CQUFjLENBQUNYLFVBQVVKLE9BQXpCO0FBQ09jLFlBRFAsaUJBQ2lCVixVQUFVVCxJQUQzQjtBQUVPbUIsWUFGUCxXQUVnQlYsVUFBVVQsSUFGMUIsQ0FESztBQUlMUyxnQkFBVUosT0FBVixHQUFvQmUsVUFBcEIsR0FBaUMsSUFKNUIsQ0FBUDs7QUFNRCxLQVJzQjtBQVN2QixLQUFDLEVBQUQsRUFBSyxDQUFDSixxQkFBRCxJQUEwQixDQUFDQyxZQUFoQyxDQVR1QixDQVpYLDZEQVlQSSxjQVpPOzs7QUF3QmQsUUFBTUMsUUFBUSxFQUFkOztBQUVBLFFBQUlaLG9CQUFvQmhCLGFBQWEsSUFBakMsSUFBeUNpQixtQkFBN0MsRUFBa0U7QUFDaEU7QUFDQVcsWUFBTUMsSUFBTjtBQUNFQyxZQUFNQyxlQUFOLENBQXNCWixVQUF0QixlQUFzQ0UsaUJBQXRDLG1CQUE2RE0sY0FBN0QsYUFERjs7QUFHRCxLQUxELE1BS08sSUFBSVgsb0JBQW9CaEIsYUFBYSxJQUFqQyxJQUF5QyxDQUFDaUIsbUJBQTlDLEVBQW1FO0FBQ3hFO0FBQ0FXLFlBQU1DLElBQU4sQ0FBV0MsTUFBTUMsZUFBTixDQUFzQlosVUFBdEIsZUFBc0NFLGlCQUF0QyxZQUFYO0FBQ0QsS0FITSxNQUdBLElBQUlMLG9CQUFvQmhCLGFBQWEsSUFBakMsSUFBeUNJLGNBQWMsSUFBM0QsRUFBaUU7QUFDdEU7QUFDQXdCLFlBQU1DLElBQU4sQ0FBV0MsTUFBTUMsZUFBTixDQUFzQlosVUFBdEIsZUFBc0NFLGlCQUF0QyxRQUFYO0FBQ0EsVUFBSUosbUJBQUosRUFBeUI7QUFDdkI7QUFDQVcsY0FBTUMsSUFBTixDQUFXQyxNQUFNRSxnQkFBTixDQUF1QjVCLFVBQXZCLEVBQW1DdUIsY0FBbkMsQ0FBWDtBQUNEO0FBQ0YsS0FQTSxNQU9BLElBQUksQ0FBQ1gsZ0JBQUQsSUFBcUJoQixhQUFhLElBQWxDLElBQTBDaUIsbUJBQTlDLEVBQW1FO0FBQ3hFLFVBQUl6QyxNQUFNcUIsVUFBTixDQUFpQnZCLE1BQWpCLEtBQTRCLENBQWhDLEVBQW1DO0FBQ2pDO0FBQ0FzRCxjQUFNQyxJQUFOLENBQVdDLE1BQU1DLGVBQU4sQ0FBc0JaLFVBQXRCLGdCQUF1Q1EsY0FBdkMsYUFBWDtBQUNELE9BSEQsTUFHTztBQUNMO0FBQ0FDLGNBQU1DLElBQU4sQ0FBV0MsTUFBTUMsZUFBTixDQUFzQnZELE1BQU1xQixVQUFOLENBQWlCLENBQWpCLENBQXRCLGlCQUFpRDhCLGNBQWpELFFBQVg7QUFDRDtBQUNGLEtBUk0sTUFRQSxJQUFJLENBQUNYLGdCQUFELElBQXFCaEIsYUFBYSxJQUFsQyxJQUEwQ0ksY0FBYyxJQUE1RCxFQUFrRTtBQUN2RTtBQUNBd0IsWUFBTUMsSUFBTixDQUFXQyxNQUFNRSxnQkFBTixDQUF1QjVCLFVBQXZCLEVBQW1DdUIsY0FBbkMsQ0FBWDtBQUNEOztBQUVEO0FBdERjLDhHQXVEZCxzQkFBd0I5QixVQUF4QixtSUFBb0MsS0FBekJrQixTQUF5QjtBQUNsQyxZQUFNVixhQUFhVSxVQUFVVixVQUE3QjtBQUNBdUIsY0FBTUMsSUFBTixDQUFXQyxNQUFNRyxNQUFOLENBQWE1QixVQUFiLENBQVg7O0FBRUEsWUFBTTZCLHVCQUF1QixDQUFDN0IsV0FBV0csS0FBWCxDQUFpQixDQUFqQixDQUFELEVBQXNCSCxXQUFXRyxLQUFYLENBQWlCLENBQWpCLElBQXNCLENBQTVDLENBQTdCO0FBQ0EsWUFBTTJCLGtCQUFrQnpELFdBQVc0QixJQUFYLENBQWdCOEIsU0FBaEIsQ0FBMEJGLHFCQUFxQixDQUFyQixDQUExQixFQUFtREEscUJBQXFCLENBQXJCLENBQW5ELENBQXhCO0FBQ0EsWUFBSUMsb0JBQW9CLElBQXhCLEVBQThCO0FBQzVCUCxnQkFBTUMsSUFBTixDQUFXQyxNQUFNTyxXQUFOLENBQWtCSCxvQkFBbEIsQ0FBWDtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQTtBQUNBO0FBcEVjLDRVQXFFZCxzQkFBbUJyQixrQkFBbkIsbUlBQXVDLEtBQTVCOUIsSUFBNEI7QUFDckM2QyxjQUFNQyxJQUFOLENBQVdDLE1BQU1HLE1BQU4sQ0FBYWxELElBQWIsQ0FBWDs7QUFFQSxZQUFNbUQsdUJBQXVCLENBQUNuRCxLQUFLeUIsS0FBTCxDQUFXLENBQVgsQ0FBRCxFQUFnQnpCLEtBQUt5QixLQUFMLENBQVcsQ0FBWCxJQUFnQixDQUFoQyxDQUE3QjtBQUNBLFlBQU0yQixrQkFBa0J6RCxXQUFXNEIsSUFBWCxDQUFnQjhCLFNBQWhCLENBQTBCRixxQkFBcUIsQ0FBckIsQ0FBMUIsRUFBbURBLHFCQUFxQixDQUFyQixDQUFuRCxDQUF4QjtBQUNBLFlBQUlDLG9CQUFvQixJQUF4QixFQUE4QjtBQUM1QlAsZ0JBQU1DLElBQU4sQ0FBV0MsTUFBTU8sV0FBTixDQUFrQkgsb0JBQWxCLENBQVg7QUFDRDtBQUNGLE9BN0VhOztBQStFZCxXQUFPTixLQUFQO0FBQ0QsR0FoRkQ7QUFpRkQ7O0FBRUQsU0FBUzFCLFlBQVQsQ0FBc0JuQixJQUF0QixFQUE0QnVELEtBQTVCLEVBQW1DO0FBQ2pDLFNBQU92RCxLQUFLd0QsSUFBTCxLQUFjLFlBQWQsSUFBOEJ4RCxLQUFLdUQsS0FBTCxLQUFlQSxLQUFwRDtBQUNEOztBQUVEO0FBQ0EsU0FBUzlDLG9CQUFULENBQThCVCxJQUE5QixFQUFvQztBQUNsQyxNQUFNeUQsbUJBQW1CekQsS0FBS2MsVUFBTDtBQUN0QkksTUFEc0IsQ0FDakIsNkJBQWFjLFVBQVV3QixJQUFWLEtBQW1CLHdCQUFoQyxFQURpQixDQUF6QjtBQUVBLFNBQU9DLG9CQUFvQixJQUFwQixHQUEyQkEsaUJBQWlCQyxLQUFqQixDQUF1QkMsSUFBbEQsR0FBeUR4RCxTQUFoRTtBQUNEOztBQUVEO0FBQ0EsU0FBU0UsWUFBVCxDQUFzQkwsSUFBdEIsRUFBNEI7QUFDMUIsTUFBTWMsYUFBYWQsS0FBS2MsVUFBTDtBQUNoQkosUUFEZ0IsQ0FDVCw2QkFBYXNCLFVBQVV3QixJQUFWLEtBQW1CLDBCQUFoQyxFQURTLENBQW5CO0FBRUEsU0FBTzFDLFdBQVd2QixNQUFYLEdBQW9CLENBQTNCO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFTc0MsYUFBVCxDQUF1QjdCLElBQXZCLEVBQTZCO0FBQzNCLE1BQU1jLGFBQWFkLEtBQUtjLFVBQUw7QUFDaEJKLFFBRGdCLENBQ1QsNkJBQWFzQixVQUFVd0IsSUFBVixLQUFtQixpQkFBaEMsRUFEUyxDQUFuQjtBQUVBLFNBQU8xQyxXQUFXdkIsTUFBWCxHQUFvQixDQUEzQjtBQUNEOztBQUVEO0FBQ0E7QUFDQSxTQUFTYSxzQkFBVCxDQUFnQ0osSUFBaEMsRUFBc0NMLFVBQXRDLEVBQWtEO0FBQ2hEO0FBQ0VpRSxxQkFBaUI1RCxJQUFqQixFQUF1QkwsVUFBdkI7QUFDQWtFLG9CQUFnQjdELElBQWhCLEVBQXNCTCxVQUF0QixDQURBO0FBRUFtRSxrQ0FBOEI5RCxJQUE5QixFQUFvQ0wsVUFBcEMsQ0FIRjs7QUFLRDs7QUFFRDtBQUNBO0FBQ0EsU0FBU2lFLGdCQUFULENBQTBCNUQsSUFBMUIsRUFBZ0NMLFVBQWhDLEVBQTRDO0FBQzFDLFNBQU9BLFdBQVdPLGlCQUFYLENBQTZCRixJQUE3QjtBQUNKK0IsTUFESSxDQUNDLDJCQUFXZ0MsUUFBUUMsR0FBUixDQUFZQyxHQUFaLENBQWdCQyxJQUFoQixJQUF3QmxFLEtBQUtnRSxHQUFMLENBQVNHLEtBQVQsQ0FBZUQsSUFBZixHQUFzQixDQUF6RCxFQURELENBQVA7QUFFRDs7QUFFRDtBQUNBO0FBQ0EsU0FBU0wsZUFBVCxDQUF5QjdELElBQXpCLEVBQStCTCxVQUEvQixFQUEyQztBQUN6QyxTQUFPQSxXQUFXeUUsZ0JBQVgsQ0FBNEJwRSxJQUE1QjtBQUNKK0IsTUFESSxDQUNDLDJCQUFXZ0MsUUFBUUMsR0FBUixDQUFZRyxLQUFaLENBQWtCRCxJQUFsQixLQUEyQmxFLEtBQUtnRSxHQUFMLENBQVNDLEdBQVQsQ0FBYUMsSUFBbkQsRUFERCxDQUFQO0FBRUQ7O0FBRUQ7QUFDQTtBQUNBLFNBQVNKLDZCQUFULENBQXVDOUQsSUFBdkMsRUFBNkNMLFVBQTdDLEVBQXlEO0FBQ3ZELE1BQU1vQixTQUFTcEIsV0FBV3FCLFNBQVgsQ0FBcUJoQixJQUFyQixDQUFmO0FBQ0EsTUFBTXFFLGlCQUFpQnRELE9BQU91RCxTQUFQLENBQWlCLHlCQUFTbkQsYUFBYUMsS0FBYixFQUFvQixHQUFwQixDQUFULEVBQWpCLENBQXZCO0FBQ0EsTUFBTW1ELGtCQUFrQnhELE9BQU91RCxTQUFQLENBQWlCLHlCQUFTbkQsYUFBYUMsS0FBYixFQUFvQixHQUFwQixDQUFULEVBQWpCLENBQXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTW9ELGFBQWFILGtCQUFrQixDQUFsQixJQUF1QkUsbUJBQW1CLENBQTFDO0FBQ2Z4RCxTQUFPUyxLQUFQLENBQWEsQ0FBYixFQUFnQjZDLGlCQUFpQixDQUFqQyxFQUFvQ0ksTUFBcEMsQ0FBMkMxRCxPQUFPUyxLQUFQLENBQWErQyxrQkFBa0IsQ0FBL0IsQ0FBM0MsQ0FEZTtBQUVmeEQsU0FBT1MsS0FBUCxDQUFhLENBQWIsQ0FGSjtBQUdBLFNBQU9nRCxXQUFXekMsSUFBWCxDQUFnQix5QkFBU3BDLFdBQVdPLGlCQUFYLENBQTZCa0IsS0FBN0IsRUFBb0M3QixNQUFwQyxHQUE2QyxDQUF0RCxFQUFoQixDQUFQO0FBQ0Q7O0FBRURGLE9BQU9xRixPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSm5CLFVBQU0sU0FERjtBQUVKb0IsVUFBTTtBQUNKQyxXQUFLLDBCQUFRLGVBQVIsQ0FERCxFQUZGOztBQUtKQyxhQUFTLE1BTEw7QUFNSkMsWUFBUTtBQUNOO0FBQ0V2QixZQUFNLFFBRFI7QUFFRXdCLGtCQUFZO0FBQ1ZDLDZCQUFxQjtBQUNuQnpCLGdCQUFNLFNBRGEsRUFEWCxFQUZkOzs7QUFPRTBCLDRCQUFzQixLQVB4QixFQURNLENBTkosRUFEUzs7Ozs7QUFvQmZDLFFBcEJlLCtCQW9CUmhHLE9BcEJRLEVBb0JDO0FBQ2Q7QUFDQSxVQUFNaUcsNEJBQTRCakcsUUFBUWtHLE9BQVIsQ0FBZ0IsQ0FBaEI7QUFDaENsRyxjQUFRa0csT0FBUixDQUFnQixDQUFoQixFQUFtQixxQkFBbkIsQ0FERjtBQUVBLFVBQU1DLCtCQUFrQixTQUFsQkEsZUFBa0IscUJBQWMsMEJBQVFDLFVBQVIsRUFBb0JwRyxPQUFwQixLQUFnQ29HLFVBQTlDLEVBQWxCLDBCQUFOO0FBQ0EsVUFBTUMsV0FBV0osNEJBQTZCLHNCQUFjO0FBQzFELFlBQU1LLFFBQVFGLFdBQVdHLEtBQVgsQ0FBaUIsaUJBQWpCLENBQWQ7QUFDQSxZQUFJLENBQUNELEtBQUwsRUFBWTtBQUNWLGlCQUFPSCxnQkFBZ0JDLFVBQWhCLENBQVA7QUFDRDtBQUNELGVBQU9ELGdCQUFnQkcsTUFBTSxDQUFOLENBQWhCLElBQTRCLEdBQTVCLEdBQWtDQSxNQUFNLENBQU4sQ0FBekM7QUFDRCxPQU5nQixHQU1aSCxlQU5MOztBQVFBLFVBQU1wRyxXQUFXLElBQUl5RyxHQUFKLEVBQWpCO0FBQ0EsVUFBTUMsYUFBYSxJQUFJRCxHQUFKLEVBQW5CO0FBQ0EsVUFBTUUsdUJBQXVCLElBQUlGLEdBQUosRUFBN0I7QUFDQSxVQUFNRyxxQkFBcUIsSUFBSUgsR0FBSixFQUEzQjs7QUFFQSxlQUFTSSxZQUFULENBQXNCQyxDQUF0QixFQUF5QjtBQUN2QixZQUFJQSxFQUFFQyxVQUFGLEtBQWlCLE1BQXJCLEVBQTZCO0FBQzNCLGlCQUFPRCxFQUFFbEYsVUFBRixDQUFhdkIsTUFBYixHQUFzQixDQUF0QixJQUEyQnlHLEVBQUVsRixVQUFGLENBQWEsQ0FBYixFQUFnQjBDLElBQWhCLEtBQXlCLHdCQUFwRCxHQUErRXFDLG9CQUEvRSxHQUFzR0Msa0JBQTdHO0FBQ0Q7O0FBRUQsZUFBT3pGLGFBQWEyRixDQUFiLElBQWtCSixVQUFsQixHQUErQjFHLFFBQXRDO0FBQ0Q7O0FBRUQsYUFBTztBQUNMZ0gseUJBREssMENBQ2FGLENBRGIsRUFDZ0I7QUFDbkI7QUFDQSxnQkFBTUcsZUFBZVgsU0FBU1EsRUFBRS9GLE1BQUYsQ0FBU3NELEtBQWxCLENBQXJCO0FBQ0EsZ0JBQU02QyxZQUFZTCxhQUFhQyxDQUFiLENBQWxCOztBQUVBLGdCQUFJSSxVQUFVQyxHQUFWLENBQWNGLFlBQWQsQ0FBSixFQUFpQztBQUMvQkMsd0JBQVVFLEdBQVYsQ0FBY0gsWUFBZCxFQUE0QnJELElBQTVCLENBQWlDa0QsQ0FBakM7QUFDRCxhQUZELE1BRU87QUFDTEksd0JBQVVHLEdBQVYsQ0FBY0osWUFBZCxFQUE0QixDQUFDSCxDQUFELENBQTVCO0FBQ0Q7QUFDRixXQVhJOztBQWFMLHFDQUFnQix1QkFBWTtBQUMxQi9HLHlCQUFhQyxRQUFiLEVBQXVCQyxPQUF2QjtBQUNBRix5QkFBYTJHLFVBQWIsRUFBeUJ6RyxPQUF6QjtBQUNBRix5QkFBYTRHLG9CQUFiLEVBQW1DMUcsT0FBbkM7QUFDQUYseUJBQWE2RyxrQkFBYixFQUFpQzNHLE9BQWpDO0FBQ0QsV0FMRCxzQkFiSyxFQUFQOztBQW9CRCxLQWxFYyxtQkFBakIiLCJmaWxlIjoibm8tZHVwbGljYXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXNvbHZlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVzb2x2ZSc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gY2hlY2tJbXBvcnRzKGltcG9ydGVkLCBjb250ZXh0KSB7XG4gIGZvciAoY29uc3QgW21vZHVsZSwgbm9kZXNdIG9mIGltcG9ydGVkLmVudHJpZXMoKSkge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYCcke21vZHVsZX0nIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzLmA7XG4gICAgICBjb25zdCBbZmlyc3QsIC4uLnJlc3RdID0gbm9kZXM7XG4gICAgICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG4gICAgICBjb25zdCBmaXggPSBnZXRGaXgoZmlyc3QsIHJlc3QsIHNvdXJjZUNvZGUpO1xuXG4gICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgIG5vZGU6IGZpcnN0LnNvdXJjZSxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgZml4LCAvLyBBdHRhY2ggdGhlIGF1dG9maXggKGlmIGFueSkgdG8gdGhlIGZpcnN0IGltcG9ydC5cbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgcmVzdCkge1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbm9kZTogbm9kZS5zb3VyY2UsXG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldEZpeChmaXJzdCwgcmVzdCwgc291cmNlQ29kZSkge1xuICAvLyBTb3JyeSBFU0xpbnQgPD0gMyB1c2Vycywgbm8gYXV0b2ZpeCBmb3IgeW91LiBBdXRvZml4aW5nIGR1cGxpY2F0ZSBpbXBvcnRzXG4gIC8vIHJlcXVpcmVzIG11bHRpcGxlIGBmaXhlci53aGF0ZXZlcigpYCBjYWxscyBpbiB0aGUgYGZpeGA6IFdlIGJvdGggbmVlZCB0b1xuICAvLyB1cGRhdGUgdGhlIGZpcnN0IG9uZSwgYW5kIHJlbW92ZSB0aGUgcmVzdC4gU3VwcG9ydCBmb3IgbXVsdGlwbGVcbiAgLy8gYGZpeGVyLndoYXRldmVyKClgIGluIGEgc2luZ2xlIGBmaXhgIHdhcyBhZGRlZCBpbiBFU0xpbnQgNC4xLlxuICAvLyBgc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZWAgd2FzIGFkZGVkIGluIDQuMCwgc28gdGhhdCdzIGFuIGVhc3kgdGhpbmcgdG9cbiAgLy8gY2hlY2sgZm9yLlxuICBpZiAodHlwZW9mIHNvdXJjZUNvZGUuZ2V0Q29tbWVudHNCZWZvcmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gQWRqdXN0aW5nIHRoZSBmaXJzdCBpbXBvcnQgbWlnaHQgbWFrZSBpdCBtdWx0aWxpbmUsIHdoaWNoIGNvdWxkIGJyZWFrXG4gIC8vIGBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVgIGNvbW1lbnRzIGFuZCBzaW1pbGFyLCBzbyBiYWlsIGlmIHRoZSBmaXJzdFxuICAvLyBpbXBvcnQgaGFzIGNvbW1lbnRzLiBBbHNvLCBpZiB0aGUgZmlyc3QgaW1wb3J0IGlzIGBpbXBvcnQgKiBhcyBucyBmcm9tXG4gIC8vICcuL2ZvbydgIHRoZXJlJ3Mgbm90aGluZyB3ZSBjYW4gZG8uXG4gIGlmIChoYXNQcm9ibGVtYXRpY0NvbW1lbnRzKGZpcnN0LCBzb3VyY2VDb2RlKSB8fCBoYXNOYW1lc3BhY2UoZmlyc3QpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IGRlZmF1bHRJbXBvcnROYW1lcyA9IG5ldyBTZXQoXG4gICAgW2ZpcnN0LCAuLi5yZXN0XS5tYXAoZ2V0RGVmYXVsdEltcG9ydE5hbWUpLmZpbHRlcihCb29sZWFuKSxcbiAgKTtcblxuICAvLyBCYWlsIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBkaWZmZXJlbnQgZGVmYXVsdCBpbXBvcnQgbmFtZXMg4oCTIGl0J3MgdXAgdG8gdGhlXG4gIC8vIHVzZXIgdG8gY2hvb3NlIHdoaWNoIG9uZSB0byBrZWVwLlxuICBpZiAoZGVmYXVsdEltcG9ydE5hbWVzLnNpemUgPiAxKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIExlYXZlIGl0IHRvIHRoZSB1c2VyIHRvIGhhbmRsZSBjb21tZW50cy4gQWxzbyBza2lwIGBpbXBvcnQgKiBhcyBucyBmcm9tXG4gIC8vICcuL2ZvbydgIGltcG9ydHMsIHNpbmNlIHRoZXkgY2Fubm90IGJlIG1lcmdlZCBpbnRvIGFub3RoZXIgaW1wb3J0LlxuICBjb25zdCByZXN0V2l0aG91dENvbW1lbnRzID0gcmVzdC5maWx0ZXIobm9kZSA9PiAhKFxuICAgIGhhc1Byb2JsZW1hdGljQ29tbWVudHMobm9kZSwgc291cmNlQ29kZSkgfHxcbiAgICBoYXNOYW1lc3BhY2Uobm9kZSlcbiAgKSk7XG5cbiAgY29uc3Qgc3BlY2lmaWVycyA9IHJlc3RXaXRob3V0Q29tbWVudHNcbiAgICAubWFwKG5vZGUgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gc291cmNlQ29kZS5nZXRUb2tlbnMobm9kZSk7XG4gICAgICBjb25zdCBvcGVuQnJhY2UgPSB0b2tlbnMuZmluZCh0b2tlbiA9PiBpc1B1bmN0dWF0b3IodG9rZW4sICd7JykpO1xuICAgICAgY29uc3QgY2xvc2VCcmFjZSA9IHRva2Vucy5maW5kKHRva2VuID0+IGlzUHVuY3R1YXRvcih0b2tlbiwgJ30nKSk7XG5cbiAgICAgIGlmIChvcGVuQnJhY2UgPT0gbnVsbCB8fCBjbG9zZUJyYWNlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW1wb3J0Tm9kZTogbm9kZSxcbiAgICAgICAgdGV4dDogc291cmNlQ29kZS50ZXh0LnNsaWNlKG9wZW5CcmFjZS5yYW5nZVsxXSwgY2xvc2VCcmFjZS5yYW5nZVswXSksXG4gICAgICAgIGhhc1RyYWlsaW5nQ29tbWE6IGlzUHVuY3R1YXRvcihzb3VyY2VDb2RlLmdldFRva2VuQmVmb3JlKGNsb3NlQnJhY2UpLCAnLCcpLFxuICAgICAgICBpc0VtcHR5OiAhaGFzU3BlY2lmaWVycyhub2RlKSxcbiAgICAgIH07XG4gICAgfSlcbiAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIGNvbnN0IHVubmVjZXNzYXJ5SW1wb3J0cyA9IHJlc3RXaXRob3V0Q29tbWVudHMuZmlsdGVyKG5vZGUgPT5cbiAgICAhaGFzU3BlY2lmaWVycyhub2RlKSAmJlxuICAgICFoYXNOYW1lc3BhY2Uobm9kZSkgJiZcbiAgICAhc3BlY2lmaWVycy5zb21lKHNwZWNpZmllciA9PiBzcGVjaWZpZXIuaW1wb3J0Tm9kZSA9PT0gbm9kZSksXG4gICk7XG5cbiAgY29uc3Qgc2hvdWxkQWRkRGVmYXVsdCA9IGdldERlZmF1bHRJbXBvcnROYW1lKGZpcnN0KSA9PSBudWxsICYmIGRlZmF1bHRJbXBvcnROYW1lcy5zaXplID09PSAxO1xuICBjb25zdCBzaG91bGRBZGRTcGVjaWZpZXJzID0gc3BlY2lmaWVycy5sZW5ndGggPiAwO1xuICBjb25zdCBzaG91bGRSZW1vdmVVbm5lY2Vzc2FyeSA9IHVubmVjZXNzYXJ5SW1wb3J0cy5sZW5ndGggPiAwO1xuXG4gIGlmICghKHNob3VsZEFkZERlZmF1bHQgfHwgc2hvdWxkQWRkU3BlY2lmaWVycyB8fCBzaG91bGRSZW1vdmVVbm5lY2Vzc2FyeSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIGZpeGVyID0+IHtcbiAgICBjb25zdCB0b2tlbnMgPSBzb3VyY2VDb2RlLmdldFRva2VucyhmaXJzdCk7XG4gICAgY29uc3Qgb3BlbkJyYWNlID0gdG9rZW5zLmZpbmQodG9rZW4gPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAneycpKTtcbiAgICBjb25zdCBjbG9zZUJyYWNlID0gdG9rZW5zLmZpbmQodG9rZW4gPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAnfScpKTtcbiAgICBjb25zdCBmaXJzdFRva2VuID0gc291cmNlQ29kZS5nZXRGaXJzdFRva2VuKGZpcnN0KTtcbiAgICBjb25zdCBbZGVmYXVsdEltcG9ydE5hbWVdID0gZGVmYXVsdEltcG9ydE5hbWVzO1xuXG4gICAgY29uc3QgZmlyc3RIYXNUcmFpbGluZ0NvbW1hID1cbiAgICAgIGNsb3NlQnJhY2UgIT0gbnVsbCAmJlxuICAgICAgaXNQdW5jdHVhdG9yKHNvdXJjZUNvZGUuZ2V0VG9rZW5CZWZvcmUoY2xvc2VCcmFjZSksICcsJyk7XG4gICAgY29uc3QgZmlyc3RJc0VtcHR5ID0gIWhhc1NwZWNpZmllcnMoZmlyc3QpO1xuXG4gICAgY29uc3QgW3NwZWNpZmllcnNUZXh0XSA9IHNwZWNpZmllcnMucmVkdWNlKFxuICAgICAgKFtyZXN1bHQsIG5lZWRzQ29tbWFdLCBzcGVjaWZpZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBuZWVkc0NvbW1hICYmICFzcGVjaWZpZXIuaXNFbXB0eVxuICAgICAgICAgICAgPyBgJHtyZXN1bHR9LCR7c3BlY2lmaWVyLnRleHR9YFxuICAgICAgICAgICAgOiBgJHtyZXN1bHR9JHtzcGVjaWZpZXIudGV4dH1gLFxuICAgICAgICAgIHNwZWNpZmllci5pc0VtcHR5ID8gbmVlZHNDb21tYSA6IHRydWUsXG4gICAgICAgIF07XG4gICAgICB9LFxuICAgICAgWycnLCAhZmlyc3RIYXNUcmFpbGluZ0NvbW1hICYmICFmaXJzdElzRW1wdHldLFxuICAgICk7XG5cbiAgICBjb25zdCBmaXhlcyA9IFtdO1xuXG4gICAgaWYgKHNob3VsZEFkZERlZmF1bHQgJiYgb3BlbkJyYWNlID09IG51bGwgJiYgc2hvdWxkQWRkU3BlY2lmaWVycykge1xuICAgICAgLy8gYGltcG9ydCAnLi9mb28nYCDihpIgYGltcG9ydCBkZWYsIHsuLi59IGZyb20gJy4vZm9vJ2BcbiAgICAgIGZpeGVzLnB1c2goXG4gICAgICAgIGZpeGVyLmluc2VydFRleHRBZnRlcihmaXJzdFRva2VuLCBgICR7ZGVmYXVsdEltcG9ydE5hbWV9LCB7JHtzcGVjaWZpZXJzVGV4dH19IGZyb21gKSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChzaG91bGRBZGREZWZhdWx0ICYmIG9wZW5CcmFjZSA9PSBudWxsICYmICFzaG91bGRBZGRTcGVjaWZpZXJzKSB7XG4gICAgICAvLyBgaW1wb3J0ICcuL2ZvbydgIOKGkiBgaW1wb3J0IGRlZiBmcm9tICcuL2ZvbydgXG4gICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRBZnRlcihmaXJzdFRva2VuLCBgICR7ZGVmYXVsdEltcG9ydE5hbWV9IGZyb21gKSk7XG4gICAgfSBlbHNlIGlmIChzaG91bGRBZGREZWZhdWx0ICYmIG9wZW5CcmFjZSAhPSBudWxsICYmIGNsb3NlQnJhY2UgIT0gbnVsbCkge1xuICAgICAgLy8gYGltcG9ydCB7Li4ufSBmcm9tICcuL2ZvbydgIOKGkiBgaW1wb3J0IGRlZiwgey4uLn0gZnJvbSAnLi9mb28nYFxuICAgICAgZml4ZXMucHVzaChmaXhlci5pbnNlcnRUZXh0QWZ0ZXIoZmlyc3RUb2tlbiwgYCAke2RlZmF1bHRJbXBvcnROYW1lfSxgKSk7XG4gICAgICBpZiAoc2hvdWxkQWRkU3BlY2lmaWVycykge1xuICAgICAgICAvLyBgaW1wb3J0IGRlZiwgey4uLn0gZnJvbSAnLi9mb28nYCDihpIgYGltcG9ydCBkZWYsIHsuLi4sIC4uLn0gZnJvbSAnLi9mb28nYFxuICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRCZWZvcmUoY2xvc2VCcmFjZSwgc3BlY2lmaWVyc1RleHQpKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFzaG91bGRBZGREZWZhdWx0ICYmIG9wZW5CcmFjZSA9PSBudWxsICYmIHNob3VsZEFkZFNwZWNpZmllcnMpIHtcbiAgICAgIGlmIChmaXJzdC5zcGVjaWZpZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBgaW1wb3J0ICcuL2ZvbydgIOKGkiBgaW1wb3J0IHsuLi59IGZyb20gJy4vZm9vJ2BcbiAgICAgICAgZml4ZXMucHVzaChmaXhlci5pbnNlcnRUZXh0QWZ0ZXIoZmlyc3RUb2tlbiwgYCB7JHtzcGVjaWZpZXJzVGV4dH19IGZyb21gKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBgaW1wb3J0IGRlZiBmcm9tICcuL2ZvbydgIOKGkiBgaW1wb3J0IGRlZiwgey4uLn0gZnJvbSAnLi9mb28nYFxuICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRBZnRlcihmaXJzdC5zcGVjaWZpZXJzWzBdLCBgLCB7JHtzcGVjaWZpZXJzVGV4dH19YCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXNob3VsZEFkZERlZmF1bHQgJiYgb3BlbkJyYWNlICE9IG51bGwgJiYgY2xvc2VCcmFjZSAhPSBudWxsKSB7XG4gICAgICAvLyBgaW1wb3J0IHsuLi59ICcuL2ZvbydgIOKGkiBgaW1wb3J0IHsuLi4sIC4uLn0gZnJvbSAnLi9mb28nYFxuICAgICAgZml4ZXMucHVzaChmaXhlci5pbnNlcnRUZXh0QmVmb3JlKGNsb3NlQnJhY2UsIHNwZWNpZmllcnNUZXh0KSk7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGltcG9ydHMgd2hvc2Ugc3BlY2lmaWVycyBoYXZlIGJlZW4gbW92ZWQgaW50byB0aGUgZmlyc3QgaW1wb3J0LlxuICAgIGZvciAoY29uc3Qgc3BlY2lmaWVyIG9mIHNwZWNpZmllcnMpIHtcbiAgICAgIGNvbnN0IGltcG9ydE5vZGUgPSBzcGVjaWZpZXIuaW1wb3J0Tm9kZTtcbiAgICAgIGZpeGVzLnB1c2goZml4ZXIucmVtb3ZlKGltcG9ydE5vZGUpKTtcblxuICAgICAgY29uc3QgY2hhckFmdGVySW1wb3J0UmFuZ2UgPSBbaW1wb3J0Tm9kZS5yYW5nZVsxXSwgaW1wb3J0Tm9kZS5yYW5nZVsxXSArIDFdO1xuICAgICAgY29uc3QgY2hhckFmdGVySW1wb3J0ID0gc291cmNlQ29kZS50ZXh0LnN1YnN0cmluZyhjaGFyQWZ0ZXJJbXBvcnRSYW5nZVswXSwgY2hhckFmdGVySW1wb3J0UmFuZ2VbMV0pO1xuICAgICAgaWYgKGNoYXJBZnRlckltcG9ydCA9PT0gJ1xcbicpIHtcbiAgICAgICAgZml4ZXMucHVzaChmaXhlci5yZW1vdmVSYW5nZShjaGFyQWZ0ZXJJbXBvcnRSYW5nZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBpbXBvcnRzIHdob3NlIGRlZmF1bHQgaW1wb3J0IGhhcyBiZWVuIG1vdmVkIHRvIHRoZSBmaXJzdCBpbXBvcnQsXG4gICAgLy8gYW5kIHNpZGUtZWZmZWN0LW9ubHkgaW1wb3J0cyB0aGF0IGFyZSB1bm5lY2Vzc2FyeSBkdWUgdG8gdGhlIGZpcnN0XG4gICAgLy8gaW1wb3J0LlxuICAgIGZvciAoY29uc3Qgbm9kZSBvZiB1bm5lY2Vzc2FyeUltcG9ydHMpIHtcbiAgICAgIGZpeGVzLnB1c2goZml4ZXIucmVtb3ZlKG5vZGUpKTtcblxuICAgICAgY29uc3QgY2hhckFmdGVySW1wb3J0UmFuZ2UgPSBbbm9kZS5yYW5nZVsxXSwgbm9kZS5yYW5nZVsxXSArIDFdO1xuICAgICAgY29uc3QgY2hhckFmdGVySW1wb3J0ID0gc291cmNlQ29kZS50ZXh0LnN1YnN0cmluZyhjaGFyQWZ0ZXJJbXBvcnRSYW5nZVswXSwgY2hhckFmdGVySW1wb3J0UmFuZ2VbMV0pO1xuICAgICAgaWYgKGNoYXJBZnRlckltcG9ydCA9PT0gJ1xcbicpIHtcbiAgICAgICAgZml4ZXMucHVzaChmaXhlci5yZW1vdmVSYW5nZShjaGFyQWZ0ZXJJbXBvcnRSYW5nZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmaXhlcztcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNQdW5jdHVhdG9yKG5vZGUsIHZhbHVlKSB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdQdW5jdHVhdG9yJyAmJiBub2RlLnZhbHVlID09PSB2YWx1ZTtcbn1cblxuLy8gR2V0IHRoZSBuYW1lIG9mIHRoZSBkZWZhdWx0IGltcG9ydCBvZiBgbm9kZWAsIGlmIGFueS5cbmZ1bmN0aW9uIGdldERlZmF1bHRJbXBvcnROYW1lKG5vZGUpIHtcbiAgY29uc3QgZGVmYXVsdFNwZWNpZmllciA9IG5vZGUuc3BlY2lmaWVyc1xuICAgIC5maW5kKHNwZWNpZmllciA9PiBzcGVjaWZpZXIudHlwZSA9PT0gJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInKTtcbiAgcmV0dXJuIGRlZmF1bHRTcGVjaWZpZXIgIT0gbnVsbCA/IGRlZmF1bHRTcGVjaWZpZXIubG9jYWwubmFtZSA6IHVuZGVmaW5lZDtcbn1cblxuLy8gQ2hlY2tzIHdoZXRoZXIgYG5vZGVgIGhhcyBhIG5hbWVzcGFjZSBpbXBvcnQuXG5mdW5jdGlvbiBoYXNOYW1lc3BhY2Uobm9kZSkge1xuICBjb25zdCBzcGVjaWZpZXJzID0gbm9kZS5zcGVjaWZpZXJzXG4gICAgLmZpbHRlcihzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLnR5cGUgPT09ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInKTtcbiAgcmV0dXJuIHNwZWNpZmllcnMubGVuZ3RoID4gMDtcbn1cblxuLy8gQ2hlY2tzIHdoZXRoZXIgYG5vZGVgIGhhcyBhbnkgbm9uLWRlZmF1bHQgc3BlY2lmaWVycy5cbmZ1bmN0aW9uIGhhc1NwZWNpZmllcnMobm9kZSkge1xuICBjb25zdCBzcGVjaWZpZXJzID0gbm9kZS5zcGVjaWZpZXJzXG4gICAgLmZpbHRlcihzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLnR5cGUgPT09ICdJbXBvcnRTcGVjaWZpZXInKTtcbiAgcmV0dXJuIHNwZWNpZmllcnMubGVuZ3RoID4gMDtcbn1cblxuLy8gSXQncyBub3Qgb2J2aW91cyB3aGF0IHRoZSB1c2VyIHdhbnRzIHRvIGRvIHdpdGggY29tbWVudHMgYXNzb2NpYXRlZCB3aXRoXG4vLyBkdXBsaWNhdGUgaW1wb3J0cywgc28gc2tpcCBpbXBvcnRzIHdpdGggY29tbWVudHMgd2hlbiBhdXRvZml4aW5nLlxuZnVuY3Rpb24gaGFzUHJvYmxlbWF0aWNDb21tZW50cyhub2RlLCBzb3VyY2VDb2RlKSB7XG4gIHJldHVybiAoXG4gICAgaGFzQ29tbWVudEJlZm9yZShub2RlLCBzb3VyY2VDb2RlKSB8fFxuICAgIGhhc0NvbW1lbnRBZnRlcihub2RlLCBzb3VyY2VDb2RlKSB8fFxuICAgIGhhc0NvbW1lbnRJbnNpZGVOb25TcGVjaWZpZXJzKG5vZGUsIHNvdXJjZUNvZGUpXG4gICk7XG59XG5cbi8vIENoZWNrcyB3aGV0aGVyIGBub2RlYCBoYXMgYSBjb21tZW50ICh0aGF0IGVuZHMpIG9uIHRoZSBwcmV2aW91cyBsaW5lIG9yIG9uXG4vLyB0aGUgc2FtZSBsaW5lIGFzIGBub2RlYCAoc3RhcnRzKS5cbmZ1bmN0aW9uIGhhc0NvbW1lbnRCZWZvcmUobm9kZSwgc291cmNlQ29kZSkge1xuICByZXR1cm4gc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZShub2RlKVxuICAgIC5zb21lKGNvbW1lbnQgPT4gY29tbWVudC5sb2MuZW5kLmxpbmUgPj0gbm9kZS5sb2Muc3RhcnQubGluZSAtIDEpO1xufVxuXG4vLyBDaGVja3Mgd2hldGhlciBgbm9kZWAgaGFzIGEgY29tbWVudCAodGhhdCBzdGFydHMpIG9uIHRoZSBzYW1lIGxpbmUgYXMgYG5vZGVgXG4vLyAoZW5kcykuXG5mdW5jdGlvbiBoYXNDb21tZW50QWZ0ZXIobm9kZSwgc291cmNlQ29kZSkge1xuICByZXR1cm4gc291cmNlQ29kZS5nZXRDb21tZW50c0FmdGVyKG5vZGUpXG4gICAgLnNvbWUoY29tbWVudCA9PiBjb21tZW50LmxvYy5zdGFydC5saW5lID09PSBub2RlLmxvYy5lbmQubGluZSk7XG59XG5cbi8vIENoZWNrcyB3aGV0aGVyIGBub2RlYCBoYXMgYW55IGNvbW1lbnRzIF9pbnNpZGUsXyBleGNlcHQgaW5zaWRlIHRoZSBgey4uLn1gXG4vLyBwYXJ0IChpZiBhbnkpLlxuZnVuY3Rpb24gaGFzQ29tbWVudEluc2lkZU5vblNwZWNpZmllcnMobm9kZSwgc291cmNlQ29kZSkge1xuICBjb25zdCB0b2tlbnMgPSBzb3VyY2VDb2RlLmdldFRva2Vucyhub2RlKTtcbiAgY29uc3Qgb3BlbkJyYWNlSW5kZXggPSB0b2tlbnMuZmluZEluZGV4KHRva2VuID0+IGlzUHVuY3R1YXRvcih0b2tlbiwgJ3snKSk7XG4gIGNvbnN0IGNsb3NlQnJhY2VJbmRleCA9IHRva2Vucy5maW5kSW5kZXgodG9rZW4gPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAnfScpKTtcbiAgLy8gU2xpY2UgYXdheSB0aGUgZmlyc3QgdG9rZW4sIHNpbmNlIHdlJ3JlIG5vIGxvb2tpbmcgZm9yIGNvbW1lbnRzIF9iZWZvcmVfXG4gIC8vIGBub2RlYCAob25seSBpbnNpZGUpLiBJZiB0aGVyZSdzIGEgYHsuLi59YCBwYXJ0LCBsb29rIGZvciBjb21tZW50cyBiZWZvcmVcbiAgLy8gdGhlIGB7YCwgYnV0IG5vdCBiZWZvcmUgdGhlIGB9YCAoaGVuY2UgdGhlIGArMWBzKS5cbiAgY29uc3Qgc29tZVRva2VucyA9IG9wZW5CcmFjZUluZGV4ID49IDAgJiYgY2xvc2VCcmFjZUluZGV4ID49IDBcbiAgICA/IHRva2Vucy5zbGljZSgxLCBvcGVuQnJhY2VJbmRleCArIDEpLmNvbmNhdCh0b2tlbnMuc2xpY2UoY2xvc2VCcmFjZUluZGV4ICsgMSkpXG4gICAgOiB0b2tlbnMuc2xpY2UoMSk7XG4gIHJldHVybiBzb21lVG9rZW5zLnNvbWUodG9rZW4gPT4gc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZSh0b2tlbikubGVuZ3RoID4gMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnbm8tZHVwbGljYXRlcycpLFxuICAgIH0sXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGNvbnNpZGVyUXVlcnlTdHJpbmc6IHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICAvLyBQcmVwYXJlIHRoZSByZXNvbHZlciBmcm9tIG9wdGlvbnMuXG4gICAgY29uc3QgY29uc2lkZXJRdWVyeVN0cmluZ09wdGlvbiA9IGNvbnRleHQub3B0aW9uc1swXSAmJlxuICAgICAgY29udGV4dC5vcHRpb25zWzBdWydjb25zaWRlclF1ZXJ5U3RyaW5nJ107XG4gICAgY29uc3QgZGVmYXVsdFJlc29sdmVyID0gc291cmNlUGF0aCA9PiByZXNvbHZlKHNvdXJjZVBhdGgsIGNvbnRleHQpIHx8IHNvdXJjZVBhdGg7XG4gICAgY29uc3QgcmVzb2x2ZXIgPSBjb25zaWRlclF1ZXJ5U3RyaW5nT3B0aW9uID8gKHNvdXJjZVBhdGggPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBzb3VyY2VQYXRoLm1hdGNoKC9eKFteP10qKVxcPyguKikkLyk7XG4gICAgICBpZiAoIXBhcnRzKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0UmVzb2x2ZXIoc291cmNlUGF0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmYXVsdFJlc29sdmVyKHBhcnRzWzFdKSArICc/JyArIHBhcnRzWzJdO1xuICAgIH0pIDogZGVmYXVsdFJlc29sdmVyO1xuXG4gICAgY29uc3QgaW1wb3J0ZWQgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgbnNJbXBvcnRlZCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBkZWZhdWx0VHlwZXNJbXBvcnRlZCA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBuYW1lZFR5cGVzSW1wb3J0ZWQgPSBuZXcgTWFwKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRJbXBvcnRNYXAobikge1xuICAgICAgaWYgKG4uaW1wb3J0S2luZCA9PT0gJ3R5cGUnKSB7XG4gICAgICAgIHJldHVybiBuLnNwZWNpZmllcnMubGVuZ3RoID4gMCAmJiBuLnNwZWNpZmllcnNbMF0udHlwZSA9PT0gJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInID8gZGVmYXVsdFR5cGVzSW1wb3J0ZWQgOiBuYW1lZFR5cGVzSW1wb3J0ZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoYXNOYW1lc3BhY2UobikgPyBuc0ltcG9ydGVkIDogaW1wb3J0ZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uKG4pIHtcbiAgICAgICAgLy8gcmVzb2x2ZWQgcGF0aCB3aWxsIGNvdmVyIGFsaWFzZWQgZHVwbGljYXRlc1xuICAgICAgICBjb25zdCByZXNvbHZlZFBhdGggPSByZXNvbHZlcihuLnNvdXJjZS52YWx1ZSk7XG4gICAgICAgIGNvbnN0IGltcG9ydE1hcCA9IGdldEltcG9ydE1hcChuKTtcblxuICAgICAgICBpZiAoaW1wb3J0TWFwLmhhcyhyZXNvbHZlZFBhdGgpKSB7XG4gICAgICAgICAgaW1wb3J0TWFwLmdldChyZXNvbHZlZFBhdGgpLnB1c2gobik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW1wb3J0TWFwLnNldChyZXNvbHZlZFBhdGgsIFtuXSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICdQcm9ncmFtOmV4aXQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoZWNrSW1wb3J0cyhpbXBvcnRlZCwgY29udGV4dCk7XG4gICAgICAgIGNoZWNrSW1wb3J0cyhuc0ltcG9ydGVkLCBjb250ZXh0KTtcbiAgICAgICAgY2hlY2tJbXBvcnRzKGRlZmF1bHRUeXBlc0ltcG9ydGVkLCBjb250ZXh0KTtcbiAgICAgICAgY2hlY2tJbXBvcnRzKG5hbWVkVHlwZXNJbXBvcnRlZCwgY29udGV4dCk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19