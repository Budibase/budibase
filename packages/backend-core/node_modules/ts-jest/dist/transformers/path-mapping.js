"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory = exports.name = exports.version = void 0;
var path_1 = require("path");
var bs_logger_1 = require("bs-logger");
exports.version = 2;
exports.name = 'path-mapping';
var isBaseDir = function (base, dir) { var _a; return !((_a = (0, path_1.relative)(base, dir)) === null || _a === void 0 ? void 0 : _a.startsWith('.')); };
function factory(_a) {
    var _b;
    var configSet = _a.configSet;
    var logger = configSet.logger.child({ namespace: exports.name });
    logger.warn('path-mapping AST transformer is deprecated and will be removed in `ts-jest` v28. Please use an alternative one, like https://github.com/LeDDGroup/typescript-transform-paths instead');
    var ts = configSet.compilerModule;
    var tsFactory = ts.factory ? ts.factory : ts;
    var compilerOptions = configSet.parsedTsConfig.options;
    var rootDirs = (_b = compilerOptions.rootDirs) === null || _b === void 0 ? void 0 : _b.filter(path_1.isAbsolute);
    var isDynamicImport = function (node) {
        return ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword;
    };
    var isRequire = function (node) {
        return ts.isCallExpression(node) &&
            ts.isIdentifier(node.expression) &&
            node.expression.text === 'require' &&
            ts.isStringLiteral(node.arguments[0]) &&
            node.arguments.length === 1;
    };
    var createVisitor = function (ctx, sf) {
        var fileName = sf.fileName;
        var fileDir = (0, path_1.normalize)((0, path_1.dirname)(fileName));
        var rewritePath = function (importPath) {
            var e_1, _a;
            var p = importPath;
            var resolvedModule = ts.resolveModuleName(importPath, fileName, compilerOptions, ts.sys).resolvedModule;
            if (resolvedModule) {
                var resolvedFileName = resolvedModule.resolvedFileName;
                var filePath = fileDir;
                var modulePath = (0, path_1.dirname)(resolvedFileName);
                if (rootDirs) {
                    var fileRootDir = '';
                    var moduleRootDir = '';
                    try {
                        for (var rootDirs_1 = __values(rootDirs), rootDirs_1_1 = rootDirs_1.next(); !rootDirs_1_1.done; rootDirs_1_1 = rootDirs_1.next()) {
                            var rootDir = rootDirs_1_1.value;
                            if (isBaseDir(rootDir, resolvedFileName) && rootDir.length > moduleRootDir.length)
                                moduleRootDir = rootDir;
                            if (isBaseDir(rootDir, fileName) && rootDir.length > fileRootDir.length)
                                fileRootDir = rootDir;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (rootDirs_1_1 && !rootDirs_1_1.done && (_a = rootDirs_1.return)) _a.call(rootDirs_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (fileRootDir && moduleRootDir) {
                        filePath = (0, path_1.relative)(fileRootDir, filePath);
                        modulePath = (0, path_1.relative)(moduleRootDir, modulePath);
                    }
                }
                p = (0, path_1.normalize)((0, path_1.join)((0, path_1.relative)(filePath, modulePath), (0, path_1.basename)(resolvedFileName)));
                p = p.startsWith('.') ? p : "./".concat(p);
            }
            return p;
        };
        var visitor = function (node) {
            var rewrittenPath;
            var newNode = ts.getMutableClone(node);
            if (isDynamicImport(node) || isRequire(node)) {
                rewrittenPath = rewritePath(node.arguments[0].text);
                var argumentArrays = tsFactory.createNodeArray([tsFactory.createStringLiteral(rewrittenPath)]);
                return ts.factory
                    ? ts.factory.updateCallExpression(node, node.expression, node.typeArguments, argumentArrays)
                    : ts.updateCall(node, node.expression, node.typeArguments, argumentArrays);
            }
            if (ts.isExternalModuleReference(node) && ts.isStringLiteral(node.expression)) {
                rewrittenPath = rewritePath(node.expression.text);
                return tsFactory.updateExternalModuleReference(newNode, tsFactory.createStringLiteral(rewrittenPath));
            }
            if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
                rewrittenPath = rewritePath(node.moduleSpecifier.text);
                return +ts.versionMajorMinor >= 4.5
                    ? tsFactory.updateImportDeclaration(node, node.decorators, node.modifiers, node.importClause, tsFactory.createStringLiteral(rewrittenPath), node.assertClause)
                    :
                        tsFactory.updateImportDeclaration(node, node.decorators, node.modifiers, node.importClause, tsFactory.createStringLiteral(rewrittenPath));
            }
            if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
                rewrittenPath = rewritePath(node.moduleSpecifier.text);
                var stringLiteralNode = tsFactory.createStringLiteral(rewrittenPath);
                if (ts.factory) {
                    return +ts.versionMajorMinor >= 4.5
                        ? ts.factory.updateExportDeclaration(node, node.decorators, node.modifiers, node.isTypeOnly, node.exportClause, stringLiteralNode, node.assertClause)
                        :
                            ts.factory.updateExportDeclaration(node, node.decorators, node.modifiers, node.isTypeOnly, node.exportClause, stringLiteralNode);
                }
                else {
                    return ts.updateExportDeclaration(node, node.decorators, node.modifiers, node.exportClause, stringLiteralNode, node.isTypeOnly);
                }
            }
            if (ts.isImportTypeNode(node) &&
                ts.isLiteralTypeNode(node.argument) &&
                ts.isStringLiteral(node.argument.literal)) {
                rewrittenPath = rewritePath(node.argument.literal.text);
                var importArguments = tsFactory.createLiteralTypeNode(tsFactory.createStringLiteral(rewrittenPath));
                return tsFactory.updateImportTypeNode(node, importArguments, node.qualifier, node.typeArguments, node.isTypeOf);
            }
            return ts.visitEachChild(node, visitor, ctx);
        };
        return visitor;
    };
    return function (ctx) {
        var _a;
        return logger.wrap((_a = {}, _a[bs_logger_1.LogContexts.logLevel] = bs_logger_1.LogLevels.debug, _a.call = null, _a), 'visitSourceFileNode(): path mapping', function (sf) { return ts.visitNode(sf, createVisitor(ctx, sf)); });
    };
}
exports.factory = factory;
