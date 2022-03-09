"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = nextPageConfig;
var _core = require("next/dist/compiled/babel/core");
var _constants = require("../../../shared/lib/constants");
const CONFIG_KEY = 'config';
// replace program path with just a variable with the drop identifier
function replaceBundle(path, t) {
    path.parentPath.replaceWith(t.program([
        t.variableDeclaration('const', [
            t.variableDeclarator(t.identifier(_constants.STRING_LITERAL_DROP_BUNDLE), t.stringLiteral(`${_constants.STRING_LITERAL_DROP_BUNDLE} ${Date.now()}`)), 
        ]), 
    ], []));
}
function errorMessage(state, details) {
    const pageName = (state.filename || '').split(state.cwd || '').pop() || 'unknown';
    return `Invalid page config export found. ${details} in file ${pageName}. See: https://nextjs.org/docs/messages/invalid-page-config`;
}
function nextPageConfig({ types: t  }) {
    return {
        visitor: {
            Program: {
                enter (path, state) {
                    path.traverse({
                        ExportDeclaration (exportPath, exportState) {
                            var ref;
                            if (_core.types.isExportNamedDeclaration(exportPath) && ((ref = exportPath.node.specifiers) === null || ref === void 0 ? void 0 : ref.some((specifier)=>{
                                return (t.isIdentifier(specifier.exported) ? specifier.exported.name : specifier.exported.value) === CONFIG_KEY;
                            })) && _core.types.isStringLiteral(exportPath.node.source)) {
                                throw new Error(errorMessage(exportState, 'Expected object but got export from'));
                            }
                        },
                        ExportNamedDeclaration (exportPath, exportState) {
                            var ref7, ref1;
                            if (exportState.bundleDropped || !exportPath.node.declaration && exportPath.node.specifiers.length === 0) {
                                return;
                            }
                            const config = {
                            };
                            const declarations = [
                                ...((ref7 = exportPath.node.declaration) === null || ref7 === void 0 ? void 0 : ref7.declarations) || [],
                                (ref1 = exportPath.scope.getBinding(CONFIG_KEY)) === null || ref1 === void 0 ? void 0 : ref1.path.node, 
                            ].filter(Boolean);
                            for (const specifier of exportPath.node.specifiers){
                                if ((t.isIdentifier(specifier.exported) ? specifier.exported.name : specifier.exported.value) === CONFIG_KEY) {
                                    // export {} from 'somewhere'
                                    if (_core.types.isStringLiteral(exportPath.node.source)) {
                                        throw new Error(errorMessage(exportState, `Expected object but got import`));
                                    // import hello from 'world'
                                    // export { hello as config }
                                    } else if (_core.types.isIdentifier(specifier.local)) {
                                        var ref5;
                                        if (_core.types.isImportSpecifier((ref5 = exportPath.scope.getBinding(specifier.local.name)) === null || ref5 === void 0 ? void 0 : ref5.path.node)) {
                                            throw new Error(errorMessage(exportState, `Expected object but got import`));
                                        }
                                    }
                                }
                            }
                            for (const declaration of declarations){
                                if (!_core.types.isIdentifier(declaration.id, {
                                    name: CONFIG_KEY
                                })) {
                                    continue;
                                }
                                let { init  } = declaration;
                                if (_core.types.isTSAsExpression(init)) {
                                    init = init.expression;
                                }
                                if (!_core.types.isObjectExpression(init)) {
                                    const got = init ? init.type : 'undefined';
                                    throw new Error(errorMessage(exportState, `Expected object but got ${got}`));
                                }
                                for (const prop of init.properties){
                                    if (_core.types.isSpreadElement(prop)) {
                                        throw new Error(errorMessage(exportState, `Property spread is not allowed`));
                                    }
                                    const { name  } = prop.key;
                                    if (_core.types.isIdentifier(prop.key, {
                                        name: 'amp'
                                    })) {
                                        if (!_core.types.isObjectProperty(prop)) {
                                            throw new Error(errorMessage(exportState, `Invalid property "${name}"`));
                                        }
                                        if (!_core.types.isBooleanLiteral(prop.value) && !_core.types.isStringLiteral(prop.value)) {
                                            throw new Error(errorMessage(exportState, `Invalid value for "${name}"`));
                                        }
                                        config.amp = prop.value.value;
                                    }
                                }
                            }
                            if (config.amp === true) {
                                var ref, ref5;
                                if (!((ref = exportState.file) === null || ref === void 0 ? void 0 : (ref5 = ref.opts) === null || ref5 === void 0 ? void 0 : ref5.caller.isDev)) {
                                    // don't replace bundle in development so HMR can track
                                    // dependencies and trigger reload when they are changed
                                    replaceBundle(exportPath, t);
                                }
                                exportState.bundleDropped = true;
                                return;
                            }
                        }
                    }, state);
                }
            }
        }
    };
}

//# sourceMappingURL=next-page-config.js.map