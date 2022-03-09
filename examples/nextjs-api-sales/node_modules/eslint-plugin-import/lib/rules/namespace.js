'use strict';var _declaredScope = require('eslint-module-utils/declaredScope');var _declaredScope2 = _interopRequireDefault(_declaredScope);
var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _importDeclaration = require('../importDeclaration');var _importDeclaration2 = _interopRequireDefault(_importDeclaration);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2['default'])('namespace') },


    schema: [
    {
      type: 'object',
      properties: {
        allowComputed: {
          description: 'If `false`, will report computed (and thus, un-lintable) references to namespace members.',
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function namespaceRule(context) {

      // read options
      var _ref =

      context.options[0] || {},_ref$allowComputed = _ref.allowComputed,allowComputed = _ref$allowComputed === undefined ? false : _ref$allowComputed;

      var namespaces = new Map();

      function makeMessage(last, namepath) {
        return '\'' + String(last.name) + '\' not found in ' + (namepath.length > 1 ? 'deeply ' : '') + 'imported namespace \'' + String(namepath.join('.')) + '\'.';
      }

      return {
        // pick up all imports at body entry time, to properly respect hoisting
        Program: function () {function Program(_ref2) {var body = _ref2.body;
            function processBodyStatement(declaration) {
              if (declaration.type !== 'ImportDeclaration') return;

              if (declaration.specifiers.length === 0) return;

              var imports = _ExportMap2['default'].get(declaration.source.value, context);
              if (imports == null) return null;

              if (imports.errors.length) {
                imports.reportErrors(context, declaration);
                return;
              }var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

                for (var _iterator = declaration.specifiers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var specifier = _step.value;
                  switch (specifier.type) {
                    case 'ImportNamespaceSpecifier':
                      if (!imports.size) {
                        context.report(
                        specifier, 'No exported names found in module \'' + String(
                        declaration.source.value) + '\'.');

                      }
                      namespaces.set(specifier.local.name, imports);
                      break;
                    case 'ImportDefaultSpecifier':
                    case 'ImportSpecifier':{
                        var meta = imports.get(
                        // default to 'default' for default https://i.imgur.com/nj6qAWy.jpg
                        specifier.imported ? specifier.imported.name : 'default');

                        if (!meta || !meta.namespace) {break;}
                        namespaces.set(specifier.local.name, meta.namespace);
                        break;
                      }}

                }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
            }
            body.forEach(processBodyStatement);
          }return Program;}(),

        // same as above, but does not add names to local map
        ExportNamespaceSpecifier: function () {function ExportNamespaceSpecifier(namespace) {
            var declaration = (0, _importDeclaration2['default'])(context);

            var imports = _ExportMap2['default'].get(declaration.source.value, context);
            if (imports == null) return null;

            if (imports.errors.length) {
              imports.reportErrors(context, declaration);
              return;
            }

            if (!imports.size) {
              context.report(
              namespace, 'No exported names found in module \'' + String(
              declaration.source.value) + '\'.');

            }
          }return ExportNamespaceSpecifier;}(),

        // todo: check for possible redefinition

        MemberExpression: function () {function MemberExpression(dereference) {
            if (dereference.object.type !== 'Identifier') return;
            if (!namespaces.has(dereference.object.name)) return;
            if ((0, _declaredScope2['default'])(context, dereference.object.name) !== 'module') return;

            if (dereference.parent.type === 'AssignmentExpression' && dereference.parent.left === dereference) {
              context.report(
              dereference.parent, 'Assignment to member of namespace \'' + String(
              dereference.object.name) + '\'.');

            }

            // go deep
            var namespace = namespaces.get(dereference.object.name);
            var namepath = [dereference.object.name];
            // while property is namespace and parent is member expression, keep validating
            while (namespace instanceof _ExportMap2['default'] && dereference.type === 'MemberExpression') {

              if (dereference.computed) {
                if (!allowComputed) {
                  context.report(
                  dereference.property, 'Unable to validate computed reference to imported namespace \'' + String(
                  dereference.object.name) + '\'.');

                }
                return;
              }

              if (!namespace.has(dereference.property.name)) {
                context.report(
                dereference.property,
                makeMessage(dereference.property, namepath));

                break;
              }

              var exported = namespace.get(dereference.property.name);
              if (exported == null) return;

              // stash and pop
              namepath.push(dereference.property.name);
              namespace = exported.namespace;
              dereference = dereference.parent;
            }

          }return MemberExpression;}(),

        VariableDeclarator: function () {function VariableDeclarator(_ref3) {var id = _ref3.id,init = _ref3.init;
            if (init == null) return;
            if (init.type !== 'Identifier') return;
            if (!namespaces.has(init.name)) return;

            // check for redefinition in intermediate scopes
            if ((0, _declaredScope2['default'])(context, init.name) !== 'module') return;

            // DFS traverse child namespaces
            function testKey(pattern, namespace) {var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [init.name];
              if (!(namespace instanceof _ExportMap2['default'])) return;

              if (pattern.type !== 'ObjectPattern') return;var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

                for (var _iterator2 = pattern.properties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var property = _step2.value;
                  if (
                  property.type === 'ExperimentalRestProperty' ||
                  property.type === 'RestElement' ||
                  !property.key)
                  {
                    continue;
                  }

                  if (property.key.type !== 'Identifier') {
                    context.report({
                      node: property,
                      message: 'Only destructure top-level names.' });

                    continue;
                  }

                  if (!namespace.has(property.key.name)) {
                    context.report({
                      node: property,
                      message: makeMessage(property.key, path) });

                    continue;
                  }

                  path.push(property.key.name);
                  var dependencyExportMap = namespace.get(property.key.name);
                  // could be null when ignored or ambiguous
                  if (dependencyExportMap !== null) {
                    testKey(property.value, dependencyExportMap.namespace, path);
                  }
                  path.pop();
                }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
            }

            testKey(id, namespaces.get(init.name));
          }return VariableDeclarator;}(),

        JSXMemberExpression: function () {function JSXMemberExpression(_ref4) {var object = _ref4.object,property = _ref4.property;
            if (!namespaces.has(object.name)) return;
            var namespace = namespaces.get(object.name);
            if (!namespace.has(property.name)) {
              context.report({
                node: property,
                message: makeMessage(property, [object.name]) });

            }
          }return JSXMemberExpression;}() };

    }return namespaceRule;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uYW1lc3BhY2UuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJhbGxvd0NvbXB1dGVkIiwiZGVzY3JpcHRpb24iLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNyZWF0ZSIsIm5hbWVzcGFjZVJ1bGUiLCJjb250ZXh0Iiwib3B0aW9ucyIsIm5hbWVzcGFjZXMiLCJNYXAiLCJtYWtlTWVzc2FnZSIsImxhc3QiLCJuYW1lcGF0aCIsIm5hbWUiLCJsZW5ndGgiLCJqb2luIiwiUHJvZ3JhbSIsImJvZHkiLCJwcm9jZXNzQm9keVN0YXRlbWVudCIsImRlY2xhcmF0aW9uIiwic3BlY2lmaWVycyIsImltcG9ydHMiLCJFeHBvcnRzIiwiZ2V0Iiwic291cmNlIiwidmFsdWUiLCJlcnJvcnMiLCJyZXBvcnRFcnJvcnMiLCJzcGVjaWZpZXIiLCJzaXplIiwicmVwb3J0Iiwic2V0IiwibG9jYWwiLCJpbXBvcnRlZCIsIm5hbWVzcGFjZSIsImZvckVhY2giLCJFeHBvcnROYW1lc3BhY2VTcGVjaWZpZXIiLCJNZW1iZXJFeHByZXNzaW9uIiwiZGVyZWZlcmVuY2UiLCJvYmplY3QiLCJoYXMiLCJwYXJlbnQiLCJsZWZ0IiwiY29tcHV0ZWQiLCJwcm9wZXJ0eSIsImV4cG9ydGVkIiwicHVzaCIsIlZhcmlhYmxlRGVjbGFyYXRvciIsImlkIiwiaW5pdCIsInRlc3RLZXkiLCJwYXR0ZXJuIiwicGF0aCIsImtleSIsIm5vZGUiLCJtZXNzYWdlIiwiZGVwZW5kZW5jeUV4cG9ydE1hcCIsInBvcCIsIkpTWE1lbWJlckV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiJhQUFBLGtFO0FBQ0EseUM7QUFDQSx5RDtBQUNBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxTQURGO0FBRUpDLFVBQU07QUFDSkMsV0FBSywwQkFB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Q3hDLGdCQUFJLENBQUNwQyxXQUFXZ0MsR0FBWCxDQUFlRCxPQUFPMUIsSUFBdEIsQ0FBTCxFQUFrQztBQUNsQyxnQkFBTXFCLFlBQVkxQixXQUFXZSxHQUFYLENBQWVnQixPQUFPMUIsSUFBdEIsQ0FBbEI7QUFDQSxnQkFBSSxDQUFDcUIsVUFBVU0sR0FBVixDQUFjSSxTQUFTL0IsSUFBdkIsQ0FBTCxFQUFtQztBQUNqQ1Asc0JBQVF3QixNQUFSLENBQWU7QUFDYndCLHNCQUFNVixRQURPO0FBRWJXLHlCQUFTN0MsWUFBWWtDLFFBQVosRUFBc0IsQ0FBQ0wsT0FBTzFCLElBQVIsQ0FBdEIsQ0FGSSxFQUFmOztBQUlEO0FBQ0YsV0E3S0ksZ0NBQVA7O0FBK0tELEtBNUxELE9BQWlCUixhQUFqQixJQXRCZSxFQUFqQiIsImZpbGUiOiJuYW1lc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVjbGFyZWRTY29wZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2RlY2xhcmVkU2NvcGUnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vRXhwb3J0TWFwJztcbmltcG9ydCBpbXBvcnREZWNsYXJhdGlvbiBmcm9tICcuLi9pbXBvcnREZWNsYXJhdGlvbic7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAncHJvYmxlbScsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCduYW1lc3BhY2UnKSxcbiAgICB9LFxuXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgYWxsb3dDb21wdXRlZDoge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdJZiBgZmFsc2VgLCB3aWxsIHJlcG9ydCBjb21wdXRlZCAoYW5kIHRodXMsIHVuLWxpbnRhYmxlKSByZWZlcmVuY2VzIHRvIG5hbWVzcGFjZSBtZW1iZXJzLicsXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlOiBmdW5jdGlvbiBuYW1lc3BhY2VSdWxlKGNvbnRleHQpIHtcblxuICAgIC8vIHJlYWQgb3B0aW9uc1xuICAgIGNvbnN0IHtcbiAgICAgIGFsbG93Q29tcHV0ZWQgPSBmYWxzZSxcbiAgICB9ID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuXG4gICAgY29uc3QgbmFtZXNwYWNlcyA9IG5ldyBNYXAoKTtcblxuICAgIGZ1bmN0aW9uIG1ha2VNZXNzYWdlKGxhc3QsIG5hbWVwYXRoKSB7XG4gICAgICByZXR1cm4gYCcke2xhc3QubmFtZX0nIG5vdCBmb3VuZCBpbiAke25hbWVwYXRoLmxlbmd0aCA+IDEgPyAnZGVlcGx5ICcgOiAnJ31pbXBvcnRlZCBuYW1lc3BhY2UgJyR7bmFtZXBhdGguam9pbignLicpfScuYDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLy8gcGljayB1cCBhbGwgaW1wb3J0cyBhdCBib2R5IGVudHJ5IHRpbWUsIHRvIHByb3Blcmx5IHJlc3BlY3QgaG9pc3RpbmdcbiAgICAgIFByb2dyYW0oeyBib2R5IH0pIHtcbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0JvZHlTdGF0ZW1lbnQoZGVjbGFyYXRpb24pIHtcbiAgICAgICAgICBpZiAoZGVjbGFyYXRpb24udHlwZSAhPT0gJ0ltcG9ydERlY2xhcmF0aW9uJykgcmV0dXJuO1xuXG4gICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLnNwZWNpZmllcnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gRXhwb3J0cy5nZXQoZGVjbGFyYXRpb24uc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoaW1wb3J0cyA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAgIGlmIChpbXBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGltcG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIGRlY2xhcmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHNwZWNpZmllciBvZiBkZWNsYXJhdGlvbi5zcGVjaWZpZXJzKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHNwZWNpZmllci50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInOlxuICAgICAgICAgICAgICBpZiAoIWltcG9ydHMuc2l6ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgICAgICAgc3BlY2lmaWVyLFxuICAgICAgICAgICAgICAgICAgYE5vIGV4cG9ydGVkIG5hbWVzIGZvdW5kIGluIG1vZHVsZSAnJHtkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWV9Jy5gLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbmFtZXNwYWNlcy5zZXQoc3BlY2lmaWVyLmxvY2FsLm5hbWUsIGltcG9ydHMpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInOlxuICAgICAgICAgICAgY2FzZSAnSW1wb3J0U3BlY2lmaWVyJzoge1xuICAgICAgICAgICAgICBjb25zdCBtZXRhID0gaW1wb3J0cy5nZXQoXG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byAnZGVmYXVsdCcgZm9yIGRlZmF1bHQgaHR0cHM6Ly9pLmltZ3VyLmNvbS9uajZxQVd5LmpwZ1xuICAgICAgICAgICAgICAgIHNwZWNpZmllci5pbXBvcnRlZCA/IHNwZWNpZmllci5pbXBvcnRlZC5uYW1lIDogJ2RlZmF1bHQnLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBpZiAoIW1ldGEgfHwgIW1ldGEubmFtZXNwYWNlKSB7IGJyZWFrOyB9XG4gICAgICAgICAgICAgIG5hbWVzcGFjZXMuc2V0KHNwZWNpZmllci5sb2NhbC5uYW1lLCBtZXRhLm5hbWVzcGFjZSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBib2R5LmZvckVhY2gocHJvY2Vzc0JvZHlTdGF0ZW1lbnQpO1xuICAgICAgfSxcblxuICAgICAgLy8gc2FtZSBhcyBhYm92ZSwgYnV0IGRvZXMgbm90IGFkZCBuYW1lcyB0byBsb2NhbCBtYXBcbiAgICAgIEV4cG9ydE5hbWVzcGFjZVNwZWNpZmllcihuYW1lc3BhY2UpIHtcbiAgICAgICAgY29uc3QgZGVjbGFyYXRpb24gPSBpbXBvcnREZWNsYXJhdGlvbihjb250ZXh0KTtcblxuICAgICAgICBjb25zdCBpbXBvcnRzID0gRXhwb3J0cy5nZXQoZGVjbGFyYXRpb24uc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKGltcG9ydHMgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgaWYgKGltcG9ydHMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgIGltcG9ydHMucmVwb3J0RXJyb3JzKGNvbnRleHQsIGRlY2xhcmF0aW9uKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWltcG9ydHMuc2l6ZSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgbmFtZXNwYWNlLFxuICAgICAgICAgICAgYE5vIGV4cG9ydGVkIG5hbWVzIGZvdW5kIGluIG1vZHVsZSAnJHtkZWNsYXJhdGlvbi5zb3VyY2UudmFsdWV9Jy5gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIHRvZG86IGNoZWNrIGZvciBwb3NzaWJsZSByZWRlZmluaXRpb25cblxuICAgICAgTWVtYmVyRXhwcmVzc2lvbihkZXJlZmVyZW5jZSkge1xuICAgICAgICBpZiAoZGVyZWZlcmVuY2Uub2JqZWN0LnR5cGUgIT09ICdJZGVudGlmaWVyJykgcmV0dXJuO1xuICAgICAgICBpZiAoIW5hbWVzcGFjZXMuaGFzKGRlcmVmZXJlbmNlLm9iamVjdC5uYW1lKSkgcmV0dXJuO1xuICAgICAgICBpZiAoZGVjbGFyZWRTY29wZShjb250ZXh0LCBkZXJlZmVyZW5jZS5vYmplY3QubmFtZSkgIT09ICdtb2R1bGUnKSByZXR1cm47XG5cbiAgICAgICAgaWYgKGRlcmVmZXJlbmNlLnBhcmVudC50eXBlID09PSAnQXNzaWdubWVudEV4cHJlc3Npb24nICYmIGRlcmVmZXJlbmNlLnBhcmVudC5sZWZ0ID09PSBkZXJlZmVyZW5jZSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgZGVyZWZlcmVuY2UucGFyZW50LFxuICAgICAgICAgICAgYEFzc2lnbm1lbnQgdG8gbWVtYmVyIG9mIG5hbWVzcGFjZSAnJHtkZXJlZmVyZW5jZS5vYmplY3QubmFtZX0nLmAsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdvIGRlZXBcbiAgICAgICAgbGV0IG5hbWVzcGFjZSA9IG5hbWVzcGFjZXMuZ2V0KGRlcmVmZXJlbmNlLm9iamVjdC5uYW1lKTtcbiAgICAgICAgY29uc3QgbmFtZXBhdGggPSBbZGVyZWZlcmVuY2Uub2JqZWN0Lm5hbWVdO1xuICAgICAgICAvLyB3aGlsZSBwcm9wZXJ0eSBpcyBuYW1lc3BhY2UgYW5kIHBhcmVudCBpcyBtZW1iZXIgZXhwcmVzc2lvbiwga2VlcCB2YWxpZGF0aW5nXG4gICAgICAgIHdoaWxlIChuYW1lc3BhY2UgaW5zdGFuY2VvZiBFeHBvcnRzICYmIGRlcmVmZXJlbmNlLnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJykge1xuXG4gICAgICAgICAgaWYgKGRlcmVmZXJlbmNlLmNvbXB1dGVkKSB7XG4gICAgICAgICAgICBpZiAoIWFsbG93Q29tcHV0ZWQpIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICAgICAgZGVyZWZlcmVuY2UucHJvcGVydHksXG4gICAgICAgICAgICAgICAgYFVuYWJsZSB0byB2YWxpZGF0ZSBjb21wdXRlZCByZWZlcmVuY2UgdG8gaW1wb3J0ZWQgbmFtZXNwYWNlICcke2RlcmVmZXJlbmNlLm9iamVjdC5uYW1lfScuYCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIW5hbWVzcGFjZS5oYXMoZGVyZWZlcmVuY2UucHJvcGVydHkubmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgICBkZXJlZmVyZW5jZS5wcm9wZXJ0eSxcbiAgICAgICAgICAgICAgbWFrZU1lc3NhZ2UoZGVyZWZlcmVuY2UucHJvcGVydHksIG5hbWVwYXRoKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBleHBvcnRlZCA9IG5hbWVzcGFjZS5nZXQoZGVyZWZlcmVuY2UucHJvcGVydHkubmFtZSk7XG4gICAgICAgICAgaWYgKGV4cG9ydGVkID09IG51bGwpIHJldHVybjtcblxuICAgICAgICAgIC8vIHN0YXNoIGFuZCBwb3BcbiAgICAgICAgICBuYW1lcGF0aC5wdXNoKGRlcmVmZXJlbmNlLnByb3BlcnR5Lm5hbWUpO1xuICAgICAgICAgIG5hbWVzcGFjZSA9IGV4cG9ydGVkLm5hbWVzcGFjZTtcbiAgICAgICAgICBkZXJlZmVyZW5jZSA9IGRlcmVmZXJlbmNlLnBhcmVudDtcbiAgICAgICAgfVxuXG4gICAgICB9LFxuXG4gICAgICBWYXJpYWJsZURlY2xhcmF0b3IoeyBpZCwgaW5pdCB9KSB7XG4gICAgICAgIGlmIChpbml0ID09IG51bGwpIHJldHVybjtcbiAgICAgICAgaWYgKGluaXQudHlwZSAhPT0gJ0lkZW50aWZpZXInKSByZXR1cm47XG4gICAgICAgIGlmICghbmFtZXNwYWNlcy5oYXMoaW5pdC5uYW1lKSkgcmV0dXJuO1xuXG4gICAgICAgIC8vIGNoZWNrIGZvciByZWRlZmluaXRpb24gaW4gaW50ZXJtZWRpYXRlIHNjb3Blc1xuICAgICAgICBpZiAoZGVjbGFyZWRTY29wZShjb250ZXh0LCBpbml0Lm5hbWUpICE9PSAnbW9kdWxlJykgcmV0dXJuO1xuXG4gICAgICAgIC8vIERGUyB0cmF2ZXJzZSBjaGlsZCBuYW1lc3BhY2VzXG4gICAgICAgIGZ1bmN0aW9uIHRlc3RLZXkocGF0dGVybiwgbmFtZXNwYWNlLCBwYXRoID0gW2luaXQubmFtZV0pIHtcbiAgICAgICAgICBpZiAoIShuYW1lc3BhY2UgaW5zdGFuY2VvZiBFeHBvcnRzKSkgcmV0dXJuO1xuXG4gICAgICAgICAgaWYgKHBhdHRlcm4udHlwZSAhPT0gJ09iamVjdFBhdHRlcm4nKSByZXR1cm47XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHBhdHRlcm4ucHJvcGVydGllcykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBwcm9wZXJ0eS50eXBlID09PSAnRXhwZXJpbWVudGFsUmVzdFByb3BlcnR5J1xuICAgICAgICAgICAgICB8fCBwcm9wZXJ0eS50eXBlID09PSAnUmVzdEVsZW1lbnQnXG4gICAgICAgICAgICAgIHx8ICFwcm9wZXJ0eS5rZXlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmtleS50eXBlICE9PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGU6IHByb3BlcnR5LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdPbmx5IGRlc3RydWN0dXJlIHRvcC1sZXZlbCBuYW1lcy4nLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghbmFtZXNwYWNlLmhhcyhwcm9wZXJ0eS5rZXkubmFtZSkpIHtcbiAgICAgICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgICAgIG5vZGU6IHByb3BlcnR5LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1ha2VNZXNzYWdlKHByb3BlcnR5LmtleSwgcGF0aCksXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGF0aC5wdXNoKHByb3BlcnR5LmtleS5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGRlcGVuZGVuY3lFeHBvcnRNYXAgPSBuYW1lc3BhY2UuZ2V0KHByb3BlcnR5LmtleS5uYW1lKTtcbiAgICAgICAgICAgIC8vIGNvdWxkIGJlIG51bGwgd2hlbiBpZ25vcmVkIG9yIGFtYmlndW91c1xuICAgICAgICAgICAgaWYgKGRlcGVuZGVuY3lFeHBvcnRNYXAgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgdGVzdEtleShwcm9wZXJ0eS52YWx1ZSwgZGVwZW5kZW5jeUV4cG9ydE1hcC5uYW1lc3BhY2UsIHBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGF0aC5wb3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0ZXN0S2V5KGlkLCBuYW1lc3BhY2VzLmdldChpbml0Lm5hbWUpKTtcbiAgICAgIH0sXG5cbiAgICAgIEpTWE1lbWJlckV4cHJlc3Npb24oeyBvYmplY3QsIHByb3BlcnR5IH0pIHtcbiAgICAgICAgaWYgKCFuYW1lc3BhY2VzLmhhcyhvYmplY3QubmFtZSkpIHJldHVybjtcbiAgICAgICAgY29uc3QgbmFtZXNwYWNlID0gbmFtZXNwYWNlcy5nZXQob2JqZWN0Lm5hbWUpO1xuICAgICAgICBpZiAoIW5hbWVzcGFjZS5oYXMocHJvcGVydHkubmFtZSkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlOiBwcm9wZXJ0eSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1ha2VNZXNzYWdlKHByb3BlcnR5LCBbb2JqZWN0Lm5hbWVdKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==