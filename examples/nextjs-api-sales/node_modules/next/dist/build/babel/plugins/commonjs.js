"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = CommonJSModulePlugin;
var _pluginTransformModulesCommonjs = _interopRequireDefault(require("next/dist/compiled/babel/plugin-transform-modules-commonjs"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function CommonJSModulePlugin(...args) {
    const commonjs = (0, _pluginTransformModulesCommonjs).default(...args);
    return {
        visitor: {
            Program: {
                exit (path, state) {
                    let foundModuleExports = false;
                    path.traverse({
                        MemberExpression (expressionPath) {
                            if (expressionPath.node.object.name !== 'module') return;
                            if (expressionPath.node.property.name !== 'exports') return;
                            foundModuleExports = true;
                        }
                    });
                    if (!foundModuleExports) {
                        return;
                    }
                    commonjs.visitor.Program.exit.call(this, path, state);
                }
            }
        }
    };
}

//# sourceMappingURL=commonjs.js.map