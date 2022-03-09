'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

function isRequire(node) {
  return node &&
  node.callee &&
  node.callee.type === 'Identifier' &&
  node.callee.name === 'require' &&
  node.arguments.length >= 1;
}

function isDynamicImport(node) {
  return node &&
  node.callee &&
  node.callee.type === 'Import';
}

function isStaticValue(arg) {
  return arg.type === 'Literal' ||
  arg.type === 'TemplateLiteral' && arg.expressions.length === 0;
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: (0, _docsUrl2['default'])('no-dynamic-require') },

    schema: [
    {
      type: 'object',
      properties: {
        esmodule: {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = context.options[0] || {};

      return {
        CallExpression: function () {function CallExpression(node) {
            if (!node.arguments[0] || isStaticValue(node.arguments[0])) {
              return;
            }
            if (isRequire(node)) {
              return context.report({
                node: node,
                message: 'Calls to require() should use string literals' });

            }
            if (options.esmodule && isDynamicImport(node)) {
              return context.report({
                node: node,
                message: 'Calls to import() should use string literals' });

            }
          }return CallExpression;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1keW5hbWljLXJlcXVpcmUuanMiXSwibmFtZXMiOlsiaXNSZXF1aXJlIiwibm9kZSIsImNhbGxlZSIsInR5cGUiLCJuYW1lIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiaXNEeW5hbWljSW1wb3J0IiwiaXNTdGF0aWNWYWx1ZSIsImFyZyIsImV4cHJlc3Npb25zIiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJkb2NzIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsImVzbW9kdWxlIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjcmVhdGUiLCJjb250ZXh0Iiwib3B0aW9ucyIsIkNhbGxFeHByZXNzaW9uIiwicmVwb3J0IiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6ImFBQUEscUM7O0FBRUEsU0FBU0EsU0FBVCxDQUFtQkMsSUFBbkIsRUFBeUI7QUFDdkIsU0FBT0E7QUFDTEEsT0FBS0MsTUFEQTtBQUVMRCxPQUFLQyxNQUFMLENBQVlDLElBQVosS0FBcUIsWUFGaEI7QUFHTEYsT0FBS0MsTUFBTCxDQUFZRSxJQUFaLEtBQXFCLFNBSGhCO0FBSUxILE9BQUtJLFNBQUwsQ0FBZUMsTUFBZixJQUF5QixDQUozQjtBQUtEOztBQUVELFNBQVNDLGVBQVQsQ0FBeUJOLElBQXpCLEVBQStCO0FBQzdCLFNBQU9BO0FBQ0xBLE9BQUtDLE1BREE7QUFFTEQsT0FBS0MsTUFBTCxDQUFZQyxJQUFaLEtBQXFCLFFBRnZCO0FBR0Q7O0FBRUQsU0FBU0ssYUFBVCxDQUF1QkMsR0FBdkIsRUFBNEI7QUFDMUIsU0FBT0EsSUFBSU4sSUFBSixLQUFhLFNBQWI7QUFDSk0sTUFBSU4sSUFBSixLQUFhLGlCQUFiLElBQWtDTSxJQUFJQyxXQUFKLENBQWdCSixNQUFoQixLQUEyQixDQURoRTtBQUVEOztBQUVESyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSlYsVUFBTSxZQURGO0FBRUpXLFVBQU07QUFDSkMsV0FBSywwQkFBUSxvQkFBUixDQURELEVBRkY7O0FBS0pDLFlBQVE7QUFDTjtBQUNFYixZQUFNLFFBRFI7QUFFRWMsa0JBQVk7QUFDVkMsa0JBQVU7QUFDUmYsZ0JBQU0sU0FERSxFQURBLEVBRmQ7OztBQU9FZ0IsNEJBQXNCLEtBUHhCLEVBRE0sQ0FMSixFQURTOzs7OztBQW1CZkMsUUFuQmUsK0JBbUJSQyxPQW5CUSxFQW1CQztBQUNkLFVBQU1DLFVBQVVELFFBQVFDLE9BQVIsQ0FBZ0IsQ0FBaEIsS0FBc0IsRUFBdEM7O0FBRUEsYUFBTztBQUNMQyxzQkFESyx1Q0FDVXRCLElBRFYsRUFDZ0I7QUFDbkIsZ0JBQUksQ0FBQ0EsS0FBS0ksU0FBTCxDQUFlLENBQWYsQ0FBRCxJQUFzQkcsY0FBY1AsS0FBS0ksU0FBTCxDQUFlLENBQWYsQ0FBZCxDQUExQixFQUE0RDtBQUMxRDtBQUNEO0FBQ0QsZ0JBQUlMLFVBQVVDLElBQVYsQ0FBSixFQUFxQjtBQUNuQixxQkFBT29CLFFBQVFHLE1BQVIsQ0FBZTtBQUNwQnZCLDBCQURvQjtBQUVwQndCLHlCQUFTLCtDQUZXLEVBQWYsQ0FBUDs7QUFJRDtBQUNELGdCQUFJSCxRQUFRSixRQUFSLElBQW9CWCxnQkFBZ0JOLElBQWhCLENBQXhCLEVBQStDO0FBQzdDLHFCQUFPb0IsUUFBUUcsTUFBUixDQUFlO0FBQ3BCdkIsMEJBRG9CO0FBRXBCd0IseUJBQVMsOENBRlcsRUFBZixDQUFQOztBQUlEO0FBQ0YsV0FqQkksMkJBQVA7O0FBbUJELEtBekNjLG1CQUFqQiIsImZpbGUiOiJuby1keW5hbWljLXJlcXVpcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuZnVuY3Rpb24gaXNSZXF1aXJlKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgJiZcbiAgICBub2RlLmNhbGxlZSAmJlxuICAgIG5vZGUuY2FsbGVlLnR5cGUgPT09ICdJZGVudGlmaWVyJyAmJlxuICAgIG5vZGUuY2FsbGVlLm5hbWUgPT09ICdyZXF1aXJlJyAmJlxuICAgIG5vZGUuYXJndW1lbnRzLmxlbmd0aCA+PSAxO1xufVxuXG5mdW5jdGlvbiBpc0R5bmFtaWNJbXBvcnQobm9kZSkge1xuICByZXR1cm4gbm9kZSAmJlxuICAgIG5vZGUuY2FsbGVlICYmXG4gICAgbm9kZS5jYWxsZWUudHlwZSA9PT0gJ0ltcG9ydCc7XG59XG5cbmZ1bmN0aW9uIGlzU3RhdGljVmFsdWUoYXJnKSB7XG4gIHJldHVybiBhcmcudHlwZSA9PT0gJ0xpdGVyYWwnIHx8XG4gICAgKGFyZy50eXBlID09PSAnVGVtcGxhdGVMaXRlcmFsJyAmJiBhcmcuZXhwcmVzc2lvbnMubGVuZ3RoID09PSAwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczoge1xuICAgICAgdXJsOiBkb2NzVXJsKCduby1keW5hbWljLXJlcXVpcmUnKSxcbiAgICB9LFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGVzbW9kdWxlOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICBDYWxsRXhwcmVzc2lvbihub2RlKSB7XG4gICAgICAgIGlmICghbm9kZS5hcmd1bWVudHNbMF0gfHwgaXNTdGF0aWNWYWx1ZShub2RlLmFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUmVxdWlyZShub2RlKSkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0NhbGxzIHRvIHJlcXVpcmUoKSBzaG91bGQgdXNlIHN0cmluZyBsaXRlcmFscycsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuZXNtb2R1bGUgJiYgaXNEeW5hbWljSW1wb3J0KG5vZGUpKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnQ2FsbHMgdG8gaW1wb3J0KCkgc2hvdWxkIHVzZSBzdHJpbmcgbGl0ZXJhbHMnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19