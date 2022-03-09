'use strict';

var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('prefer-default-export') },

    schema: [] },


  create: function () {function create(context) {
      var specifierExportCount = 0;
      var hasDefaultExport = false;
      var hasStarExport = false;
      var hasTypeExport = false;
      var namedExportNode = null;

      function captureDeclaration(identifierOrPattern) {
        if (identifierOrPattern && identifierOrPattern.type === 'ObjectPattern') {
          // recursively capture
          identifierOrPattern.properties.
          forEach(function (property) {
            captureDeclaration(property.value);
          });
        } else if (identifierOrPattern && identifierOrPattern.type === 'ArrayPattern') {
          identifierOrPattern.elements.
          forEach(captureDeclaration);
        } else {
          // assume it's a single standard identifier
          specifierExportCount++;
        }
      }

      return {
        'ExportDefaultSpecifier': function () {function ExportDefaultSpecifier() {
            hasDefaultExport = true;
          }return ExportDefaultSpecifier;}(),

        'ExportSpecifier': function () {function ExportSpecifier(node) {
            if (node.exported.name === 'default') {
              hasDefaultExport = true;
            } else {
              specifierExportCount++;
              namedExportNode = node;
            }
          }return ExportSpecifier;}(),

        'ExportNamedDeclaration': function () {function ExportNamedDeclaration(node) {
            // if there are specifiers, node.declaration should be null
            if (!node.declaration) return;var

            type = node.declaration.type;

            if (
            type === 'TSTypeAliasDeclaration' ||
            type === 'TypeAlias' ||
            type === 'TSInterfaceDeclaration' ||
            type === 'InterfaceDeclaration')
            {
              specifierExportCount++;
              hasTypeExport = true;
              return;
            }

            if (node.declaration.declarations) {
              node.declaration.declarations.forEach(function (declaration) {
                captureDeclaration(declaration.id);
              });
            } else {
              // captures 'export function foo() {}' syntax
              specifierExportCount++;
            }

            namedExportNode = node;
          }return ExportNamedDeclaration;}(),

        'ExportDefaultDeclaration': function () {function ExportDefaultDeclaration() {
            hasDefaultExport = true;
          }return ExportDefaultDeclaration;}(),

        'ExportAllDeclaration': function () {function ExportAllDeclaration() {
            hasStarExport = true;
          }return ExportAllDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {
            if (specifierExportCount === 1 && !hasDefaultExport && !hasStarExport && !hasTypeExport) {
              context.report(namedExportNode, 'Prefer default export.');
            }
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9wcmVmZXItZGVmYXVsdC1leHBvcnQuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJzcGVjaWZpZXJFeHBvcnRDb3VudCIsImhhc0RlZmF1bHRFeHBvcnQiLCJoYXNTdGFyRXhwb3J0IiwiaGFzVHlwZUV4cG9ydCIsIm5hbWVkRXhwb3J0Tm9kZSIsImNhcHR1cmVEZWNsYXJhdGlvbiIsImlkZW50aWZpZXJPclBhdHRlcm4iLCJwcm9wZXJ0aWVzIiwiZm9yRWFjaCIsInByb3BlcnR5IiwidmFsdWUiLCJlbGVtZW50cyIsIm5vZGUiLCJleHBvcnRlZCIsIm5hbWUiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsImlkIiwicmVwb3J0Il0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxxQzs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLFdBQUssMEJBQVEsdUJBQVIsQ0FERCxFQUZGOztBQUtKQyxZQUFRLEVBTEosRUFEUzs7O0FBU2ZDLFFBVGUsK0JBU1JDLE9BVFEsRUFTQztBQUNkLFVBQUlDLHVCQUF1QixDQUEzQjtBQUNBLFVBQUlDLG1CQUFtQixLQUF2QjtBQUNBLFVBQUlDLGdCQUFnQixLQUFwQjtBQUNBLFVBQUlDLGdCQUFnQixLQUFwQjtBQUNBLFVBQUlDLGtCQUFrQixJQUF0Qjs7QUFFQSxlQUFTQyxrQkFBVCxDQUE0QkMsbUJBQTVCLEVBQWlEO0FBQy9DLFlBQUlBLHVCQUF1QkEsb0JBQW9CWixJQUFwQixLQUE2QixlQUF4RCxFQUF5RTtBQUN2RTtBQUNBWSw4QkFBb0JDLFVBQXBCO0FBQ0dDLGlCQURILENBQ1csVUFBVUMsUUFBVixFQUFvQjtBQUMzQkosK0JBQW1CSSxTQUFTQyxLQUE1QjtBQUNELFdBSEg7QUFJRCxTQU5ELE1BTU8sSUFBSUosdUJBQXVCQSxvQkFBb0JaLElBQXBCLEtBQTZCLGNBQXhELEVBQXdFO0FBQzdFWSw4QkFBb0JLLFFBQXBCO0FBQ0dILGlCQURILENBQ1dILGtCQURYO0FBRUQsU0FITSxNQUdDO0FBQ1I7QUFDRUw7QUFDRDtBQUNGOztBQUVELGFBQU87QUFDTCwrQ0FBMEIsa0NBQVk7QUFDcENDLCtCQUFtQixJQUFuQjtBQUNELFdBRkQsaUNBREs7O0FBS0wsd0NBQW1CLHlCQUFVVyxJQUFWLEVBQWdCO0FBQ2pDLGdCQUFJQSxLQUFLQyxRQUFMLENBQWNDLElBQWQsS0FBdUIsU0FBM0IsRUFBc0M7QUFDcENiLGlDQUFtQixJQUFuQjtBQUNELGFBRkQsTUFFTztBQUNMRDtBQUNBSSxnQ0FBa0JRLElBQWxCO0FBQ0Q7QUFDRixXQVBELDBCQUxLOztBQWNMLCtDQUEwQixnQ0FBVUEsSUFBVixFQUFnQjtBQUN4QztBQUNBLGdCQUFJLENBQUNBLEtBQUtHLFdBQVYsRUFBdUIsT0FGaUI7O0FBSWhDckIsZ0JBSmdDLEdBSXZCa0IsS0FBS0csV0FKa0IsQ0FJaENyQixJQUpnQzs7QUFNeEM7QUFDRUEscUJBQVMsd0JBQVQ7QUFDQUEscUJBQVMsV0FEVDtBQUVBQSxxQkFBUyx3QkFGVDtBQUdBQSxxQkFBUyxzQkFKWDtBQUtFO0FBQ0FNO0FBQ0FHLDhCQUFnQixJQUFoQjtBQUNBO0FBQ0Q7O0FBRUQsZ0JBQUlTLEtBQUtHLFdBQUwsQ0FBaUJDLFlBQXJCLEVBQW1DO0FBQ2pDSixtQkFBS0csV0FBTCxDQUFpQkMsWUFBakIsQ0FBOEJSLE9BQTlCLENBQXNDLFVBQVVPLFdBQVYsRUFBdUI7QUFDM0RWLG1DQUFtQlUsWUFBWUUsRUFBL0I7QUFDRCxlQUZEO0FBR0QsYUFKRCxNQUlPO0FBQ0w7QUFDQWpCO0FBQ0Q7O0FBRURJLDhCQUFrQlEsSUFBbEI7QUFDRCxXQTNCRCxpQ0FkSzs7QUEyQ0wsaURBQTRCLG9DQUFZO0FBQ3RDWCwrQkFBbUIsSUFBbkI7QUFDRCxXQUZELG1DQTNDSzs7QUErQ0wsNkNBQXdCLGdDQUFZO0FBQ2xDQyw0QkFBZ0IsSUFBaEI7QUFDRCxXQUZELCtCQS9DSzs7QUFtREwscUNBQWdCLHVCQUFZO0FBQzFCLGdCQUFJRix5QkFBeUIsQ0FBekIsSUFBOEIsQ0FBQ0MsZ0JBQS9CLElBQW1ELENBQUNDLGFBQXBELElBQXFFLENBQUNDLGFBQTFFLEVBQXlGO0FBQ3ZGSixzQkFBUW1CLE1BQVIsQ0FBZWQsZUFBZixFQUFnQyx3QkFBaEM7QUFDRDtBQUNGLFdBSkQsc0JBbkRLLEVBQVA7O0FBeURELEtBekZjLG1CQUFqQiIsImZpbGUiOiJwcmVmZXItZGVmYXVsdC1leHBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICB1cmw6IGRvY3NVcmwoJ3ByZWZlci1kZWZhdWx0LWV4cG9ydCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGxldCBzcGVjaWZpZXJFeHBvcnRDb3VudCA9IDA7XG4gICAgbGV0IGhhc0RlZmF1bHRFeHBvcnQgPSBmYWxzZTtcbiAgICBsZXQgaGFzU3RhckV4cG9ydCA9IGZhbHNlO1xuICAgIGxldCBoYXNUeXBlRXhwb3J0ID0gZmFsc2U7XG4gICAgbGV0IG5hbWVkRXhwb3J0Tm9kZSA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiBjYXB0dXJlRGVjbGFyYXRpb24oaWRlbnRpZmllck9yUGF0dGVybikge1xuICAgICAgaWYgKGlkZW50aWZpZXJPclBhdHRlcm4gJiYgaWRlbnRpZmllck9yUGF0dGVybi50eXBlID09PSAnT2JqZWN0UGF0dGVybicpIHtcbiAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2FwdHVyZVxuICAgICAgICBpZGVudGlmaWVyT3JQYXR0ZXJuLnByb3BlcnRpZXNcbiAgICAgICAgICAuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgIGNhcHR1cmVEZWNsYXJhdGlvbihwcm9wZXJ0eS52YWx1ZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGlkZW50aWZpZXJPclBhdHRlcm4gJiYgaWRlbnRpZmllck9yUGF0dGVybi50eXBlID09PSAnQXJyYXlQYXR0ZXJuJykge1xuICAgICAgICBpZGVudGlmaWVyT3JQYXR0ZXJuLmVsZW1lbnRzXG4gICAgICAgICAgLmZvckVhY2goY2FwdHVyZURlY2xhcmF0aW9uKTtcbiAgICAgIH0gZWxzZSAge1xuICAgICAgLy8gYXNzdW1lIGl0J3MgYSBzaW5nbGUgc3RhbmRhcmQgaWRlbnRpZmllclxuICAgICAgICBzcGVjaWZpZXJFeHBvcnRDb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAnRXhwb3J0RGVmYXVsdFNwZWNpZmllcic6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaGFzRGVmYXVsdEV4cG9ydCA9IHRydWU7XG4gICAgICB9LFxuXG4gICAgICAnRXhwb3J0U3BlY2lmaWVyJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuZXhwb3J0ZWQubmFtZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgaGFzRGVmYXVsdEV4cG9ydCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3BlY2lmaWVyRXhwb3J0Q291bnQrKztcbiAgICAgICAgICBuYW1lZEV4cG9ydE5vZGUgPSBub2RlO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbic6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBzcGVjaWZpZXJzLCBub2RlLmRlY2xhcmF0aW9uIHNob3VsZCBiZSBudWxsXG4gICAgICAgIGlmICghbm9kZS5kZWNsYXJhdGlvbikgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHsgdHlwZSB9ID0gbm9kZS5kZWNsYXJhdGlvbjtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgdHlwZSA9PT0gJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nIHx8XG4gICAgICAgICAgdHlwZSA9PT0gJ1R5cGVBbGlhcycgfHxcbiAgICAgICAgICB0eXBlID09PSAnVFNJbnRlcmZhY2VEZWNsYXJhdGlvbicgfHxcbiAgICAgICAgICB0eXBlID09PSAnSW50ZXJmYWNlRGVjbGFyYXRpb24nXG4gICAgICAgICkge1xuICAgICAgICAgIHNwZWNpZmllckV4cG9ydENvdW50Kys7XG4gICAgICAgICAgaGFzVHlwZUV4cG9ydCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoZGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgIGNhcHR1cmVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbi5pZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gY2FwdHVyZXMgJ2V4cG9ydCBmdW5jdGlvbiBmb28oKSB7fScgc3ludGF4XG4gICAgICAgICAgc3BlY2lmaWVyRXhwb3J0Q291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWVkRXhwb3J0Tm9kZSA9IG5vZGU7XG4gICAgICB9LFxuXG4gICAgICAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJzogZnVuY3Rpb24gKCkge1xuICAgICAgICBoYXNEZWZhdWx0RXhwb3J0ID0gdHJ1ZTtcbiAgICAgIH0sXG5cbiAgICAgICdFeHBvcnRBbGxEZWNsYXJhdGlvbic6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaGFzU3RhckV4cG9ydCA9IHRydWU7XG4gICAgICB9LFxuXG4gICAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc3BlY2lmaWVyRXhwb3J0Q291bnQgPT09IDEgJiYgIWhhc0RlZmF1bHRFeHBvcnQgJiYgIWhhc1N0YXJFeHBvcnQgJiYgIWhhc1R5cGVFeHBvcnQpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChuYW1lZEV4cG9ydE5vZGUsICdQcmVmZXIgZGVmYXVsdCBleHBvcnQuJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=