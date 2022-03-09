'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-default-export') },

    schema: [] },


  create: function () {function create(context) {
      // ignore non-modules
      if (context.parserOptions.sourceType !== 'module') {
        return {};
      }

      var preferNamed = 'Prefer named exports.';
      var noAliasDefault = function () {function noAliasDefault(_ref) {var local = _ref.local;return 'Do not alias `' + String(local.name) + '` as `default`. Just export `' + String(local.name) + '` itself instead.';}return noAliasDefault;}();

      return {
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {var _ref2 =
            context.getSourceCode().getFirstTokens(node)[1] || {},loc = _ref2.loc;
            context.report({ node: node, message: preferNamed, loc: loc });
          }return ExportDefaultDeclaration;}(),

        ExportNamedDeclaration: function () {function ExportNamedDeclaration(node) {
            node.specifiers.filter(function (specifier) {return specifier.exported.name === 'default';}).forEach(function (specifier) {var _ref3 =
              context.getSourceCode().getFirstTokens(node)[1] || {},loc = _ref3.loc;
              if (specifier.type === 'ExportDefaultSpecifier') {
                context.report({ node: node, message: preferNamed, loc: loc });
              } else if (specifier.type === 'ExportSpecifier') {
                context.report({ node: node, message: noAliasDefault(specifier), loc: loc });
              }
            });
          }return ExportNamedDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kZWZhdWx0LWV4cG9ydC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsInBhcnNlck9wdGlvbnMiLCJzb3VyY2VUeXBlIiwicHJlZmVyTmFtZWQiLCJub0FsaWFzRGVmYXVsdCIsImxvY2FsIiwibmFtZSIsIkV4cG9ydERlZmF1bHREZWNsYXJhdGlvbiIsIm5vZGUiLCJnZXRTb3VyY2VDb2RlIiwiZ2V0Rmlyc3RUb2tlbnMiLCJsb2MiLCJyZXBvcnQiLCJtZXNzYWdlIiwiRXhwb3J0TmFtZWREZWNsYXJhdGlvbiIsInNwZWNpZmllcnMiLCJmaWx0ZXIiLCJzcGVjaWZpZXIiLCJleHBvcnRlZCIsImZvckVhY2giXSwibWFwcGluZ3MiOiJhQUFBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsV0FBSywwQkFBUSxtQkFBUixDQURELEVBRkY7O0FBS0pDLFlBQVEsRUFMSixFQURTOzs7QUFTZkMsUUFUZSwrQkFTUkMsT0FUUSxFQVNDO0FBQ2Q7QUFDQSxVQUFJQSxRQUFRQyxhQUFSLENBQXNCQyxVQUF0QixLQUFxQyxRQUF6QyxFQUFtRDtBQUNqRCxlQUFPLEVBQVA7QUFDRDs7QUFFRCxVQUFNQyxjQUFjLHVCQUFwQjtBQUNBLFVBQU1DLDhCQUFpQixTQUFqQkEsY0FBaUIsWUFBR0MsS0FBSCxRQUFHQSxLQUFILGtDQUFpQ0EsTUFBTUMsSUFBdkMsNkNBQStFRCxNQUFNQyxJQUFyRix5QkFBakIseUJBQU47O0FBRUEsYUFBTztBQUNMQyxnQ0FESyxpREFDb0JDLElBRHBCLEVBQzBCO0FBQ2JSLG9CQUFRUyxhQUFSLEdBQXdCQyxjQUF4QixDQUF1Q0YsSUFBdkMsRUFBNkMsQ0FBN0MsS0FBbUQsRUFEdEMsQ0FDckJHLEdBRHFCLFNBQ3JCQSxHQURxQjtBQUU3Qlgsb0JBQVFZLE1BQVIsQ0FBZSxFQUFFSixVQUFGLEVBQVFLLFNBQVNWLFdBQWpCLEVBQThCUSxRQUE5QixFQUFmO0FBQ0QsV0FKSTs7QUFNTEcsOEJBTkssK0NBTWtCTixJQU5sQixFQU13QjtBQUMzQkEsaUJBQUtPLFVBQUwsQ0FBZ0JDLE1BQWhCLENBQXVCLDZCQUFhQyxVQUFVQyxRQUFWLENBQW1CWixJQUFuQixLQUE0QixTQUF6QyxFQUF2QixFQUEyRWEsT0FBM0UsQ0FBbUYscUJBQWE7QUFDOUVuQixzQkFBUVMsYUFBUixHQUF3QkMsY0FBeEIsQ0FBdUNGLElBQXZDLEVBQTZDLENBQTdDLEtBQW1ELEVBRDJCLENBQ3RGRyxHQURzRixTQUN0RkEsR0FEc0Y7QUFFOUYsa0JBQUlNLFVBQVV0QixJQUFWLEtBQW1CLHdCQUF2QixFQUFpRDtBQUMvQ0ssd0JBQVFZLE1BQVIsQ0FBZSxFQUFFSixVQUFGLEVBQVFLLFNBQVNWLFdBQWpCLEVBQThCUSxRQUE5QixFQUFmO0FBQ0QsZUFGRCxNQUVPLElBQUlNLFVBQVV0QixJQUFWLEtBQW1CLGlCQUF2QixFQUEwQztBQUMvQ0ssd0JBQVFZLE1BQVIsQ0FBZSxFQUFFSixVQUFGLEVBQVFLLFNBQVNULGVBQWVhLFNBQWYsQ0FBakIsRUFBNENOLFFBQTVDLEVBQWY7QUFDRDtBQUNGLGFBUEQ7QUFRRCxXQWZJLG1DQUFQOztBQWlCRCxLQW5DYyxtQkFBakIiLCJmaWxlIjoibm8tZGVmYXVsdC1leHBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCduby1kZWZhdWx0LWV4cG9ydCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIC8vIGlnbm9yZSBub24tbW9kdWxlc1xuICAgIGlmIChjb250ZXh0LnBhcnNlck9wdGlvbnMuc291cmNlVHlwZSAhPT0gJ21vZHVsZScpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmVmZXJOYW1lZCA9ICdQcmVmZXIgbmFtZWQgZXhwb3J0cy4nO1xuICAgIGNvbnN0IG5vQWxpYXNEZWZhdWx0ID0gKHsgbG9jYWwgfSkgPT4gYERvIG5vdCBhbGlhcyBcXGAke2xvY2FsLm5hbWV9XFxgIGFzIFxcYGRlZmF1bHRcXGAuIEp1c3QgZXhwb3J0IFxcYCR7bG9jYWwubmFtZX1cXGAgaXRzZWxmIGluc3RlYWQuYDtcblxuICAgIHJldHVybiB7XG4gICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBjb25zdCB7IGxvYyB9ID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCkuZ2V0Rmlyc3RUb2tlbnMobm9kZSlbMV0gfHwge307XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZSwgbWVzc2FnZTogcHJlZmVyTmFtZWQsIGxvYyB9KTtcbiAgICAgIH0sXG5cbiAgICAgIEV4cG9ydE5hbWVkRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBub2RlLnNwZWNpZmllcnMuZmlsdGVyKHNwZWNpZmllciA9PiBzcGVjaWZpZXIuZXhwb3J0ZWQubmFtZSA9PT0gJ2RlZmF1bHQnKS5mb3JFYWNoKHNwZWNpZmllciA9PiB7XG4gICAgICAgICAgY29uc3QgeyBsb2MgfSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpLmdldEZpcnN0VG9rZW5zKG5vZGUpWzFdIHx8IHt9O1xuICAgICAgICAgIGlmIChzcGVjaWZpZXIudHlwZSA9PT0gJ0V4cG9ydERlZmF1bHRTcGVjaWZpZXInKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2U6IHByZWZlck5hbWVkLCBsb2MgfSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcGVjaWZpZXIudHlwZSA9PT0gJ0V4cG9ydFNwZWNpZmllcicpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZSwgbWVzc2FnZTogbm9BbGlhc0RlZmF1bHQoc3BlY2lmaWVyKSwgbG9jICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==