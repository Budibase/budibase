"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const util = __importStar(require("../util"));
exports.default = util.createRule({
    name: 'typedef',
    meta: {
        docs: {
            description: 'Requires type annotations to exist',
            recommended: false,
        },
        messages: {
            expectedTypedef: 'Expected a type annotation.',
            expectedTypedefNamed: 'Expected {{name}} to have a type annotation.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    ["arrayDestructuring" /* ArrayDestructuring */]: { type: 'boolean' },
                    ["arrowParameter" /* ArrowParameter */]: { type: 'boolean' },
                    ["memberVariableDeclaration" /* MemberVariableDeclaration */]: { type: 'boolean' },
                    ["objectDestructuring" /* ObjectDestructuring */]: { type: 'boolean' },
                    ["parameter" /* Parameter */]: { type: 'boolean' },
                    ["propertyDeclaration" /* PropertyDeclaration */]: { type: 'boolean' },
                    ["variableDeclaration" /* VariableDeclaration */]: { type: 'boolean' },
                    ["variableDeclarationIgnoreFunction" /* VariableDeclarationIgnoreFunction */]: { type: 'boolean' },
                },
            },
        ],
        type: 'suggestion',
    },
    defaultOptions: [
        {
            ["arrayDestructuring" /* ArrayDestructuring */]: false,
            ["arrowParameter" /* ArrowParameter */]: false,
            ["memberVariableDeclaration" /* MemberVariableDeclaration */]: false,
            ["objectDestructuring" /* ObjectDestructuring */]: false,
            ["parameter" /* Parameter */]: false,
            ["propertyDeclaration" /* PropertyDeclaration */]: false,
            ["variableDeclaration" /* VariableDeclaration */]: false,
            ["variableDeclarationIgnoreFunction" /* VariableDeclarationIgnoreFunction */]: false,
        },
    ],
    create(context, [{ arrayDestructuring, arrowParameter, memberVariableDeclaration, objectDestructuring, parameter, propertyDeclaration, variableDeclaration, variableDeclarationIgnoreFunction, },]) {
        function report(location, name) {
            context.report({
                node: location,
                messageId: name ? 'expectedTypedefNamed' : 'expectedTypedef',
                data: { name },
            });
        }
        function getNodeName(node) {
            return node.type === utils_1.AST_NODE_TYPES.Identifier ? node.name : undefined;
        }
        function isForOfStatementContext(node) {
            let current = node.parent;
            while (current) {
                switch (current.type) {
                    case utils_1.AST_NODE_TYPES.VariableDeclarator:
                    case utils_1.AST_NODE_TYPES.VariableDeclaration:
                    case utils_1.AST_NODE_TYPES.ObjectPattern:
                    case utils_1.AST_NODE_TYPES.ArrayPattern:
                    case utils_1.AST_NODE_TYPES.Property:
                        current = current.parent;
                        break;
                    case utils_1.AST_NODE_TYPES.ForOfStatement:
                        return true;
                    default:
                        current = undefined;
                }
            }
            return false;
        }
        function checkParameters(params) {
            for (const param of params) {
                let annotationNode;
                switch (param.type) {
                    case utils_1.AST_NODE_TYPES.AssignmentPattern:
                        annotationNode = param.left;
                        break;
                    case utils_1.AST_NODE_TYPES.TSParameterProperty:
                        annotationNode = param.parameter;
                        // Check TS parameter property with default value like `constructor(private param: string = 'something') {}`
                        if (annotationNode &&
                            annotationNode.type === utils_1.AST_NODE_TYPES.AssignmentPattern) {
                            annotationNode = annotationNode.left;
                        }
                        break;
                    default:
                        annotationNode = param;
                        break;
                }
                if (annotationNode !== undefined && !annotationNode.typeAnnotation) {
                    report(param, getNodeName(param));
                }
            }
        }
        function isVariableDeclarationIgnoreFunction(node) {
            return (variableDeclarationIgnoreFunction === true &&
                (node.type === utils_1.AST_NODE_TYPES.ArrowFunctionExpression ||
                    node.type === utils_1.AST_NODE_TYPES.FunctionExpression));
        }
        function isAncestorHasTypeAnnotation(node) {
            let ancestor = node.parent;
            while (ancestor) {
                if (ancestor.type === utils_1.AST_NODE_TYPES.ObjectPattern &&
                    ancestor.typeAnnotation) {
                    return true;
                }
                ancestor = ancestor.parent;
            }
            return false;
        }
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (arrayDestructuring && {
            ArrayPattern(node) {
                var _a;
                if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.type) === utils_1.AST_NODE_TYPES.RestElement &&
                    node.parent.typeAnnotation) {
                    return;
                }
                if (!node.typeAnnotation && !isForOfStatementContext(node)) {
                    report(node);
                }
            },
        })), (arrowParameter && {
            ArrowFunctionExpression(node) {
                checkParameters(node.params);
            },
        })), (memberVariableDeclaration && {
            PropertyDefinition(node) {
                if (!(node.value && isVariableDeclarationIgnoreFunction(node.value)) &&
                    !node.typeAnnotation) {
                    report(node, node.key.type === utils_1.AST_NODE_TYPES.Identifier
                        ? node.key.name
                        : undefined);
                }
            },
        })), (parameter && {
            'FunctionDeclaration, FunctionExpression'(node) {
                checkParameters(node.params);
            },
        })), (objectDestructuring && {
            ObjectPattern(node) {
                if (!node.typeAnnotation &&
                    !isForOfStatementContext(node) &&
                    !isAncestorHasTypeAnnotation(node)) {
                    report(node);
                }
            },
        })), (propertyDeclaration && {
            'TSIndexSignature, TSPropertySignature'(node) {
                if (!node.typeAnnotation) {
                    report(node, node.type === utils_1.AST_NODE_TYPES.TSPropertySignature
                        ? getNodeName(node.key)
                        : undefined);
                }
            },
        })), { VariableDeclarator(node) {
                if (!variableDeclaration ||
                    node.id.typeAnnotation ||
                    (node.id.type === utils_1.AST_NODE_TYPES.ArrayPattern &&
                        !arrayDestructuring) ||
                    (node.id.type === utils_1.AST_NODE_TYPES.ObjectPattern &&
                        !objectDestructuring) ||
                    (node.init && isVariableDeclarationIgnoreFunction(node.init))) {
                    return;
                }
                let current = node.parent;
                while (current) {
                    switch (current.type) {
                        case utils_1.AST_NODE_TYPES.VariableDeclaration:
                            // Keep looking upwards
                            current = current.parent;
                            break;
                        case utils_1.AST_NODE_TYPES.ForOfStatement:
                        case utils_1.AST_NODE_TYPES.ForInStatement:
                            // Stop traversing and don't report an error
                            return;
                        default:
                            // Stop traversing
                            current = undefined;
                            break;
                    }
                }
                report(node, getNodeName(node.id));
            } });
    },
});
//# sourceMappingURL=typedef.js.map