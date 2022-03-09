"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = transformSource;
var _swc = require("../../swc");
var _options = require("../../swc/options");
function addExportNames(names, node) {
    switch(node.type){
        case 'Identifier':
            names.push(node.value);
            return;
        case 'ObjectPattern':
            for(let i = 0; i < node.properties.length; i++)addExportNames(names, node.properties[i]);
            return;
        case 'ArrayPattern':
            for(let i1 = 0; i1 < node.elements.length; i1++){
                const element = node.elements[i1];
                if (element) addExportNames(names, element);
            }
            return;
        case 'Property':
            addExportNames(names, node.value);
            return;
        case 'AssignmentPattern':
            addExportNames(names, node.left);
            return;
        case 'RestElement':
            addExportNames(names, node.argument);
            return;
        case 'ParenthesizedExpression':
            addExportNames(names, node.expression);
            return;
        default:
            return;
    }
}
async function parseExportNamesInto(resourcePath, transformedSource, names) {
    const opts = (0, _options).getBaseSWCOptions({
        filename: resourcePath,
        globalWindow: true
    });
    const { body  } = await (0, _swc).parse(transformedSource, {
        ...opts.jsc.parser,
        isModule: true
    });
    for(let i = 0; i < body.length; i++){
        const node = body[i];
        switch(node.type){
            // TODO: support export * from module path
            // case 'ExportAllDeclaration':
            case 'ExportDefaultExpression':
            case 'ExportDefaultDeclaration':
                names.push('default');
                continue;
            case 'ExportNamedDeclaration':
                if (node.declaration) {
                    if (node.declaration.type === 'VariableDeclaration') {
                        const declarations = node.declaration.declarations;
                        for(let j = 0; j < declarations.length; j++){
                            addExportNames(names, declarations[j].id);
                        }
                    } else {
                        addExportNames(names, node.declaration.id);
                    }
                }
                if (node.specificers) {
                    const specificers = node.specificers;
                    for(let j = 0; j < specificers.length; j++){
                        addExportNames(names, specificers[j].exported);
                    }
                }
                continue;
            default:
                break;
        }
    }
}
async function transformSource(source) {
    const { resourcePath , resourceQuery  } = this;
    if (resourceQuery !== '?flight') return source;
    let url = resourcePath;
    const transformedSource = source;
    if (typeof transformedSource !== 'string') {
        throw new Error('Expected source to have been transformed to a string.');
    }
    const names = [];
    await parseExportNamesInto(resourcePath, transformedSource, names);
    // next.js/packages/next/<component>.js
    if (/[\\/]next[\\/](link|image)\.js$/.test(url)) {
        names.push('default');
    }
    let newSrc = "const MODULE_REFERENCE = Symbol.for('react.module.reference');\n";
    for(let i = 0; i < names.length; i++){
        const name = names[i];
        if (name === 'default') {
            newSrc += 'export default ';
        } else {
            newSrc += 'export const ' + name + ' = ';
        }
        newSrc += '{ $$typeof: MODULE_REFERENCE, filepath: ';
        newSrc += JSON.stringify(url);
        newSrc += ', name: ';
        newSrc += JSON.stringify(name);
        newSrc += '};\n';
    }
    return newSrc;
}

//# sourceMappingURL=next-flight-client-loader.js.map