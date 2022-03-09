'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _path = require('path');var path = _interopRequireWildcard(_path);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj['default'] = obj;return newObj;}}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2['default'])('named') },

    schema: [
    {
      type: 'object',
      properties: {
        commonjs: {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = context.options[0] || {};

      function checkSpecifiers(key, type, node) {
        // ignore local exports and type imports/exports
        if (
        node.source == null ||
        node.importKind === 'type' ||
        node.importKind === 'typeof' ||
        node.exportKind === 'type')
        {
          return;
        }

        if (!node.specifiers.some(function (im) {return im.type === type;})) {
          return; // no named imports/exports
        }

        var imports = _ExportMap2['default'].get(node.source.value, context);
        if (imports == null || imports.parseGoal === 'ambiguous') {
          return;
        }

        if (imports.errors.length) {
          imports.reportErrors(context, node);
          return;
        }

        node.specifiers.forEach(function (im) {
          if (
          im.type !== type
          // ignore type imports
          || im.importKind === 'type' || im.importKind === 'typeof')
          {
            return;
          }

          var deepLookup = imports.hasDeep(im[key].name);

          if (!deepLookup.found) {
            if (deepLookup.path.length > 1) {
              var deepPath = deepLookup.path.
              map(function (i) {return path.relative(path.dirname(context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename()), i.path);}).
              join(' -> ');

              context.report(im[key], String(im[key].name) + ' not found via ' + String(deepPath));
            } else {
              context.report(im[key], im[key].name + ' not found in \'' + node.source.value + '\'');
            }
          }
        });
      }

      function checkRequire(node) {
        if (
        !options.commonjs ||
        node.type !== 'VariableDeclarator'
        // return if it's not an object destructure or it's an empty object destructure
        || !node.id || node.id.type !== 'ObjectPattern' || node.id.properties.length === 0
        // return if there is no call expression on the right side
        || !node.init || node.init.type !== 'CallExpression')
        {
          return;
        }

        var call = node.init;var _call$arguments = _slicedToArray(
        call.arguments, 1),source = _call$arguments[0];
        var variableImports = node.id.properties;
        var variableExports = _ExportMap2['default'].get(source.value, context);

        if (
        // return if it's not a commonjs require statement
        call.callee.type !== 'Identifier' || call.callee.name !== 'require' || call.arguments.length !== 1
        // return if it's not a string source
        || source.type !== 'Literal' ||
        variableExports == null ||
        variableExports.parseGoal === 'ambiguous')
        {
          return;
        }

        if (variableExports.errors.length) {
          variableExports.reportErrors(context, node);
          return;
        }

        variableImports.forEach(function (im) {
          if (im.type !== 'Property' || !im.key || im.key.type !== 'Identifier') {
            return;
          }

          var deepLookup = variableExports.hasDeep(im.key.name);

          if (!deepLookup.found) {
            if (deepLookup.path.length > 1) {
              var deepPath = deepLookup.path.
              map(function (i) {return path.relative(path.dirname(context.getFilename()), i.path);}).
              join(' -> ');

              context.report(im.key, String(im.key.name) + ' not found via ' + String(deepPath));
            } else {
              context.report(im.key, im.key.name + ' not found in \'' + source.value + '\'');
            }
          }
        });
      }

      return {
        ImportDeclaration: checkSpecifiers.bind(null, 'imported', 'ImportSpecifier'),

        ExportNamedDeclaration: checkSpecifiers.bind(null, 'local', 'ExportSpecifier'),

        VariableDeclarator: checkRequire };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uYW1lZC5qcyJdLCJuYW1lcyI6WyJwYXRoIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJjb21tb25qcyIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiY3JlYXRlIiwiY29udGV4dCIsIm9wdGlvbnMiLCJjaGVja1NwZWNpZmllcnMiLCJrZXkiLCJub2RlIiwic291cmNlIiwiaW1wb3J0S2luZCIsImV4cG9ydEtpbmQiLCJzcGVjaWZpZXJzIiwic29tZSIsImltIiwiaW1wb3J0cyIsIkV4cG9ydHMiLCJnZXQiLCJ2YWx1ZSIsInBhcnNlR29hbCIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsImZvckVhY2giLCJkZWVwTG9va3VwIiwiaGFzRGVlcCIsIm5hbWUiLCJmb3VuZCIsImRlZXBQYXRoIiwibWFwIiwicmVsYXRpdmUiLCJkaXJuYW1lIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwiaSIsImpvaW4iLCJyZXBvcnQiLCJjaGVja1JlcXVpcmUiLCJpZCIsImluaXQiLCJjYWxsIiwiYXJndW1lbnRzIiwidmFyaWFibGVJbXBvcnRzIiwidmFyaWFibGVFeHBvcnRzIiwiY2FsbGVlIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJiaW5kIiwiRXhwb3J0TmFtZWREZWNsYXJhdGlvbiIsIlZhcmlhYmxlRGVjbGFyYXRvciJdLCJtYXBwaW5ncyI6InFvQkFBQSw0QixJQUFZQSxJO0FBQ1oseUM7QUFDQSxxQzs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sU0FERjtBQUVKQyxVQUFNO0FBQ0pDLFdBQUssMEJBQVEsT0FBUixDQURELEVBRkY7O0FBS0pDLFlBQVE7QUFDTjtBQUNFSCxZQUFNLFFBRFI7QUFFRUksa0JBQVk7QUFDVkMsa0JBQVU7QUFDUkwsZ0JBQU0sU0FERSxFQURBLEVBRmQ7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QVdoQyxJQUFYO0FBQ2RxQyxpQkFEYyxDQUNWLHFCQUFLckMsS0FBS3NDLFFBQUwsQ0FBY3RDLEtBQUt1QyxPQUFMLENBQWEzQixRQUFRNkIsV0FBUixFQUFiLENBQWQsRUFBbURDLEVBQUUxQyxJQUFyRCxDQUFMLEVBRFU7QUFFZDJDLGtCQUZjLENBRVQsTUFGUyxDQUFqQjs7QUFJQS9CLHNCQUFRZ0MsTUFBUixDQUFldEIsR0FBR1AsR0FBbEIsU0FBMEJPLEdBQUdQLEdBQUgsQ0FBT21CLElBQWpDLCtCQUF1REUsUUFBdkQ7QUFDRCxhQU5ELE1BTU87QUFDTHhCLHNCQUFRZ0MsTUFBUixDQUFldEIsR0FBR1AsR0FBbEIsRUFBdUJPLEdBQUdQLEdBQUgsQ0FBT21CLElBQVAsR0FBYyxrQkFBZCxHQUFtQ2pCLE9BQU9TLEtBQTFDLEdBQWtELElBQXpFO0FBQ0Q7QUFDRjtBQUNGLFNBbEJEO0FBbUJEOztBQUVELGFBQU87QUFDTDJCLDJCQUFtQnZDLGdCQUFnQndDLElBQWhCLENBQXFCLElBQXJCLEVBQTJCLFVBQTNCLEVBQXVDLGlCQUF2QyxDQURkOztBQUdMQyxnQ0FBd0J6QyxnQkFBZ0J3QyxJQUFoQixDQUFxQixJQUFyQixFQUEyQixPQUEzQixFQUFvQyxpQkFBcEMsQ0FIbkI7O0FBS0xFLDRCQUFvQlgsWUFMZixFQUFQOztBQU9ELEtBckljLG1CQUFqQiIsImZpbGUiOiJuYW1lZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgRXhwb3J0cyBmcm9tICcuLi9FeHBvcnRNYXAnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnbmFtZWQnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGNvbW1vbmpzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrU3BlY2lmaWVycyhrZXksIHR5cGUsIG5vZGUpIHtcbiAgICAgIC8vIGlnbm9yZSBsb2NhbCBleHBvcnRzIGFuZCB0eXBlIGltcG9ydHMvZXhwb3J0c1xuICAgICAgaWYgKFxuICAgICAgICBub2RlLnNvdXJjZSA9PSBudWxsXG4gICAgICAgIHx8IG5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGUnXG4gICAgICAgIHx8IG5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGVvZidcbiAgICAgICAgfHwgbm9kZS5leHBvcnRLaW5kID09PSAndHlwZSdcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghbm9kZS5zcGVjaWZpZXJzLnNvbWUoKGltKSA9PiBpbS50eXBlID09PSB0eXBlKSkge1xuICAgICAgICByZXR1cm47IC8vIG5vIG5hbWVkIGltcG9ydHMvZXhwb3J0c1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpbXBvcnRzID0gRXhwb3J0cy5nZXQobm9kZS5zb3VyY2UudmFsdWUsIGNvbnRleHQpO1xuICAgICAgaWYgKGltcG9ydHMgPT0gbnVsbCB8fCBpbXBvcnRzLnBhcnNlR29hbCA9PT0gJ2FtYmlndW91cycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW1wb3J0cy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGltcG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIG5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChpbSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgaW0udHlwZSAhPT0gdHlwZVxuICAgICAgICAgIC8vIGlnbm9yZSB0eXBlIGltcG9ydHNcbiAgICAgICAgICB8fCBpbS5pbXBvcnRLaW5kID09PSAndHlwZScgfHwgaW0uaW1wb3J0S2luZCA9PT0gJ3R5cGVvZidcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGVlcExvb2t1cCA9IGltcG9ydHMuaGFzRGVlcChpbVtrZXldLm5hbWUpO1xuXG4gICAgICAgIGlmICghZGVlcExvb2t1cC5mb3VuZCkge1xuICAgICAgICAgIGlmIChkZWVwTG9va3VwLnBhdGgubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgY29uc3QgZGVlcFBhdGggPSBkZWVwTG9va3VwLnBhdGhcbiAgICAgICAgICAgICAgLm1hcChpID0+IHBhdGgucmVsYXRpdmUocGF0aC5kaXJuYW1lKGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSA/IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSgpIDogY29udGV4dC5nZXRGaWxlbmFtZSgpKSwgaS5wYXRoKSlcbiAgICAgICAgICAgICAgLmpvaW4oJyAtPiAnKTtcblxuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoaW1ba2V5XSwgYCR7aW1ba2V5XS5uYW1lfSBub3QgZm91bmQgdmlhICR7ZGVlcFBhdGh9YCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KGltW2tleV0sIGltW2tleV0ubmFtZSArICcgbm90IGZvdW5kIGluIFxcJycgKyBub2RlLnNvdXJjZS52YWx1ZSArICdcXCcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrUmVxdWlyZShub2RlKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFvcHRpb25zLmNvbW1vbmpzXG4gICAgICAgIHx8IG5vZGUudHlwZSAhPT0gJ1ZhcmlhYmxlRGVjbGFyYXRvcidcbiAgICAgICAgLy8gcmV0dXJuIGlmIGl0J3Mgbm90IGFuIG9iamVjdCBkZXN0cnVjdHVyZSBvciBpdCdzIGFuIGVtcHR5IG9iamVjdCBkZXN0cnVjdHVyZVxuICAgICAgICB8fCAhbm9kZS5pZCB8fCBub2RlLmlkLnR5cGUgIT09ICdPYmplY3RQYXR0ZXJuJyB8fCBub2RlLmlkLnByb3BlcnRpZXMubGVuZ3RoID09PSAwXG4gICAgICAgIC8vIHJldHVybiBpZiB0aGVyZSBpcyBubyBjYWxsIGV4cHJlc3Npb24gb24gdGhlIHJpZ2h0IHNpZGVcbiAgICAgICAgfHwgIW5vZGUuaW5pdCB8fCBub2RlLmluaXQudHlwZSAhPT0gJ0NhbGxFeHByZXNzaW9uJ1xuICAgICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2FsbCA9IG5vZGUuaW5pdDtcbiAgICAgIGNvbnN0IFtzb3VyY2VdID0gY2FsbC5hcmd1bWVudHM7XG4gICAgICBjb25zdCB2YXJpYWJsZUltcG9ydHMgPSBub2RlLmlkLnByb3BlcnRpZXM7XG4gICAgICBjb25zdCB2YXJpYWJsZUV4cG9ydHMgPSBFeHBvcnRzLmdldChzb3VyY2UudmFsdWUsIGNvbnRleHQpO1xuXG4gICAgICBpZiAoXG4gICAgICAgIC8vIHJldHVybiBpZiBpdCdzIG5vdCBhIGNvbW1vbmpzIHJlcXVpcmUgc3RhdGVtZW50XG4gICAgICAgIGNhbGwuY2FsbGVlLnR5cGUgIT09ICdJZGVudGlmaWVyJyB8fCBjYWxsLmNhbGxlZS5uYW1lICE9PSAncmVxdWlyZScgfHwgY2FsbC5hcmd1bWVudHMubGVuZ3RoICE9PSAxXG4gICAgICAgIC8vIHJldHVybiBpZiBpdCdzIG5vdCBhIHN0cmluZyBzb3VyY2VcbiAgICAgICAgfHwgc291cmNlLnR5cGUgIT09ICdMaXRlcmFsJ1xuICAgICAgICB8fCB2YXJpYWJsZUV4cG9ydHMgPT0gbnVsbFxuICAgICAgICB8fCB2YXJpYWJsZUV4cG9ydHMucGFyc2VHb2FsID09PSAnYW1iaWd1b3VzJ1xuICAgICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhcmlhYmxlRXhwb3J0cy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHZhcmlhYmxlRXhwb3J0cy5yZXBvcnRFcnJvcnMoY29udGV4dCwgbm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyaWFibGVJbXBvcnRzLmZvckVhY2goZnVuY3Rpb24gKGltKSB7XG4gICAgICAgIGlmIChpbS50eXBlICE9PSAnUHJvcGVydHknIHx8ICFpbS5rZXkgfHwgaW0ua2V5LnR5cGUgIT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRlZXBMb29rdXAgPSB2YXJpYWJsZUV4cG9ydHMuaGFzRGVlcChpbS5rZXkubmFtZSk7XG5cbiAgICAgICAgaWYgKCFkZWVwTG9va3VwLmZvdW5kKSB7XG4gICAgICAgICAgaWYgKGRlZXBMb29rdXAucGF0aC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBjb25zdCBkZWVwUGF0aCA9IGRlZXBMb29rdXAucGF0aFxuICAgICAgICAgICAgICAubWFwKGkgPT4gcGF0aC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUoY29udGV4dC5nZXRGaWxlbmFtZSgpKSwgaS5wYXRoKSlcbiAgICAgICAgICAgICAgLmpvaW4oJyAtPiAnKTtcblxuICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoaW0ua2V5LCBgJHtpbS5rZXkubmFtZX0gbm90IGZvdW5kIHZpYSAke2RlZXBQYXRofWApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChpbS5rZXksIGltLmtleS5uYW1lICsgJyBub3QgZm91bmQgaW4gXFwnJyArIHNvdXJjZS52YWx1ZSArICdcXCcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbjogY2hlY2tTcGVjaWZpZXJzLmJpbmQobnVsbCwgJ2ltcG9ydGVkJywgJ0ltcG9ydFNwZWNpZmllcicpLFxuXG4gICAgICBFeHBvcnROYW1lZERlY2xhcmF0aW9uOiBjaGVja1NwZWNpZmllcnMuYmluZChudWxsLCAnbG9jYWwnLCAnRXhwb3J0U3BlY2lmaWVyJyksXG5cbiAgICAgIFZhcmlhYmxlRGVjbGFyYXRvcjogY2hlY2tSZXF1aXJlLFxuICAgIH07XG4gIH0sXG59O1xuIl19