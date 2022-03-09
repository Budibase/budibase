'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-named-default') },

    schema: [] },


  create: function () {function create(context) {
      return {
        'ImportDeclaration': function () {function ImportDeclaration(node) {
            node.specifiers.forEach(function (im) {
              if (im.importKind === 'type' || im.importKind === 'typeof') {
                return;
              }

              if (im.type === 'ImportSpecifier' && im.imported.name === 'default') {
                context.report({
                  node: im.local,
                  message: 'Use default import syntax to import \'' + String(im.local.name) + '\'.' });
              }
            });
          }return ImportDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1uYW1lZC1kZWZhdWx0LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJ1cmwiLCJzY2hlbWEiLCJjcmVhdGUiLCJjb250ZXh0Iiwibm9kZSIsInNwZWNpZmllcnMiLCJmb3JFYWNoIiwiaW0iLCJpbXBvcnRLaW5kIiwiaW1wb3J0ZWQiLCJuYW1lIiwicmVwb3J0IiwibG9jYWwiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiYUFBQSxxQzs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sWUFERjtBQUVKQyxVQUFNO0FBQ0pDLFdBQUssMEJBQVEsa0JBQVIsQ0FERCxFQUZGOztBQUtKQyxZQUFRLEVBTEosRUFEUzs7O0FBU2ZDLFFBVGUsK0JBU1JDLE9BVFEsRUFTQztBQUNkLGFBQU87QUFDTCwwQ0FBcUIsMkJBQVVDLElBQVYsRUFBZ0I7QUFDbkNBLGlCQUFLQyxVQUFMLENBQWdCQyxPQUFoQixDQUF3QixVQUFVQyxFQUFWLEVBQWM7QUFDcEMsa0JBQUlBLEdBQUdDLFVBQUgsS0FBa0IsTUFBbEIsSUFBNEJELEdBQUdDLFVBQUgsS0FBa0IsUUFBbEQsRUFBNEQ7QUFDMUQ7QUFDRDs7QUFFRCxrQkFBSUQsR0FBR1QsSUFBSCxLQUFZLGlCQUFaLElBQWlDUyxHQUFHRSxRQUFILENBQVlDLElBQVosS0FBcUIsU0FBMUQsRUFBcUU7QUFDbkVQLHdCQUFRUSxNQUFSLENBQWU7QUFDYlAsd0JBQU1HLEdBQUdLLEtBREk7QUFFYkMsNkVBQWlETixHQUFHSyxLQUFILENBQVNGLElBQTFELFNBRmEsRUFBZjtBQUdEO0FBQ0YsYUFWRDtBQVdELFdBWkQsNEJBREssRUFBUDs7QUFlRCxLQXpCYyxtQkFBakIiLCJmaWxlIjoibm8tbmFtZWQtZGVmYXVsdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLW5hbWVkLWRlZmF1bHQnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ0ltcG9ydERlY2xhcmF0aW9uJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgbm9kZS5zcGVjaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKGltKSB7XG4gICAgICAgICAgaWYgKGltLmltcG9ydEtpbmQgPT09ICd0eXBlJyB8fCBpbS5pbXBvcnRLaW5kID09PSAndHlwZW9mJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpbS50eXBlID09PSAnSW1wb3J0U3BlY2lmaWVyJyAmJiBpbS5pbXBvcnRlZC5uYW1lID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgICAgbm9kZTogaW0ubG9jYWwsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IGBVc2UgZGVmYXVsdCBpbXBvcnQgc3ludGF4IHRvIGltcG9ydCAnJHtpbS5sb2NhbC5uYW1lfScuYCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==