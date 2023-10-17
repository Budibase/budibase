"use strict";
/**
 * @fileoverview Really small utility functions that didn't deserve their own files
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.upperCaseFirst = exports.MemberNameType = exports.isDefinitionFile = exports.getNameFromMember = exports.getNameFromIndexSignature = exports.getEnumNames = exports.formatWordList = exports.findFirstResult = exports.arraysAreEqual = exports.arrayGroupByToMap = void 0;
const utils_1 = require("@typescript-eslint/utils");
const type_utils_1 = require("@typescript-eslint/type-utils");
/**
 * Check if the context file name is *.d.ts or *.d.tsx
 */
function isDefinitionFile(fileName) {
    return /\.d\.tsx?$/i.test(fileName || '');
}
exports.isDefinitionFile = isDefinitionFile;
/**
 * Upper cases the first character or the string
 */
function upperCaseFirst(str) {
    return str[0].toUpperCase() + str.slice(1);
}
exports.upperCaseFirst = upperCaseFirst;
function arrayGroupByToMap(array, getKey) {
    const groups = new Map();
    for (const item of array) {
        const key = getKey(item);
        const existing = groups.get(key);
        if (existing) {
            existing.push(item);
        }
        else {
            groups.set(key, [item]);
        }
    }
    return groups;
}
exports.arrayGroupByToMap = arrayGroupByToMap;
function arraysAreEqual(a, b, eq) {
    return (a === b ||
        (a !== undefined &&
            b !== undefined &&
            a.length === b.length &&
            a.every((x, idx) => eq(x, b[idx]))));
}
exports.arraysAreEqual = arraysAreEqual;
/** Returns the first non-`undefined` result. */
function findFirstResult(inputs, getResult) {
    for (const element of inputs) {
        const result = getResult(element);
        if (result !== undefined) {
            return result;
        }
    }
    return undefined;
}
exports.findFirstResult = findFirstResult;
/**
 * Gets a string representation of the name of the index signature.
 */
function getNameFromIndexSignature(node) {
    const propName = node.parameters.find((parameter) => parameter.type === utils_1.AST_NODE_TYPES.Identifier);
    return propName ? propName.name : '(index signature)';
}
exports.getNameFromIndexSignature = getNameFromIndexSignature;
var MemberNameType;
(function (MemberNameType) {
    MemberNameType[MemberNameType["Private"] = 1] = "Private";
    MemberNameType[MemberNameType["Quoted"] = 2] = "Quoted";
    MemberNameType[MemberNameType["Normal"] = 3] = "Normal";
    MemberNameType[MemberNameType["Expression"] = 4] = "Expression";
})(MemberNameType || (MemberNameType = {}));
exports.MemberNameType = MemberNameType;
/**
 * Gets a string name representation of the name of the given MethodDefinition
 * or PropertyDefinition node, with handling for computed property names.
 */
function getNameFromMember(member, sourceCode) {
    if (member.key.type === utils_1.AST_NODE_TYPES.Identifier) {
        return {
            type: MemberNameType.Normal,
            name: member.key.name,
        };
    }
    if (member.key.type === utils_1.AST_NODE_TYPES.PrivateIdentifier) {
        return {
            type: MemberNameType.Private,
            name: `#${member.key.name}`,
        };
    }
    if (member.key.type === utils_1.AST_NODE_TYPES.Literal) {
        const name = `${member.key.value}`;
        if ((0, type_utils_1.requiresQuoting)(name)) {
            return {
                type: MemberNameType.Quoted,
                name: `"${name}"`,
            };
        }
        else {
            return {
                type: MemberNameType.Normal,
                name,
            };
        }
    }
    return {
        type: MemberNameType.Expression,
        name: sourceCode.text.slice(...member.key.range),
    };
}
exports.getNameFromMember = getNameFromMember;
function getEnumNames(myEnum) {
    return Object.keys(myEnum).filter(x => isNaN(parseInt(x)));
}
exports.getEnumNames = getEnumNames;
/**
 * Given an array of words, returns an English-friendly concatenation, separated with commas, with
 * the `and` clause inserted before the last item.
 *
 * Example: ['foo', 'bar', 'baz' ] returns the string "foo, bar, and baz".
 */
function formatWordList(words) {
    if (!(words === null || words === void 0 ? void 0 : words.length)) {
        return '';
    }
    if (words.length === 1) {
        return words[0];
    }
    return [words.slice(0, -1).join(', '), words.slice(-1)[0]].join(' and ');
}
exports.formatWordList = formatWordList;
//# sourceMappingURL=misc.js.map