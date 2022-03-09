"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _default;
var _path = require("path");
function _default({ types: t  }) {
    return {
        visitor: {
            ImportDeclaration (path, state) {
                let source = path.node.source.value;
                if (source !== 'next/dynamic') return;
                let defaultSpecifier = path.get('specifiers').find((specifier)=>{
                    return specifier.isImportDefaultSpecifier();
                });
                if (!defaultSpecifier) return;
                const bindingName = defaultSpecifier.node.local.name;
                const binding = path.scope.getBinding(bindingName);
                if (!binding) {
                    return;
                }
                binding.referencePaths.forEach((refPath)=>{
                    var ref, ref1;
                    let callExpression = refPath.parentPath;
                    if (callExpression.isMemberExpression() && callExpression.node.computed === false) {
                        const property = callExpression.get('property');
                        if (!Array.isArray(property) && property.isIdentifier({
                            name: 'Map'
                        })) {
                            callExpression = callExpression.parentPath;
                        }
                    }
                    if (!callExpression.isCallExpression()) return;
                    const callExpression_ = callExpression;
                    let args = callExpression_.get('arguments');
                    if (args.length > 2) {
                        throw callExpression_.buildCodeFrameError('next/dynamic only accepts 2 arguments');
                    }
                    if (!args[0]) {
                        return;
                    }
                    let loader;
                    let options;
                    if (args[0].isObjectExpression()) {
                        options = args[0];
                    } else {
                        if (!args[1]) {
                            callExpression_.node.arguments.push(t.objectExpression([]));
                        }
                        // This is needed as the code is modified above
                        args = callExpression_.get('arguments');
                        loader = args[0];
                        options = args[1];
                    }
                    if (!options.isObjectExpression()) return;
                    const options_ = options;
                    let properties = options_.get('properties');
                    let propertiesMap = {
                    };
                    properties.forEach((property)=>{
                        const key = property.get('key');
                        propertiesMap[key.node.name] = property;
                    });
                    if (propertiesMap.loadableGenerated) {
                        return;
                    }
                    if (propertiesMap.loader) {
                        loader = propertiesMap.loader.get('value');
                    }
                    if (propertiesMap.modules) {
                        loader = propertiesMap.modules.get('value');
                    }
                    if (!loader || Array.isArray(loader)) {
                        return;
                    }
                    const dynamicImports = [];
                    const dynamicKeys = [];
                    loader.traverse({
                        Import (importPath) {
                            var ref2;
                            const importArguments = importPath.parentPath.get('arguments');
                            if (!Array.isArray(importArguments)) return;
                            const node = importArguments[0].node;
                            dynamicImports.push(node);
                            dynamicKeys.push(t.binaryExpression('+', t.stringLiteral((((ref2 = state.file.opts.caller) === null || ref2 === void 0 ? void 0 : ref2.pagesDir) ? (0, _path).relative(state.file.opts.caller.pagesDir, state.file.opts.filename) : state.file.opts.filename) + ' -> '), node));
                        }
                    });
                    if (!dynamicImports.length) return;
                    options.node.properties.push(t.objectProperty(t.identifier('loadableGenerated'), t.objectExpression(((ref = state.file.opts.caller) === null || ref === void 0 ? void 0 : ref.isDev) || ((ref1 = state.file.opts.caller) === null || ref1 === void 0 ? void 0 : ref1.isServer) ? [
                        t.objectProperty(t.identifier('modules'), t.arrayExpression(dynamicKeys)), 
                    ] : [
                        t.objectProperty(t.identifier('webpack'), t.arrowFunctionExpression([], t.arrayExpression(dynamicImports.map((dynamicImport)=>{
                            return t.callExpression(t.memberExpression(t.identifier('require'), t.identifier('resolveWeak')), [
                                dynamicImport
                            ]);
                        })))), 
                    ])));
                    // Turns `dynamic(import('something'))` into `dynamic(() => import('something'))` for backwards compat.
                    // This is the replicate the behavior in versions below Next.js 7 where we magically handled not executing the `import()` too.
                    // We'll deprecate this behavior and provide a codemod for it in 7.1.
                    if (loader.isCallExpression()) {
                        const arrowFunction = t.arrowFunctionExpression([], loader.node);
                        loader.replaceWith(arrowFunction);
                    }
                });
            }
        }
    };
}

//# sourceMappingURL=react-loadable-plugin.js.map