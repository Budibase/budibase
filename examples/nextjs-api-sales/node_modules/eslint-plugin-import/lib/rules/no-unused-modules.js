'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};





var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _ignore = require('eslint-module-utils/ignore');
var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _visit = require('eslint-module-utils/visit');var _visit2 = _interopRequireDefault(_visit);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _path = require('path');
var _readPkgUp2 = require('eslint-module-utils/readPkgUp');var _readPkgUp3 = _interopRequireDefault(_readPkgUp2);
var _object = require('object.values');var _object2 = _interopRequireDefault(_object);
var _arrayIncludes = require('array-includes');var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} /**
                                                                                                                                                                                                                                                                                                                                                                                                       * @fileOverview Ensures that modules contain exports and/or all
                                                                                                                                                                                                                                                                                                                                                                                                       * modules are consumed within other modules.
                                                                                                                                                                                                                                                                                                                                                                                                       * @author René Fermann
                                                                                                                                                                                                                                                                                                                                                                                                       */var FileEnumerator = void 0;var listFilesToProcess = void 0;
try {var _require =
  require('eslint/use-at-your-own-risk');FileEnumerator = _require.FileEnumerator;
} catch (e) {
  try {var _require2 =

    require('eslint/lib/cli-engine/file-enumerator'); // has been moved to eslint/lib/cli-engine/file-enumerator in version 6
    FileEnumerator = _require2.FileEnumerator;} catch (e) {
    try {
      // eslint/lib/util/glob-util has been moved to eslint/lib/util/glob-utils with version 5.3
      var _require3 = require('eslint/lib/util/glob-utils'),originalListFilesToProcess = _require3.listFilesToProcess;

      // Prevent passing invalid options (extensions array) to old versions of the function.
      // https://github.com/eslint/eslint/blob/v5.16.0/lib/util/glob-utils.js#L178-L280
      // https://github.com/eslint/eslint/blob/v5.2.0/lib/util/glob-util.js#L174-L269
      listFilesToProcess = function listFilesToProcess(src, extensions) {
        return originalListFilesToProcess(src, {
          extensions: extensions });

      };
    } catch (e) {var _require4 =
      require('eslint/lib/util/glob-util'),_originalListFilesToProcess = _require4.listFilesToProcess;

      listFilesToProcess = function listFilesToProcess(src, extensions) {
        var patterns = src.reduce(function (carry, pattern) {
          return carry.concat(extensions.map(function (extension) {
            return (/\*\*|\*\./.test(pattern) ? pattern : String(pattern) + '/**/*' + String(extension));
          }));
        }, src.slice());

        return _originalListFilesToProcess(patterns);
      };
    }
  }
}

if (FileEnumerator) {
  listFilesToProcess = function listFilesToProcess(src, extensions) {
    var e = new FileEnumerator({
      extensions: extensions });


    return Array.from(e.iterateFiles(src), function (_ref) {var filePath = _ref.filePath,ignored = _ref.ignored;return {
        ignored: ignored,
        filename: filePath };});

  };
}

var EXPORT_DEFAULT_DECLARATION = 'ExportDefaultDeclaration';
var EXPORT_NAMED_DECLARATION = 'ExportNamedDeclaration';
var EXPORT_ALL_DECLARATION = 'ExportAllDeclaration';
var IMPORT_DECLARATION = 'ImportDeclaration';
var IMPORT_NAMESPACE_SPECIFIER = 'ImportNamespaceSpecifier';
var IMPORT_DEFAULT_SPECIFIER = 'ImportDefaultSpecifier';
var VARIABLE_DECLARATION = 'VariableDeclaration';
var FUNCTION_DECLARATION = 'FunctionDeclaration';
var CLASS_DECLARATION = 'ClassDeclaration';
var IDENTIFIER = 'Identifier';
var OBJECT_PATTERN = 'ObjectPattern';
var TS_INTERFACE_DECLARATION = 'TSInterfaceDeclaration';
var TS_TYPE_ALIAS_DECLARATION = 'TSTypeAliasDeclaration';
var TS_ENUM_DECLARATION = 'TSEnumDeclaration';
var DEFAULT = 'default';

function forEachDeclarationIdentifier(declaration, cb) {
  if (declaration) {
    if (
    declaration.type === FUNCTION_DECLARATION ||
    declaration.type === CLASS_DECLARATION ||
    declaration.type === TS_INTERFACE_DECLARATION ||
    declaration.type === TS_TYPE_ALIAS_DECLARATION ||
    declaration.type === TS_ENUM_DECLARATION)
    {
      cb(declaration.id.name);
    } else if (declaration.type === VARIABLE_DECLARATION) {
      declaration.declarations.forEach(function (_ref2) {var id = _ref2.id;
        if (id.type === OBJECT_PATTERN) {
          (0, _ExportMap.recursivePatternCapture)(id, function (pattern) {
            if (pattern.type === IDENTIFIER) {
              cb(pattern.name);
            }
          });
        } else {
          cb(id.name);
        }
      });
    }
  }
}

/**
   * List of imports per file.
   *
   * Represented by a two-level Map to a Set of identifiers. The upper-level Map
   * keys are the paths to the modules containing the imports, while the
   * lower-level Map keys are the paths to the files which are being imported
   * from. Lastly, the Set of identifiers contains either names being imported
   * or a special AST node name listed above (e.g ImportDefaultSpecifier).
   *
   * For example, if we have a file named foo.js containing:
   *
   *   import { o2 } from './bar.js';
   *
   * Then we will have a structure that looks like:
   *
   *   Map { 'foo.js' => Map { 'bar.js' => Set { 'o2' } } }
   *
   * @type {Map<string, Map<string, Set<string>>>}
   */
var importList = new Map();

/**
                             * List of exports per file.
                             *
                             * Represented by a two-level Map to an object of metadata. The upper-level Map
                             * keys are the paths to the modules containing the exports, while the
                             * lower-level Map keys are the specific identifiers or special AST node names
                             * being exported. The leaf-level metadata object at the moment only contains a
                             * `whereUsed` property, which contains a Set of paths to modules that import
                             * the name.
                             *
                             * For example, if we have a file named bar.js containing the following exports:
                             *
                             *   const o2 = 'bar';
                             *   export { o2 };
                             *
                             * And a file named foo.js containing the following import:
                             *
                             *   import { o2 } from './bar.js';
                             *
                             * Then we will have a structure that looks like:
                             *
                             *   Map { 'bar.js' => Map { 'o2' => { whereUsed: Set { 'foo.js' } } } }
                             *
                             * @type {Map<string, Map<string, object>>}
                             */
var exportList = new Map();

var visitorKeyMap = new Map();

var ignoredFiles = new Set();
var filesOutsideSrc = new Set();

var isNodeModule = function isNodeModule(path) {
  return (/\/(node_modules)\//.test(path));
};

/**
    * read all files matching the patterns in src and ignoreExports
    *
    * return all files matching src pattern, which are not matching the ignoreExports pattern
    */
var resolveFiles = function resolveFiles(src, ignoreExports, context) {
  var extensions = Array.from((0, _ignore.getFileExtensions)(context.settings));

  var srcFiles = new Set();
  var srcFileList = listFilesToProcess(src, extensions);

  // prepare list of ignored files
  var ignoredFilesList = listFilesToProcess(ignoreExports, extensions);
  ignoredFilesList.forEach(function (_ref3) {var filename = _ref3.filename;return ignoredFiles.add(filename);});

  // prepare list of source files, don't consider files from node_modules
  srcFileList.filter(function (_ref4) {var filename = _ref4.filename;return !isNodeModule(filename);}).forEach(function (_ref5) {var filename = _ref5.filename;
    srcFiles.add(filename);
  });
  return srcFiles;
};

/**
    * parse all source files and build up 2 maps containing the existing imports and exports
    */
var prepareImportsAndExports = function prepareImportsAndExports(srcFiles, context) {
  var exportAll = new Map();
  srcFiles.forEach(function (file) {
    var exports = new Map();
    var imports = new Map();
    var currentExports = _ExportMap2['default'].get(file, context);
    if (currentExports) {var

      dependencies =




      currentExports.dependencies,reexports = currentExports.reexports,localImportList = currentExports.imports,namespace = currentExports.namespace,visitorKeys = currentExports.visitorKeys;

      visitorKeyMap.set(file, visitorKeys);
      // dependencies === export * from
      var currentExportAll = new Set();
      dependencies.forEach(function (getDependency) {
        var dependency = getDependency();
        if (dependency === null) {
          return;
        }

        currentExportAll.add(dependency.path);
      });
      exportAll.set(file, currentExportAll);

      reexports.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
        var reexport = value.getImport();
        if (!reexport) {
          return;
        }
        var localImport = imports.get(reexport.path);
        var currentValue = void 0;
        if (value.local === DEFAULT) {
          currentValue = IMPORT_DEFAULT_SPECIFIER;
        } else {
          currentValue = value.local;
        }
        if (typeof localImport !== 'undefined') {
          localImport = new Set([].concat(_toConsumableArray(localImport), [currentValue]));
        } else {
          localImport = new Set([currentValue]);
        }
        imports.set(reexport.path, localImport);
      });

      localImportList.forEach(function (value, key) {
        if (isNodeModule(key)) {
          return;
        }
        var localImport = imports.get(key) || new Set();
        value.declarations.forEach(function (_ref6) {var importedSpecifiers = _ref6.importedSpecifiers;return (
            importedSpecifiers.forEach(function (specifier) {return localImport.add(specifier);}));});

        imports.set(key, localImport);
      });
      importList.set(file, imports);

      // build up export list only, if file is not ignored
      if (ignoredFiles.has(file)) {
        return;
      }
      namespace.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
      });
    }
    exports.set(EXPORT_ALL_DECLARATION, { whereUsed: new Set() });
    exports.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: new Set() });
    exportList.set(file, exports);
  });
  exportAll.forEach(function (value, key) {
    value.forEach(function (val) {
      var currentExports = exportList.get(val);
      var currentExport = currentExports.get(EXPORT_ALL_DECLARATION);
      currentExport.whereUsed.add(key);
    });
  });
};

/**
    * traverse through all imports and add the respective path to the whereUsed-list
    * of the corresponding export
    */
var determineUsage = function determineUsage() {
  importList.forEach(function (listValue, listKey) {
    listValue.forEach(function (value, key) {
      var exports = exportList.get(key);
      if (typeof exports !== 'undefined') {
        value.forEach(function (currentImport) {
          var specifier = void 0;
          if (currentImport === IMPORT_NAMESPACE_SPECIFIER) {
            specifier = IMPORT_NAMESPACE_SPECIFIER;
          } else if (currentImport === IMPORT_DEFAULT_SPECIFIER) {
            specifier = IMPORT_DEFAULT_SPECIFIER;
          } else {
            specifier = currentImport;
          }
          if (typeof specifier !== 'undefined') {
            var exportStatement = exports.get(specifier);
            if (typeof exportStatement !== 'undefined') {var
              whereUsed = exportStatement.whereUsed;
              whereUsed.add(listKey);
              exports.set(specifier, { whereUsed: whereUsed });
            }
          }
        });
      }
    });
  });
};

var getSrc = function getSrc(src) {
  if (src) {
    return src;
  }
  return [process.cwd()];
};

/**
    * prepare the lists of existing imports and exports - should only be executed once at
    * the start of a new eslint run
    */
var srcFiles = void 0;
var lastPrepareKey = void 0;
var doPreparation = function doPreparation(src, ignoreExports, context) {
  var prepareKey = JSON.stringify({
    src: (src || []).sort(),
    ignoreExports: (ignoreExports || []).sort(),
    extensions: Array.from((0, _ignore.getFileExtensions)(context.settings)).sort() });

  if (prepareKey === lastPrepareKey) {
    return;
  }

  importList.clear();
  exportList.clear();
  ignoredFiles.clear();
  filesOutsideSrc.clear();

  srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
  prepareImportsAndExports(srcFiles, context);
  determineUsage();
  lastPrepareKey = prepareKey;
};

var newNamespaceImportExists = function newNamespaceImportExists(specifiers) {return (
    specifiers.some(function (_ref7) {var type = _ref7.type;return type === IMPORT_NAMESPACE_SPECIFIER;}));};

var newDefaultImportExists = function newDefaultImportExists(specifiers) {return (
    specifiers.some(function (_ref8) {var type = _ref8.type;return type === IMPORT_DEFAULT_SPECIFIER;}));};

var fileIsInPkg = function fileIsInPkg(file) {var _readPkgUp =
  (0, _readPkgUp3['default'])({ cwd: file }),path = _readPkgUp.path,pkg = _readPkgUp.pkg;
  var basePath = (0, _path.dirname)(path);

  var checkPkgFieldString = function checkPkgFieldString(pkgField) {
    if ((0, _path.join)(basePath, pkgField) === file) {
      return true;
    }
  };

  var checkPkgFieldObject = function checkPkgFieldObject(pkgField) {
    var pkgFieldFiles = (0, _object2['default'])(pkgField).map(function (value) {return (0, _path.join)(basePath, value);});
    if ((0, _arrayIncludes2['default'])(pkgFieldFiles, file)) {
      return true;
    }
  };

  var checkPkgField = function checkPkgField(pkgField) {
    if (typeof pkgField === 'string') {
      return checkPkgFieldString(pkgField);
    }

    if ((typeof pkgField === 'undefined' ? 'undefined' : _typeof(pkgField)) === 'object') {
      return checkPkgFieldObject(pkgField);
    }
  };

  if (pkg['private'] === true) {
    return false;
  }

  if (pkg.bin) {
    if (checkPkgField(pkg.bin)) {
      return true;
    }
  }

  if (pkg.browser) {
    if (checkPkgField(pkg.browser)) {
      return true;
    }
  }

  if (pkg.main) {
    if (checkPkgFieldString(pkg.main)) {
      return true;
    }
  }

  return false;
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: { url: (0, _docsUrl2['default'])('no-unused-modules') },
    schema: [{
      properties: {
        src: {
          description: 'files/paths to be analyzed (only for unused exports)',
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
            minLength: 1 } },


        ignoreExports: {
          description:
          'files/paths for which unused exports will not be reported (e.g module entry points)',
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
            minLength: 1 } },


        missingExports: {
          description: 'report modules without any exports',
          type: 'boolean' },

        unusedExports: {
          description: 'report exports without any usage',
          type: 'boolean' } },


      not: {
        properties: {
          unusedExports: { 'enum': [false] },
          missingExports: { 'enum': [false] } } },


      anyOf: [{
        not: {
          properties: {
            unusedExports: { 'enum': [true] } } },


        required: ['missingExports'] },
      {
        not: {
          properties: {
            missingExports: { 'enum': [true] } } },


        required: ['unusedExports'] },
      {
        properties: {
          unusedExports: { 'enum': [true] } },

        required: ['unusedExports'] },
      {
        properties: {
          missingExports: { 'enum': [true] } },

        required: ['missingExports'] }] }] },




  create: function () {function create(context) {var _ref9 =





      context.options[0] || {},src = _ref9.src,_ref9$ignoreExports = _ref9.ignoreExports,ignoreExports = _ref9$ignoreExports === undefined ? [] : _ref9$ignoreExports,missingExports = _ref9.missingExports,unusedExports = _ref9.unusedExports;

      if (unusedExports) {
        doPreparation(src, ignoreExports, context);
      }

      var file = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();

      var checkExportPresence = function () {function checkExportPresence(node) {
          if (!missingExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          var exportCount = exportList.get(file);
          var exportAll = exportCount.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exportCount.get(IMPORT_NAMESPACE_SPECIFIER);

          exportCount['delete'](EXPORT_ALL_DECLARATION);
          exportCount['delete'](IMPORT_NAMESPACE_SPECIFIER);
          if (exportCount.size < 1) {
            // node.body[0] === 'undefined' only happens, if everything is commented out in the file
            // being linted
            context.report(node.body[0] ? node.body[0] : node, 'No exports found');
          }
          exportCount.set(EXPORT_ALL_DECLARATION, exportAll);
          exportCount.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
        }return checkExportPresence;}();

      var checkUsage = function () {function checkUsage(node, exportedValue) {
          if (!unusedExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          if (fileIsInPkg(file)) {
            return;
          }

          if (filesOutsideSrc.has(file)) {
            return;
          }

          // make sure file to be linted is included in source files
          if (!srcFiles.has(file)) {
            srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
            if (!srcFiles.has(file)) {
              filesOutsideSrc.add(file);
              return;
            }
          }

          exports = exportList.get(file);

          // special case: export * from
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          if (typeof exportAll !== 'undefined' && exportedValue !== IMPORT_DEFAULT_SPECIFIER) {
            if (exportAll.whereUsed.size > 0) {
              return;
            }
          }

          // special case: namespace import
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);
          if (typeof namespaceImports !== 'undefined') {
            if (namespaceImports.whereUsed.size > 0) {
              return;
            }
          }

          // exportsList will always map any imported value of 'default' to 'ImportDefaultSpecifier'
          var exportsKey = exportedValue === DEFAULT ? IMPORT_DEFAULT_SPECIFIER : exportedValue;

          var exportStatement = exports.get(exportsKey);

          var value = exportsKey === IMPORT_DEFAULT_SPECIFIER ? DEFAULT : exportsKey;

          if (typeof exportStatement !== 'undefined') {
            if (exportStatement.whereUsed.size < 1) {
              context.report(
              node, 'exported declaration \'' +
              value + '\' not used within other modules');

            }
          } else {
            context.report(
            node, 'exported declaration \'' +
            value + '\' not used within other modules');

          }
        }return checkUsage;}();

      /**
                                 * only useful for tools like vscode-eslint
                                 *
                                 * update lists of existing exports during runtime
                                 */
      var updateExportUsage = function () {function updateExportUsage(node) {
          if (ignoredFiles.has(file)) {
            return;
          }

          var exports = exportList.get(file);

          // new module has been created during runtime
          // include it in further processing
          if (typeof exports === 'undefined') {
            exports = new Map();
          }

          var newExports = new Map();
          var newExportIdentifiers = new Set();

          node.body.forEach(function (_ref10) {var type = _ref10.type,declaration = _ref10.declaration,specifiers = _ref10.specifiers;
            if (type === EXPORT_DEFAULT_DECLARATION) {
              newExportIdentifiers.add(IMPORT_DEFAULT_SPECIFIER);
            }
            if (type === EXPORT_NAMED_DECLARATION) {
              if (specifiers.length > 0) {
                specifiers.forEach(function (specifier) {
                  if (specifier.exported) {
                    newExportIdentifiers.add(specifier.exported.name);
                  }
                });
              }
              forEachDeclarationIdentifier(declaration, function (name) {
                newExportIdentifiers.add(name);
              });
            }
          });

          // old exports exist within list of new exports identifiers: add to map of new exports
          exports.forEach(function (value, key) {
            if (newExportIdentifiers.has(key)) {
              newExports.set(key, value);
            }
          });

          // new export identifiers added: add to map of new exports
          newExportIdentifiers.forEach(function (key) {
            if (!exports.has(key)) {
              newExports.set(key, { whereUsed: new Set() });
            }
          });

          // preserve information about namespace imports
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);

          if (typeof namespaceImports === 'undefined') {
            namespaceImports = { whereUsed: new Set() };
          }

          newExports.set(EXPORT_ALL_DECLARATION, exportAll);
          newExports.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
          exportList.set(file, newExports);
        }return updateExportUsage;}();

      /**
                                        * only useful for tools like vscode-eslint
                                        *
                                        * update lists of existing imports during runtime
                                        */
      var updateImportUsage = function () {function updateImportUsage(node) {
          if (!unusedExports) {
            return;
          }

          var oldImportPaths = importList.get(file);
          if (typeof oldImportPaths === 'undefined') {
            oldImportPaths = new Map();
          }

          var oldNamespaceImports = new Set();
          var newNamespaceImports = new Set();

          var oldExportAll = new Set();
          var newExportAll = new Set();

          var oldDefaultImports = new Set();
          var newDefaultImports = new Set();

          var oldImports = new Map();
          var newImports = new Map();
          oldImportPaths.forEach(function (value, key) {
            if (value.has(EXPORT_ALL_DECLARATION)) {
              oldExportAll.add(key);
            }
            if (value.has(IMPORT_NAMESPACE_SPECIFIER)) {
              oldNamespaceImports.add(key);
            }
            if (value.has(IMPORT_DEFAULT_SPECIFIER)) {
              oldDefaultImports.add(key);
            }
            value.forEach(function (val) {
              if (val !== IMPORT_NAMESPACE_SPECIFIER &&
              val !== IMPORT_DEFAULT_SPECIFIER) {
                oldImports.set(val, key);
              }
            });
          });

          function processDynamicImport(source) {
            if (source.type !== 'Literal') {
              return null;
            }
            var p = (0, _resolve2['default'])(source.value, context);
            if (p == null) {
              return null;
            }
            newNamespaceImports.add(p);
          }

          (0, _visit2['default'])(node, visitorKeyMap.get(file), {
            ImportExpression: function () {function ImportExpression(child) {
                processDynamicImport(child.source);
              }return ImportExpression;}(),
            CallExpression: function () {function CallExpression(child) {
                if (child.callee.type === 'Import') {
                  processDynamicImport(child.arguments[0]);
                }
              }return CallExpression;}() });


          node.body.forEach(function (astNode) {
            var resolvedPath = void 0;

            // support for export { value } from 'module'
            if (astNode.type === EXPORT_NAMED_DECLARATION) {
              if (astNode.source) {
                resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
                astNode.specifiers.forEach(function (specifier) {
                  var name = specifier.local.name;
                  if (specifier.local.name === DEFAULT) {
                    newDefaultImports.add(resolvedPath);
                  } else {
                    newImports.set(name, resolvedPath);
                  }
                });
              }
            }

            if (astNode.type === EXPORT_ALL_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              newExportAll.add(resolvedPath);
            }

            if (astNode.type === IMPORT_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              if (!resolvedPath) {
                return;
              }

              if (isNodeModule(resolvedPath)) {
                return;
              }

              if (newNamespaceImportExists(astNode.specifiers)) {
                newNamespaceImports.add(resolvedPath);
              }

              if (newDefaultImportExists(astNode.specifiers)) {
                newDefaultImports.add(resolvedPath);
              }

              astNode.specifiers.forEach(function (specifier) {
                if (specifier.type === IMPORT_DEFAULT_SPECIFIER ||
                specifier.type === IMPORT_NAMESPACE_SPECIFIER) {
                  return;
                }
                newImports.set(specifier.imported.name, resolvedPath);
              });
            }
          });

          newExportAll.forEach(function (value) {
            if (!oldExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(EXPORT_ALL_DECLARATION);
              oldImportPaths.set(value, imports);

              var _exports = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports !== 'undefined') {
                currentExport = _exports.get(EXPORT_ALL_DECLARATION);
              } else {
                _exports = new Map();
                exportList.set(value, _exports);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports.set(EXPORT_ALL_DECLARATION, { whereUsed: whereUsed });
              }
            }
          });

          oldExportAll.forEach(function (value) {
            if (!newExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](EXPORT_ALL_DECLARATION);

              var _exports2 = exportList.get(value);
              if (typeof _exports2 !== 'undefined') {
                var currentExport = _exports2.get(EXPORT_ALL_DECLARATION);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newDefaultImports.forEach(function (value) {
            if (!oldDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_DEFAULT_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports3 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports3 !== 'undefined') {
                currentExport = _exports3.get(IMPORT_DEFAULT_SPECIFIER);
              } else {
                _exports3 = new Map();
                exportList.set(value, _exports3);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports3.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldDefaultImports.forEach(function (value) {
            if (!newDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_DEFAULT_SPECIFIER);

              var _exports4 = exportList.get(value);
              if (typeof _exports4 !== 'undefined') {
                var currentExport = _exports4.get(IMPORT_DEFAULT_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newNamespaceImports.forEach(function (value) {
            if (!oldNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_NAMESPACE_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports5 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports5 !== 'undefined') {
                currentExport = _exports5.get(IMPORT_NAMESPACE_SPECIFIER);
              } else {
                _exports5 = new Map();
                exportList.set(value, _exports5);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports5.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldNamespaceImports.forEach(function (value) {
            if (!newNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_NAMESPACE_SPECIFIER);

              var _exports6 = exportList.get(value);
              if (typeof _exports6 !== 'undefined') {
                var currentExport = _exports6.get(IMPORT_NAMESPACE_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newImports.forEach(function (value, key) {
            if (!oldImports.has(key)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(key);
              oldImportPaths.set(value, imports);

              var _exports7 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports7 !== 'undefined') {
                currentExport = _exports7.get(key);
              } else {
                _exports7 = new Map();
                exportList.set(value, _exports7);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports7.set(key, { whereUsed: whereUsed });
              }
            }
          });

          oldImports.forEach(function (value, key) {
            if (!newImports.has(key)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](key);

              var _exports8 = exportList.get(value);
              if (typeof _exports8 !== 'undefined') {
                var currentExport = _exports8.get(key);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });
        }return updateImportUsage;}();

      return {
        'Program:exit': function () {function ProgramExit(node) {
            updateExportUsage(node);
            updateImportUsage(node);
            checkExportPresence(node);
          }return ProgramExit;}(),
        'ExportDefaultDeclaration': function () {function ExportDefaultDeclaration(node) {
            checkUsage(node, IMPORT_DEFAULT_SPECIFIER);
          }return ExportDefaultDeclaration;}(),
        'ExportNamedDeclaration': function () {function ExportNamedDeclaration(node) {
            node.specifiers.forEach(function (specifier) {
              checkUsage(node, specifier.exported.name);
            });
            forEachDeclarationIdentifier(node.declaration, function (name) {
              checkUsage(node, name);
            });
          }return ExportNamedDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11bnVzZWQtbW9kdWxlcy5qcyJdLCJuYW1lcyI6WyJGaWxlRW51bWVyYXRvciIsImxpc3RGaWxlc1RvUHJvY2VzcyIsInJlcXVpcmUiLCJlIiwib3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MiLCJzcmMiLCJleHRlbnNpb25zIiwicGF0dGVybnMiLCJyZWR1Y2UiLCJjYXJyeSIsInBhdHRlcm4iLCJjb25jYXQiLCJtYXAiLCJleHRlbnNpb24iLCJ0ZXN0Iiwic2xpY2UiLCJBcnJheSIsImZyb20iLCJpdGVyYXRlRmlsZXMiLCJmaWxlUGF0aCIsImlnbm9yZWQiLCJmaWxlbmFtZSIsIkVYUE9SVF9ERUZBVUxUX0RFQ0xBUkFUSU9OIiwiRVhQT1JUX05BTUVEX0RFQ0xBUkFUSU9OIiwiRVhQT1JUX0FMTF9ERUNMQVJBVElPTiIsIklNUE9SVF9ERUNMQVJBVElPTiIsIklNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSIiwiSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSIiwiVkFSSUFCTEVfREVDTEFSQVRJT04iLCJGVU5DVElPTl9ERUNMQVJBVElPTiIsIkNMQVNTX0RFQ0xBUkFUSU9OIiwiSURFTlRJRklFUiIsIk9CSkVDVF9QQVRURVJOIiwiVFNfSU5URVJGQUNFX0RFQ0xBUkFUSU9OIiwiVFNfVFlQRV9BTElBU19ERUNMQVJBVElPTiIsIlRTX0VOVU1fREVDTEFSQVRJT04iLCJERUZBVUxUIiwiZm9yRWFjaERlY2xhcmF0aW9uSWRlbnRpZmllciIsImRlY2xhcmF0aW9uIiwiY2IiLCJ0eXBlIiwiaWQiLCJuYW1lIiwiZGVjbGFyYXRpb25zIiwiZm9yRWFjaCIsImltcG9ydExpc3QiLCJNYXAiLCJleHBvcnRMaXN0IiwidmlzaXRvcktleU1hcCIsImlnbm9yZWRGaWxlcyIsIlNldCIsImZpbGVzT3V0c2lkZVNyYyIsImlzTm9kZU1vZHVsZSIsInBhdGgiLCJyZXNvbHZlRmlsZXMiLCJpZ25vcmVFeHBvcnRzIiwiY29udGV4dCIsInNldHRpbmdzIiwic3JjRmlsZXMiLCJzcmNGaWxlTGlzdCIsImlnbm9yZWRGaWxlc0xpc3QiLCJhZGQiLCJmaWx0ZXIiLCJwcmVwYXJlSW1wb3J0c0FuZEV4cG9ydHMiLCJleHBvcnRBbGwiLCJleHBvcnRzIiwiaW1wb3J0cyIsImN1cnJlbnRFeHBvcnRzIiwiRXhwb3J0cyIsImdldCIsImZpbGUiLCJkZXBlbmRlbmNpZXMiLCJyZWV4cG9ydHMiLCJsb2NhbEltcG9ydExpc3QiLCJuYW1lc3BhY2UiLCJ2aXNpdG9yS2V5cyIsInNldCIsImN1cnJlbnRFeHBvcnRBbGwiLCJkZXBlbmRlbmN5IiwiZ2V0RGVwZW5kZW5jeSIsInZhbHVlIiwia2V5Iiwid2hlcmVVc2VkIiwicmVleHBvcnQiLCJnZXRJbXBvcnQiLCJsb2NhbEltcG9ydCIsImN1cnJlbnRWYWx1ZSIsImxvY2FsIiwiaW1wb3J0ZWRTcGVjaWZpZXJzIiwic3BlY2lmaWVyIiwiaGFzIiwidmFsIiwiY3VycmVudEV4cG9ydCIsImRldGVybWluZVVzYWdlIiwibGlzdFZhbHVlIiwibGlzdEtleSIsImN1cnJlbnRJbXBvcnQiLCJleHBvcnRTdGF0ZW1lbnQiLCJnZXRTcmMiLCJwcm9jZXNzIiwiY3dkIiwibGFzdFByZXBhcmVLZXkiLCJkb1ByZXBhcmF0aW9uIiwicHJlcGFyZUtleSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzb3J0IiwiY2xlYXIiLCJuZXdOYW1lc3BhY2VJbXBvcnRFeGlzdHMiLCJzcGVjaWZpZXJzIiwic29tZSIsIm5ld0RlZmF1bHRJbXBvcnRFeGlzdHMiLCJmaWxlSXNJblBrZyIsInBrZyIsImJhc2VQYXRoIiwiY2hlY2tQa2dGaWVsZFN0cmluZyIsInBrZ0ZpZWxkIiwiY2hlY2tQa2dGaWVsZE9iamVjdCIsInBrZ0ZpZWxkRmlsZXMiLCJjaGVja1BrZ0ZpZWxkIiwiYmluIiwiYnJvd3NlciIsIm1haW4iLCJtb2R1bGUiLCJtZXRhIiwiZG9jcyIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJkZXNjcmlwdGlvbiIsIm1pbkl0ZW1zIiwiaXRlbXMiLCJtaW5MZW5ndGgiLCJtaXNzaW5nRXhwb3J0cyIsInVudXNlZEV4cG9ydHMiLCJub3QiLCJhbnlPZiIsInJlcXVpcmVkIiwiY3JlYXRlIiwib3B0aW9ucyIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsImNoZWNrRXhwb3J0UHJlc2VuY2UiLCJleHBvcnRDb3VudCIsIm5hbWVzcGFjZUltcG9ydHMiLCJzaXplIiwicmVwb3J0Iiwibm9kZSIsImJvZHkiLCJjaGVja1VzYWdlIiwiZXhwb3J0ZWRWYWx1ZSIsImV4cG9ydHNLZXkiLCJ1cGRhdGVFeHBvcnRVc2FnZSIsIm5ld0V4cG9ydHMiLCJuZXdFeHBvcnRJZGVudGlmaWVycyIsImxlbmd0aCIsImV4cG9ydGVkIiwidXBkYXRlSW1wb3J0VXNhZ2UiLCJvbGRJbXBvcnRQYXRocyIsIm9sZE5hbWVzcGFjZUltcG9ydHMiLCJuZXdOYW1lc3BhY2VJbXBvcnRzIiwib2xkRXhwb3J0QWxsIiwibmV3RXhwb3J0QWxsIiwib2xkRGVmYXVsdEltcG9ydHMiLCJuZXdEZWZhdWx0SW1wb3J0cyIsIm9sZEltcG9ydHMiLCJuZXdJbXBvcnRzIiwicHJvY2Vzc0R5bmFtaWNJbXBvcnQiLCJzb3VyY2UiLCJwIiwiSW1wb3J0RXhwcmVzc2lvbiIsImNoaWxkIiwiQ2FsbEV4cHJlc3Npb24iLCJjYWxsZWUiLCJhcmd1bWVudHMiLCJyZXNvbHZlZFBhdGgiLCJhc3ROb2RlIiwicmF3IiwicmVwbGFjZSIsImltcG9ydGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNQSx5QztBQUNBO0FBQ0Esc0Q7QUFDQSxrRDtBQUNBLHFDO0FBQ0E7QUFDQSwyRDtBQUNBLHVDO0FBQ0EsK0MsdVZBZEE7Ozs7eVlBZ0JBLElBQUlBLHVCQUFKLENBQ0EsSUFBSUMsMkJBQUo7QUFFQSxJQUFJO0FBQ29CQyxVQUFRLDZCQUFSLENBRHBCLENBQ0NGLGNBREQsWUFDQ0EsY0FERDtBQUVILENBRkQsQ0FFRSxPQUFPRyxDQUFQLEVBQVU7QUFDVixNQUFJ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R0FBWCxDQUFlVCxHQUFmLENBQUwsRUFBMEI7QUFDeEIsa0JBQU1mLFVBQVU0RixlQUFlekYsR0FBZixDQUFtQlcsS0FBbkIsQ0FBaEI7QUFDQWQsZ0NBQWVlLEdBQWY7O0FBRUEsa0JBQU1oQixZQUFVbEIsV0FBV3NCLEdBQVgsQ0FBZVcsS0FBZixDQUFoQjtBQUNBLGtCQUFJLE9BQU9mLFNBQVAsS0FBbUIsV0FBdkIsRUFBb0M7QUFDbEMsb0JBQU0yQixnQkFBZ0IzQixVQUFRSSxHQUFSLENBQVlZLEdBQVosQ0FBdEI7QUFDQSxvQkFBSSxPQUFPVyxhQUFQLEtBQXlCLFdBQTdCLEVBQTBDO0FBQ3hDQSxnQ0FBY1YsU0FBZCxXQUErQlosSUFBL0I7QUFDRDtBQUNGO0FBQ0Y7QUFDRixXQWJEO0FBY0QsU0EzUkssNEJBQU47O0FBNlJBLGFBQU87QUFDTCxxQ0FBZ0IsMkJBQVE7QUFDdEJrRiw4QkFBa0JMLElBQWxCO0FBQ0FVLDhCQUFrQlYsSUFBbEI7QUFDQUwsZ0NBQW9CSyxJQUFwQjtBQUNELFdBSkQsc0JBREs7QUFNTCxpREFBNEIsd0NBQVE7QUFDbENFLHVCQUFXRixJQUFYLEVBQWlCeEgsd0JBQWpCO0FBQ0QsV0FGRCxtQ0FOSztBQVNMLCtDQUEwQixzQ0FBUTtBQUNoQ3dILGlCQUFLdEMsVUFBTCxDQUFnQmpFLE9BQWhCLENBQXdCLHFCQUFhO0FBQ25DeUcseUJBQVdGLElBQVgsRUFBaUIxRCxVQUFVbUUsUUFBVixDQUFtQmxILElBQXBDO0FBQ0QsYUFGRDtBQUdBTCx5Q0FBNkI4RyxLQUFLN0csV0FBbEMsRUFBK0MsVUFBQ0ksSUFBRCxFQUFVO0FBQ3ZEMkcseUJBQVdGLElBQVgsRUFBaUJ6RyxJQUFqQjtBQUNELGFBRkQ7QUFHRCxXQVBELGlDQVRLLEVBQVA7O0FBa0JELEtBOWRELGlCQXBFZSxFQUFqQiIsImZpbGUiOiJuby11bnVzZWQtbW9kdWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVPdmVydmlldyBFbnN1cmVzIHRoYXQgbW9kdWxlcyBjb250YWluIGV4cG9ydHMgYW5kL29yIGFsbFxuICogbW9kdWxlcyBhcmUgY29uc3VtZWQgd2l0aGluIG90aGVyIG1vZHVsZXMuXG4gKiBAYXV0aG9yIFJlbsOpIEZlcm1hbm5cbiAqL1xuXG5pbXBvcnQgRXhwb3J0cywgeyByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZSB9IGZyb20gJy4uL0V4cG9ydE1hcCc7XG5pbXBvcnQgeyBnZXRGaWxlRXh0ZW5zaW9ucyB9IGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvaWdub3JlJztcbmltcG9ydCByZXNvbHZlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVzb2x2ZSc7XG5pbXBvcnQgdmlzaXQgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy92aXNpdCc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcbmltcG9ydCB7IGRpcm5hbWUsIGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCByZWFkUGtnVXAgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZWFkUGtnVXAnO1xuaW1wb3J0IHZhbHVlcyBmcm9tICdvYmplY3QudmFsdWVzJztcbmltcG9ydCBpbmNsdWRlcyBmcm9tICdhcnJheS1pbmNsdWRlcyc7XG5cbmxldCBGaWxlRW51bWVyYXRvcjtcbmxldCBsaXN0RmlsZXNUb1Byb2Nlc3M7XG5cbnRyeSB7XG4gICh7IEZpbGVFbnVtZXJhdG9yIH0gPSByZXF1aXJlKCdlc2xpbnQvdXNlLWF0LXlvdXItb3duLXJpc2snKSk7XG59IGNhdGNoIChlKSB7XG4gIHRyeSB7XG4gICAgLy8gaGFzIGJlZW4gbW92ZWQgdG8gZXNsaW50L2xpYi9jbGktZW5naW5lL2ZpbGUtZW51bWVyYXRvciBpbiB2ZXJzaW9uIDZcbiAgICAoeyBGaWxlRW51bWVyYXRvciB9ID0gcmVxdWlyZSgnZXNsaW50L2xpYi9jbGktZW5naW5lL2ZpbGUtZW51bWVyYXRvcicpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBlc2xpbnQvbGliL3V0aWwvZ2xvYi11dGlsIGhhcyBiZWVuIG1vdmVkIHRvIGVzbGludC9saWIvdXRpbC9nbG9iLXV0aWxzIHdpdGggdmVyc2lvbiA1LjNcbiAgICAgIGNvbnN0IHsgbGlzdEZpbGVzVG9Qcm9jZXNzOiBvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcyB9ID0gcmVxdWlyZSgnZXNsaW50L2xpYi91dGlsL2dsb2ItdXRpbHMnKTtcblxuICAgICAgLy8gUHJldmVudCBwYXNzaW5nIGludmFsaWQgb3B0aW9ucyAoZXh0ZW5zaW9ucyBhcnJheSkgdG8gb2xkIHZlcnNpb25zIG9mIHRoZSBmdW5jdGlvbi5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lc2xpbnQvZXNsaW50L2Jsb2IvdjUuMTYuMC9saWIvdXRpbC9nbG9iLXV0aWxzLmpzI0wxNzgtTDI4MFxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2VzbGludC9lc2xpbnQvYmxvYi92NS4yLjAvbGliL3V0aWwvZ2xvYi11dGlsLmpzI0wxNzQtTDI2OVxuICAgICAgbGlzdEZpbGVzVG9Qcm9jZXNzID0gZnVuY3Rpb24gKHNyYywgZXh0ZW5zaW9ucykge1xuICAgICAgICByZXR1cm4gb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3Moc3JjLCB7XG4gICAgICAgICAgZXh0ZW5zaW9ucyxcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnN0IHsgbGlzdEZpbGVzVG9Qcm9jZXNzOiBvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcyB9ID0gcmVxdWlyZSgnZXNsaW50L2xpYi91dGlsL2dsb2ItdXRpbCcpO1xuICAgICAgXG4gICAgICBsaXN0RmlsZXNUb1Byb2Nlc3MgPSBmdW5jdGlvbiAoc3JjLCBleHRlbnNpb25zKSB7XG4gICAgICAgIGNvbnN0IHBhdHRlcm5zID0gc3JjLnJlZHVjZSgoY2FycnksIHBhdHRlcm4pID0+IHtcbiAgICAgICAgICByZXR1cm4gY2FycnkuY29uY2F0KGV4dGVuc2lvbnMubWFwKChleHRlbnNpb24pID0+IHtcbiAgICAgICAgICAgIHJldHVybiAvXFwqXFwqfFxcKlxcLi8udGVzdChwYXR0ZXJuKSA/IHBhdHRlcm4gOiBgJHtwYXR0ZXJufS8qKi8qJHtleHRlbnNpb259YDtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0sIHNyYy5zbGljZSgpKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsTGlzdEZpbGVzVG9Qcm9jZXNzKHBhdHRlcm5zKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59XG5cbmlmIChGaWxlRW51bWVyYXRvcikge1xuICBsaXN0RmlsZXNUb1Byb2Nlc3MgPSBmdW5jdGlvbiAoc3JjLCBleHRlbnNpb25zKSB7XG4gICAgY29uc3QgZSA9IG5ldyBGaWxlRW51bWVyYXRvcih7XG4gICAgICBleHRlbnNpb25zLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZS5pdGVyYXRlRmlsZXMoc3JjKSwgKHsgZmlsZVBhdGgsIGlnbm9yZWQgfSkgPT4gKHtcbiAgICAgIGlnbm9yZWQsXG4gICAgICBmaWxlbmFtZTogZmlsZVBhdGgsXG4gICAgfSkpO1xuICB9O1xufVxuXG5jb25zdCBFWFBPUlRfREVGQVVMVF9ERUNMQVJBVElPTiA9ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nO1xuY29uc3QgRVhQT1JUX05BTUVEX0RFQ0xBUkFUSU9OID0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nO1xuY29uc3QgRVhQT1JUX0FMTF9ERUNMQVJBVElPTiA9ICdFeHBvcnRBbGxEZWNsYXJhdGlvbic7XG5jb25zdCBJTVBPUlRfREVDTEFSQVRJT04gPSAnSW1wb3J0RGVjbGFyYXRpb24nO1xuY29uc3QgSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIgPSAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJztcbmNvbnN0IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiA9ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJztcbmNvbnN0IFZBUklBQkxFX0RFQ0xBUkFUSU9OID0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nO1xuY29uc3QgRlVOQ1RJT05fREVDTEFSQVRJT04gPSAnRnVuY3Rpb25EZWNsYXJhdGlvbic7XG5jb25zdCBDTEFTU19ERUNMQVJBVElPTiA9ICdDbGFzc0RlY2xhcmF0aW9uJztcbmNvbnN0IElERU5USUZJRVIgPSAnSWRlbnRpZmllcic7XG5jb25zdCBPQkpFQ1RfUEFUVEVSTiA9ICdPYmplY3RQYXR0ZXJuJztcbmNvbnN0IFRTX0lOVEVSRkFDRV9ERUNMQVJBVElPTiA9ICdUU0ludGVyZmFjZURlY2xhcmF0aW9uJztcbmNvbnN0IFRTX1RZUEVfQUxJQVNfREVDTEFSQVRJT04gPSAnVFNUeXBlQWxpYXNEZWNsYXJhdGlvbic7XG5jb25zdCBUU19FTlVNX0RFQ0xBUkFUSU9OID0gJ1RTRW51bURlY2xhcmF0aW9uJztcbmNvbnN0IERFRkFVTFQgPSAnZGVmYXVsdCc7XG5cbmZ1bmN0aW9uIGZvckVhY2hEZWNsYXJhdGlvbklkZW50aWZpZXIoZGVjbGFyYXRpb24sIGNiKSB7XG4gIGlmIChkZWNsYXJhdGlvbikge1xuICAgIGlmIChcbiAgICAgIGRlY2xhcmF0aW9uLnR5cGUgPT09IEZVTkNUSU9OX0RFQ0xBUkFUSU9OIHx8XG4gICAgICBkZWNsYXJhdGlvbi50eXBlID09PSBDTEFTU19ERUNMQVJBVElPTiB8fFxuICAgICAgZGVjbGFyYXRpb24udHlwZSA9PT0gVFNfSU5URVJGQUNFX0RFQ0xBUkFUSU9OIHx8XG4gICAgICBkZWNsYXJhdGlvbi50eXBlID09PSBUU19UWVBFX0FMSUFTX0RFQ0xBUkFUSU9OIHx8XG4gICAgICBkZWNsYXJhdGlvbi50eXBlID09PSBUU19FTlVNX0RFQ0xBUkFUSU9OXG4gICAgKSB7XG4gICAgICBjYihkZWNsYXJhdGlvbi5pZC5uYW1lKTtcbiAgICB9IGVsc2UgaWYgKGRlY2xhcmF0aW9uLnR5cGUgPT09IFZBUklBQkxFX0RFQ0xBUkFUSU9OKSB7XG4gICAgICBkZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoeyBpZCB9KSA9PiB7XG4gICAgICAgIGlmIChpZC50eXBlID09PSBPQkpFQ1RfUEFUVEVSTikge1xuICAgICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKGlkLCAocGF0dGVybikgPT4ge1xuICAgICAgICAgICAgaWYgKHBhdHRlcm4udHlwZSA9PT0gSURFTlRJRklFUikge1xuICAgICAgICAgICAgICBjYihwYXR0ZXJuLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNiKGlkLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBMaXN0IG9mIGltcG9ydHMgcGVyIGZpbGUuXG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSB0d28tbGV2ZWwgTWFwIHRvIGEgU2V0IG9mIGlkZW50aWZpZXJzLiBUaGUgdXBwZXItbGV2ZWwgTWFwXG4gKiBrZXlzIGFyZSB0aGUgcGF0aHMgdG8gdGhlIG1vZHVsZXMgY29udGFpbmluZyB0aGUgaW1wb3J0cywgd2hpbGUgdGhlXG4gKiBsb3dlci1sZXZlbCBNYXAga2V5cyBhcmUgdGhlIHBhdGhzIHRvIHRoZSBmaWxlcyB3aGljaCBhcmUgYmVpbmcgaW1wb3J0ZWRcbiAqIGZyb20uIExhc3RseSwgdGhlIFNldCBvZiBpZGVudGlmaWVycyBjb250YWlucyBlaXRoZXIgbmFtZXMgYmVpbmcgaW1wb3J0ZWRcbiAqIG9yIGEgc3BlY2lhbCBBU1Qgbm9kZSBuYW1lIGxpc3RlZCBhYm92ZSAoZS5nIEltcG9ydERlZmF1bHRTcGVjaWZpZXIpLlxuICpcbiAqIEZvciBleGFtcGxlLCBpZiB3ZSBoYXZlIGEgZmlsZSBuYW1lZCBmb28uanMgY29udGFpbmluZzpcbiAqXG4gKiAgIGltcG9ydCB7IG8yIH0gZnJvbSAnLi9iYXIuanMnO1xuICpcbiAqIFRoZW4gd2Ugd2lsbCBoYXZlIGEgc3RydWN0dXJlIHRoYXQgbG9va3MgbGlrZTpcbiAqXG4gKiAgIE1hcCB7ICdmb28uanMnID0+IE1hcCB7ICdiYXIuanMnID0+IFNldCB7ICdvMicgfSB9IH1cbiAqXG4gKiBAdHlwZSB7TWFwPHN0cmluZywgTWFwPHN0cmluZywgU2V0PHN0cmluZz4+Pn1cbiAqL1xuY29uc3QgaW1wb3J0TGlzdCA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKiBMaXN0IG9mIGV4cG9ydHMgcGVyIGZpbGUuXG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSB0d28tbGV2ZWwgTWFwIHRvIGFuIG9iamVjdCBvZiBtZXRhZGF0YS4gVGhlIHVwcGVyLWxldmVsIE1hcFxuICoga2V5cyBhcmUgdGhlIHBhdGhzIHRvIHRoZSBtb2R1bGVzIGNvbnRhaW5pbmcgdGhlIGV4cG9ydHMsIHdoaWxlIHRoZVxuICogbG93ZXItbGV2ZWwgTWFwIGtleXMgYXJlIHRoZSBzcGVjaWZpYyBpZGVudGlmaWVycyBvciBzcGVjaWFsIEFTVCBub2RlIG5hbWVzXG4gKiBiZWluZyBleHBvcnRlZC4gVGhlIGxlYWYtbGV2ZWwgbWV0YWRhdGEgb2JqZWN0IGF0IHRoZSBtb21lbnQgb25seSBjb250YWlucyBhXG4gKiBgd2hlcmVVc2VkYCBwcm9wZXJ0eSwgd2hpY2ggY29udGFpbnMgYSBTZXQgb2YgcGF0aHMgdG8gbW9kdWxlcyB0aGF0IGltcG9ydFxuICogdGhlIG5hbWUuXG4gKlxuICogRm9yIGV4YW1wbGUsIGlmIHdlIGhhdmUgYSBmaWxlIG5hbWVkIGJhci5qcyBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgZXhwb3J0czpcbiAqXG4gKiAgIGNvbnN0IG8yID0gJ2Jhcic7XG4gKiAgIGV4cG9ydCB7IG8yIH07XG4gKlxuICogQW5kIGEgZmlsZSBuYW1lZCBmb28uanMgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIGltcG9ydDpcbiAqXG4gKiAgIGltcG9ydCB7IG8yIH0gZnJvbSAnLi9iYXIuanMnO1xuICpcbiAqIFRoZW4gd2Ugd2lsbCBoYXZlIGEgc3RydWN0dXJlIHRoYXQgbG9va3MgbGlrZTpcbiAqXG4gKiAgIE1hcCB7ICdiYXIuanMnID0+IE1hcCB7ICdvMicgPT4geyB3aGVyZVVzZWQ6IFNldCB7ICdmb28uanMnIH0gfSB9IH1cbiAqXG4gKiBAdHlwZSB7TWFwPHN0cmluZywgTWFwPHN0cmluZywgb2JqZWN0Pj59XG4gKi9cbmNvbnN0IGV4cG9ydExpc3QgPSBuZXcgTWFwKCk7XG5cbmNvbnN0IHZpc2l0b3JLZXlNYXAgPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlnbm9yZWRGaWxlcyA9IG5ldyBTZXQoKTtcbmNvbnN0IGZpbGVzT3V0c2lkZVNyYyA9IG5ldyBTZXQoKTtcblxuY29uc3QgaXNOb2RlTW9kdWxlID0gcGF0aCA9PiB7XG4gIHJldHVybiAvXFwvKG5vZGVfbW9kdWxlcylcXC8vLnRlc3QocGF0aCk7XG59O1xuXG4vKipcbiAqIHJlYWQgYWxsIGZpbGVzIG1hdGNoaW5nIHRoZSBwYXR0ZXJucyBpbiBzcmMgYW5kIGlnbm9yZUV4cG9ydHNcbiAqXG4gKiByZXR1cm4gYWxsIGZpbGVzIG1hdGNoaW5nIHNyYyBwYXR0ZXJuLCB3aGljaCBhcmUgbm90IG1hdGNoaW5nIHRoZSBpZ25vcmVFeHBvcnRzIHBhdHRlcm5cbiAqL1xuY29uc3QgcmVzb2x2ZUZpbGVzID0gKHNyYywgaWdub3JlRXhwb3J0cywgY29udGV4dCkgPT4ge1xuICBjb25zdCBleHRlbnNpb25zID0gQXJyYXkuZnJvbShnZXRGaWxlRXh0ZW5zaW9ucyhjb250ZXh0LnNldHRpbmdzKSk7XG5cbiAgY29uc3Qgc3JjRmlsZXMgPSBuZXcgU2V0KCk7XG4gIGNvbnN0IHNyY0ZpbGVMaXN0ID0gbGlzdEZpbGVzVG9Qcm9jZXNzKHNyYywgZXh0ZW5zaW9ucyk7XG5cbiAgLy8gcHJlcGFyZSBsaXN0IG9mIGlnbm9yZWQgZmlsZXNcbiAgY29uc3QgaWdub3JlZEZpbGVzTGlzdCA9ICBsaXN0RmlsZXNUb1Byb2Nlc3MoaWdub3JlRXhwb3J0cywgZXh0ZW5zaW9ucyk7XG4gIGlnbm9yZWRGaWxlc0xpc3QuZm9yRWFjaCgoeyBmaWxlbmFtZSB9KSA9PiBpZ25vcmVkRmlsZXMuYWRkKGZpbGVuYW1lKSk7XG5cbiAgLy8gcHJlcGFyZSBsaXN0IG9mIHNvdXJjZSBmaWxlcywgZG9uJ3QgY29uc2lkZXIgZmlsZXMgZnJvbSBub2RlX21vZHVsZXNcbiAgc3JjRmlsZUxpc3QuZmlsdGVyKCh7IGZpbGVuYW1lIH0pID0+ICFpc05vZGVNb2R1bGUoZmlsZW5hbWUpKS5mb3JFYWNoKCh7IGZpbGVuYW1lIH0pID0+IHtcbiAgICBzcmNGaWxlcy5hZGQoZmlsZW5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIHNyY0ZpbGVzO1xufTtcblxuLyoqXG4gKiBwYXJzZSBhbGwgc291cmNlIGZpbGVzIGFuZCBidWlsZCB1cCAyIG1hcHMgY29udGFpbmluZyB0aGUgZXhpc3RpbmcgaW1wb3J0cyBhbmQgZXhwb3J0c1xuICovXG5jb25zdCBwcmVwYXJlSW1wb3J0c0FuZEV4cG9ydHMgPSAoc3JjRmlsZXMsIGNvbnRleHQpID0+IHtcbiAgY29uc3QgZXhwb3J0QWxsID0gbmV3IE1hcCgpO1xuICBzcmNGaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgIGNvbnN0IGV4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgaW1wb3J0cyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBjdXJyZW50RXhwb3J0cyA9IEV4cG9ydHMuZ2V0KGZpbGUsIGNvbnRleHQpO1xuICAgIGlmIChjdXJyZW50RXhwb3J0cykge1xuICAgICAgY29uc3Qge1xuICAgICAgICBkZXBlbmRlbmNpZXMsXG4gICAgICAgIHJlZXhwb3J0cyxcbiAgICAgICAgaW1wb3J0czogbG9jYWxJbXBvcnRMaXN0LFxuICAgICAgICBuYW1lc3BhY2UsXG4gICAgICAgIHZpc2l0b3JLZXlzLFxuICAgICAgfSA9IGN1cnJlbnRFeHBvcnRzO1xuXG4gICAgICB2aXNpdG9yS2V5TWFwLnNldChmaWxlLCB2aXNpdG9yS2V5cyk7XG4gICAgICAvLyBkZXBlbmRlbmNpZXMgPT09IGV4cG9ydCAqIGZyb21cbiAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnRBbGwgPSBuZXcgU2V0KCk7XG4gICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaChnZXREZXBlbmRlbmN5ID0+IHtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jeSA9IGdldERlcGVuZGVuY3koKTtcbiAgICAgICAgaWYgKGRlcGVuZGVuY3kgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RXhwb3J0QWxsLmFkZChkZXBlbmRlbmN5LnBhdGgpO1xuICAgICAgfSk7XG4gICAgICBleHBvcnRBbGwuc2V0KGZpbGUsIGN1cnJlbnRFeHBvcnRBbGwpO1xuXG4gICAgICByZWV4cG9ydHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgZXhwb3J0cy5zZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWV4cG9ydCA9ICB2YWx1ZS5nZXRJbXBvcnQoKTtcbiAgICAgICAgaWYgKCFyZWV4cG9ydCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbG9jYWxJbXBvcnQgPSBpbXBvcnRzLmdldChyZWV4cG9ydC5wYXRoKTtcbiAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlLmxvY2FsID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgY3VycmVudFZhbHVlID0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHZhbHVlLmxvY2FsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbG9jYWxJbXBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgbG9jYWxJbXBvcnQgPSBuZXcgU2V0KFsuLi5sb2NhbEltcG9ydCwgY3VycmVudFZhbHVlXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxJbXBvcnQgPSBuZXcgU2V0KFtjdXJyZW50VmFsdWVdKTtcbiAgICAgICAgfVxuICAgICAgICBpbXBvcnRzLnNldChyZWV4cG9ydC5wYXRoLCBsb2NhbEltcG9ydCk7XG4gICAgICB9KTtcblxuICAgICAgbG9jYWxJbXBvcnRMaXN0LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKGlzTm9kZU1vZHVsZShrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxvY2FsSW1wb3J0ID0gaW1wb3J0cy5nZXQoa2V5KSB8fCBuZXcgU2V0KCk7XG4gICAgICAgIHZhbHVlLmRlY2xhcmF0aW9ucy5mb3JFYWNoKCh7IGltcG9ydGVkU3BlY2lmaWVycyB9KSA9PlxuICAgICAgICAgIGltcG9ydGVkU3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiBsb2NhbEltcG9ydC5hZGQoc3BlY2lmaWVyKSksXG4gICAgICAgICk7XG4gICAgICAgIGltcG9ydHMuc2V0KGtleSwgbG9jYWxJbXBvcnQpO1xuICAgICAgfSk7XG4gICAgICBpbXBvcnRMaXN0LnNldChmaWxlLCBpbXBvcnRzKTtcblxuICAgICAgLy8gYnVpbGQgdXAgZXhwb3J0IGxpc3Qgb25seSwgaWYgZmlsZSBpcyBub3QgaWdub3JlZFxuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbmFtZXNwYWNlLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gREVGQVVMVCkge1xuICAgICAgICAgIGV4cG9ydHMuc2V0KElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHBvcnRzLnNldChrZXksIHsgd2hlcmVVc2VkOiBuZXcgU2V0KCkgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBleHBvcnRzLnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgIGV4cG9ydHMuc2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgIGV4cG9ydExpc3Quc2V0KGZpbGUsIGV4cG9ydHMpO1xuICB9KTtcbiAgZXhwb3J0QWxsLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICB2YWx1ZS5mb3JFYWNoKHZhbCA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbCk7XG4gICAgICBjb25zdCBjdXJyZW50RXhwb3J0ID0gY3VycmVudEV4cG9ydHMuZ2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuYWRkKGtleSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiB0cmF2ZXJzZSB0aHJvdWdoIGFsbCBpbXBvcnRzIGFuZCBhZGQgdGhlIHJlc3BlY3RpdmUgcGF0aCB0byB0aGUgd2hlcmVVc2VkLWxpc3RcbiAqIG9mIHRoZSBjb3JyZXNwb25kaW5nIGV4cG9ydFxuICovXG5jb25zdCBkZXRlcm1pbmVVc2FnZSA9ICgpID0+IHtcbiAgaW1wb3J0TGlzdC5mb3JFYWNoKChsaXN0VmFsdWUsIGxpc3RLZXkpID0+IHtcbiAgICBsaXN0VmFsdWUuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KGtleSk7XG4gICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhbHVlLmZvckVhY2goY3VycmVudEltcG9ydCA9PiB7XG4gICAgICAgICAgbGV0IHNwZWNpZmllcjtcbiAgICAgICAgICBpZiAoY3VycmVudEltcG9ydCA9PT0gSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpIHtcbiAgICAgICAgICAgIHNwZWNpZmllciA9IElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEltcG9ydCA9PT0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKSB7XG4gICAgICAgICAgICBzcGVjaWZpZXIgPSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNwZWNpZmllciA9IGN1cnJlbnRJbXBvcnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2Ygc3BlY2lmaWVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgZXhwb3J0U3RhdGVtZW50ID0gZXhwb3J0cy5nZXQoc3BlY2lmaWVyKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0U3RhdGVtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjb25zdCB7IHdoZXJlVXNlZCB9ID0gZXhwb3J0U3RhdGVtZW50O1xuICAgICAgICAgICAgICB3aGVyZVVzZWQuYWRkKGxpc3RLZXkpO1xuICAgICAgICAgICAgICBleHBvcnRzLnNldChzcGVjaWZpZXIsIHsgd2hlcmVVc2VkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuY29uc3QgZ2V0U3JjID0gc3JjID0+IHtcbiAgaWYgKHNyYykge1xuICAgIHJldHVybiBzcmM7XG4gIH1cbiAgcmV0dXJuIFtwcm9jZXNzLmN3ZCgpXTtcbn07XG5cbi8qKlxuICogcHJlcGFyZSB0aGUgbGlzdHMgb2YgZXhpc3RpbmcgaW1wb3J0cyBhbmQgZXhwb3J0cyAtIHNob3VsZCBvbmx5IGJlIGV4ZWN1dGVkIG9uY2UgYXRcbiAqIHRoZSBzdGFydCBvZiBhIG5ldyBlc2xpbnQgcnVuXG4gKi9cbmxldCBzcmNGaWxlcztcbmxldCBsYXN0UHJlcGFyZUtleTtcbmNvbnN0IGRvUHJlcGFyYXRpb24gPSAoc3JjLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IHByZXBhcmVLZXkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgc3JjOiAoc3JjIHx8IFtdKS5zb3J0KCksXG4gICAgaWdub3JlRXhwb3J0czogKGlnbm9yZUV4cG9ydHMgfHwgW10pLnNvcnQoKSxcbiAgICBleHRlbnNpb25zOiBBcnJheS5mcm9tKGdldEZpbGVFeHRlbnNpb25zKGNvbnRleHQuc2V0dGluZ3MpKS5zb3J0KCksXG4gIH0pO1xuICBpZiAocHJlcGFyZUtleSA9PT0gbGFzdFByZXBhcmVLZXkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpbXBvcnRMaXN0LmNsZWFyKCk7XG4gIGV4cG9ydExpc3QuY2xlYXIoKTtcbiAgaWdub3JlZEZpbGVzLmNsZWFyKCk7XG4gIGZpbGVzT3V0c2lkZVNyYy5jbGVhcigpO1xuXG4gIHNyY0ZpbGVzID0gcmVzb2x2ZUZpbGVzKGdldFNyYyhzcmMpLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KTtcbiAgcHJlcGFyZUltcG9ydHNBbmRFeHBvcnRzKHNyY0ZpbGVzLCBjb250ZXh0KTtcbiAgZGV0ZXJtaW5lVXNhZ2UoKTtcbiAgbGFzdFByZXBhcmVLZXkgPSBwcmVwYXJlS2V5O1xufTtcblxuY29uc3QgbmV3TmFtZXNwYWNlSW1wb3J0RXhpc3RzID0gc3BlY2lmaWVycyA9PlxuICBzcGVjaWZpZXJzLnNvbWUoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG5cbmNvbnN0IG5ld0RlZmF1bHRJbXBvcnRFeGlzdHMgPSBzcGVjaWZpZXJzID0+XG4gIHNwZWNpZmllcnMuc29tZSgoeyB0eXBlIH0pID0+IHR5cGUgPT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUik7XG5cbmNvbnN0IGZpbGVJc0luUGtnID0gZmlsZSA9PiB7XG4gIGNvbnN0IHsgcGF0aCwgcGtnIH0gPSByZWFkUGtnVXAoeyBjd2Q6IGZpbGUgfSk7XG4gIGNvbnN0IGJhc2VQYXRoID0gZGlybmFtZShwYXRoKTtcblxuICBjb25zdCBjaGVja1BrZ0ZpZWxkU3RyaW5nID0gcGtnRmllbGQgPT4ge1xuICAgIGlmIChqb2luKGJhc2VQYXRoLCBwa2dGaWVsZCkgPT09IGZpbGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBjaGVja1BrZ0ZpZWxkT2JqZWN0ID0gcGtnRmllbGQgPT4ge1xuICAgIGNvbnN0IHBrZ0ZpZWxkRmlsZXMgPSB2YWx1ZXMocGtnRmllbGQpLm1hcCh2YWx1ZSA9PiBqb2luKGJhc2VQYXRoLCB2YWx1ZSkpO1xuICAgIGlmIChpbmNsdWRlcyhwa2dGaWVsZEZpbGVzLCBmaWxlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNoZWNrUGtnRmllbGQgPSBwa2dGaWVsZCA9PiB7XG4gICAgaWYgKHR5cGVvZiBwa2dGaWVsZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBjaGVja1BrZ0ZpZWxkU3RyaW5nKHBrZ0ZpZWxkKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBrZ0ZpZWxkID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGNoZWNrUGtnRmllbGRPYmplY3QocGtnRmllbGQpO1xuICAgIH1cbiAgfTtcblxuICBpZiAocGtnLnByaXZhdGUgPT09IHRydWUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAocGtnLmJpbikge1xuICAgIGlmIChjaGVja1BrZ0ZpZWxkKHBrZy5iaW4pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAocGtnLmJyb3dzZXIpIHtcbiAgICBpZiAoY2hlY2tQa2dGaWVsZChwa2cuYnJvd3NlcikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwa2cubWFpbikge1xuICAgIGlmIChjaGVja1BrZ0ZpZWxkU3RyaW5nKHBrZy5tYWluKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICB0eXBlOiAnc3VnZ2VzdGlvbicsXG4gICAgZG9jczogeyB1cmw6IGRvY3NVcmwoJ25vLXVudXNlZC1tb2R1bGVzJykgfSxcbiAgICBzY2hlbWE6IFt7XG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNyYzoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZXMvcGF0aHMgdG8gYmUgYW5hbHl6ZWQgKG9ubHkgZm9yIHVudXNlZCBleHBvcnRzKScsXG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBtaW5JdGVtczogMSxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgaWdub3JlRXhwb3J0czoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgJ2ZpbGVzL3BhdGhzIGZvciB3aGljaCB1bnVzZWQgZXhwb3J0cyB3aWxsIG5vdCBiZSByZXBvcnRlZCAoZS5nIG1vZHVsZSBlbnRyeSBwb2ludHMpJyxcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIG1pbkl0ZW1zOiAxLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBtaXNzaW5nRXhwb3J0czoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAncmVwb3J0IG1vZHVsZXMgd2l0aG91dCBhbnkgZXhwb3J0cycsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICB9LFxuICAgICAgICB1bnVzZWRFeHBvcnRzOiB7XG4gICAgICAgICAgZGVzY3JpcHRpb246ICdyZXBvcnQgZXhwb3J0cyB3aXRob3V0IGFueSB1c2FnZScsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG5vdDoge1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdW51c2VkRXhwb3J0czogeyBlbnVtOiBbZmFsc2VdIH0sXG4gICAgICAgICAgbWlzc2luZ0V4cG9ydHM6IHsgZW51bTogW2ZhbHNlXSB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFueU9mOlt7XG4gICAgICAgIG5vdDoge1xuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIHVudXNlZEV4cG9ydHM6IHsgZW51bTogW3RydWVdIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZWQ6IFsnbWlzc2luZ0V4cG9ydHMnXSxcbiAgICAgIH0sIHtcbiAgICAgICAgbm90OiB7XG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgbWlzc2luZ0V4cG9ydHM6IHsgZW51bTogW3RydWVdIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZWQ6IFsndW51c2VkRXhwb3J0cyddLFxuICAgICAgfSwge1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdW51c2VkRXhwb3J0czogeyBlbnVtOiBbdHJ1ZV0gfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZWQ6IFsndW51c2VkRXhwb3J0cyddLFxuICAgICAgfSwge1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbWlzc2luZ0V4cG9ydHM6IHsgZW51bTogW3RydWVdIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbJ21pc3NpbmdFeHBvcnRzJ10sXG4gICAgICB9XSxcbiAgICB9XSxcbiAgfSxcblxuICBjcmVhdGU6IGNvbnRleHQgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHNyYyxcbiAgICAgIGlnbm9yZUV4cG9ydHMgPSBbXSxcbiAgICAgIG1pc3NpbmdFeHBvcnRzLFxuICAgICAgdW51c2VkRXhwb3J0cyxcbiAgICB9ID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuXG4gICAgaWYgKHVudXNlZEV4cG9ydHMpIHtcbiAgICAgIGRvUHJlcGFyYXRpb24oc3JjLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlID0gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCk7XG5cbiAgICBjb25zdCBjaGVja0V4cG9ydFByZXNlbmNlID0gbm9kZSA9PiB7XG4gICAgICBpZiAoIW1pc3NpbmdFeHBvcnRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBleHBvcnRDb3VudCA9IGV4cG9ydExpc3QuZ2V0KGZpbGUpO1xuICAgICAgY29uc3QgZXhwb3J0QWxsID0gZXhwb3J0Q291bnQuZ2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgY29uc3QgbmFtZXNwYWNlSW1wb3J0cyA9IGV4cG9ydENvdW50LmdldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG5cbiAgICAgIGV4cG9ydENvdW50LmRlbGV0ZShFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGV4cG9ydENvdW50LmRlbGV0ZShJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG4gICAgICBpZiAoZXhwb3J0Q291bnQuc2l6ZSA8IDEpIHtcbiAgICAgICAgLy8gbm9kZS5ib2R5WzBdID09PSAndW5kZWZpbmVkJyBvbmx5IGhhcHBlbnMsIGlmIGV2ZXJ5dGhpbmcgaXMgY29tbWVudGVkIG91dCBpbiB0aGUgZmlsZVxuICAgICAgICAvLyBiZWluZyBsaW50ZWRcbiAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZS5ib2R5WzBdID8gbm9kZS5ib2R5WzBdIDogbm9kZSwgJ05vIGV4cG9ydHMgZm91bmQnKTtcbiAgICAgIH1cbiAgICAgIGV4cG9ydENvdW50LnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCBleHBvcnRBbGwpO1xuICAgICAgZXhwb3J0Q291bnQuc2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSLCBuYW1lc3BhY2VJbXBvcnRzKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY2hlY2tVc2FnZSA9IChub2RlLCBleHBvcnRlZFZhbHVlKSA9PiB7XG4gICAgICBpZiAoIXVudXNlZEV4cG9ydHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWdub3JlZEZpbGVzLmhhcyhmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlSXNJblBrZyhmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChmaWxlc091dHNpZGVTcmMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gbWFrZSBzdXJlIGZpbGUgdG8gYmUgbGludGVkIGlzIGluY2x1ZGVkIGluIHNvdXJjZSBmaWxlc1xuICAgICAgaWYgKCFzcmNGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgc3JjRmlsZXMgPSByZXNvbHZlRmlsZXMoZ2V0U3JjKHNyYyksIGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpO1xuICAgICAgICBpZiAoIXNyY0ZpbGVzLmhhcyhmaWxlKSkge1xuICAgICAgICAgIGZpbGVzT3V0c2lkZVNyYy5hZGQoZmlsZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldChmaWxlKTtcblxuICAgICAgLy8gc3BlY2lhbCBjYXNlOiBleHBvcnQgKiBmcm9tXG4gICAgICBjb25zdCBleHBvcnRBbGwgPSBleHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGlmICh0eXBlb2YgZXhwb3J0QWxsICE9PSAndW5kZWZpbmVkJyAmJiBleHBvcnRlZFZhbHVlICE9PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpIHtcbiAgICAgICAgaWYgKGV4cG9ydEFsbC53aGVyZVVzZWQuc2l6ZSA+IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gc3BlY2lhbCBjYXNlOiBuYW1lc3BhY2UgaW1wb3J0XG4gICAgICBjb25zdCBuYW1lc3BhY2VJbXBvcnRzID0gZXhwb3J0cy5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuICAgICAgaWYgKHR5cGVvZiBuYW1lc3BhY2VJbXBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAobmFtZXNwYWNlSW1wb3J0cy53aGVyZVVzZWQuc2l6ZSA+IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZXhwb3J0c0xpc3Qgd2lsbCBhbHdheXMgbWFwIGFueSBpbXBvcnRlZCB2YWx1ZSBvZiAnZGVmYXVsdCcgdG8gJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInXG4gICAgICBjb25zdCBleHBvcnRzS2V5ID0gZXhwb3J0ZWRWYWx1ZSA9PT0gREVGQVVMVCA/IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiA6IGV4cG9ydGVkVmFsdWU7XG5cbiAgICAgIGNvbnN0IGV4cG9ydFN0YXRlbWVudCA9IGV4cG9ydHMuZ2V0KGV4cG9ydHNLZXkpO1xuXG4gICAgICBjb25zdCB2YWx1ZSA9IGV4cG9ydHNLZXkgPT09IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiA/IERFRkFVTFQgOiBleHBvcnRzS2V5O1xuXG4gICAgICBpZiAodHlwZW9mIGV4cG9ydFN0YXRlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKGV4cG9ydFN0YXRlbWVudC53aGVyZVVzZWQuc2l6ZSA8IDEpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBgZXhwb3J0ZWQgZGVjbGFyYXRpb24gJyR7dmFsdWV9JyBub3QgdXNlZCB3aXRoaW4gb3RoZXIgbW9kdWxlc2AsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBgZXhwb3J0ZWQgZGVjbGFyYXRpb24gJyR7dmFsdWV9JyBub3QgdXNlZCB3aXRoaW4gb3RoZXIgbW9kdWxlc2AsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIG9ubHkgdXNlZnVsIGZvciB0b29scyBsaWtlIHZzY29kZS1lc2xpbnRcbiAgICAgKlxuICAgICAqIHVwZGF0ZSBsaXN0cyBvZiBleGlzdGluZyBleHBvcnRzIGR1cmluZyBydW50aW1lXG4gICAgICovXG4gICAgY29uc3QgdXBkYXRlRXhwb3J0VXNhZ2UgPSBub2RlID0+IHtcbiAgICAgIGlmIChpZ25vcmVkRmlsZXMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldChmaWxlKTtcblxuICAgICAgLy8gbmV3IG1vZHVsZSBoYXMgYmVlbiBjcmVhdGVkIGR1cmluZyBydW50aW1lXG4gICAgICAvLyBpbmNsdWRlIGl0IGluIGZ1cnRoZXIgcHJvY2Vzc2luZ1xuICAgICAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBleHBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdFeHBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgY29uc3QgbmV3RXhwb3J0SWRlbnRpZmllcnMgPSBuZXcgU2V0KCk7XG5cbiAgICAgIG5vZGUuYm9keS5mb3JFYWNoKCh7IHR5cGUsIGRlY2xhcmF0aW9uLCBzcGVjaWZpZXJzIH0pID0+IHtcbiAgICAgICAgaWYgKHR5cGUgPT09IEVYUE9SVF9ERUZBVUxUX0RFQ0xBUkFUSU9OKSB7XG4gICAgICAgICAgbmV3RXhwb3J0SWRlbnRpZmllcnMuYWRkKElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09IEVYUE9SVF9OQU1FRF9ERUNMQVJBVElPTikge1xuICAgICAgICAgIGlmIChzcGVjaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNwZWNpZmllcnMuZm9yRWFjaChzcGVjaWZpZXIgPT4ge1xuICAgICAgICAgICAgICBpZiAoc3BlY2lmaWVyLmV4cG9ydGVkKSB7XG4gICAgICAgICAgICAgICAgbmV3RXhwb3J0SWRlbnRpZmllcnMuYWRkKHNwZWNpZmllci5leHBvcnRlZC5uYW1lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvckVhY2hEZWNsYXJhdGlvbklkZW50aWZpZXIoZGVjbGFyYXRpb24sIChuYW1lKSA9PiB7XG4gICAgICAgICAgICBuZXdFeHBvcnRJZGVudGlmaWVycy5hZGQobmFtZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBvbGQgZXhwb3J0cyBleGlzdCB3aXRoaW4gbGlzdCBvZiBuZXcgZXhwb3J0cyBpZGVudGlmaWVyczogYWRkIHRvIG1hcCBvZiBuZXcgZXhwb3J0c1xuICAgICAgZXhwb3J0cy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmIChuZXdFeHBvcnRJZGVudGlmaWVycy5oYXMoa2V5KSkge1xuICAgICAgICAgIG5ld0V4cG9ydHMuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gbmV3IGV4cG9ydCBpZGVudGlmaWVycyBhZGRlZDogYWRkIHRvIG1hcCBvZiBuZXcgZXhwb3J0c1xuICAgICAgbmV3RXhwb3J0SWRlbnRpZmllcnMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAoIWV4cG9ydHMuaGFzKGtleSkpIHtcbiAgICAgICAgICBuZXdFeHBvcnRzLnNldChrZXksIHsgd2hlcmVVc2VkOiBuZXcgU2V0KCkgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBwcmVzZXJ2ZSBpbmZvcm1hdGlvbiBhYm91dCBuYW1lc3BhY2UgaW1wb3J0c1xuICAgICAgY29uc3QgZXhwb3J0QWxsID0gZXhwb3J0cy5nZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICBsZXQgbmFtZXNwYWNlSW1wb3J0cyA9IGV4cG9ydHMuZ2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcblxuICAgICAgaWYgKHR5cGVvZiBuYW1lc3BhY2VJbXBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBuYW1lc3BhY2VJbXBvcnRzID0geyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9O1xuICAgICAgfVxuXG4gICAgICBuZXdFeHBvcnRzLnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCBleHBvcnRBbGwpO1xuICAgICAgbmV3RXhwb3J0cy5zZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIsIG5hbWVzcGFjZUltcG9ydHMpO1xuICAgICAgZXhwb3J0TGlzdC5zZXQoZmlsZSwgbmV3RXhwb3J0cyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIG9ubHkgdXNlZnVsIGZvciB0b29scyBsaWtlIHZzY29kZS1lc2xpbnRcbiAgICAgKlxuICAgICAqIHVwZGF0ZSBsaXN0cyBvZiBleGlzdGluZyBpbXBvcnRzIGR1cmluZyBydW50aW1lXG4gICAgICovXG4gICAgY29uc3QgdXBkYXRlSW1wb3J0VXNhZ2UgPSBub2RlID0+IHtcbiAgICAgIGlmICghdW51c2VkRXhwb3J0cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBvbGRJbXBvcnRQYXRocyA9IGltcG9ydExpc3QuZ2V0KGZpbGUpO1xuICAgICAgaWYgKHR5cGVvZiBvbGRJbXBvcnRQYXRocyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb2xkSW1wb3J0UGF0aHMgPSBuZXcgTWFwKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9sZE5hbWVzcGFjZUltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICBjb25zdCBuZXdOYW1lc3BhY2VJbXBvcnRzID0gbmV3IFNldCgpO1xuXG4gICAgICBjb25zdCBvbGRFeHBvcnRBbGwgPSBuZXcgU2V0KCk7XG4gICAgICBjb25zdCBuZXdFeHBvcnRBbGwgPSBuZXcgU2V0KCk7XG5cbiAgICAgIGNvbnN0IG9sZERlZmF1bHRJbXBvcnRzID0gbmV3IFNldCgpO1xuICAgICAgY29uc3QgbmV3RGVmYXVsdEltcG9ydHMgPSBuZXcgU2V0KCk7XG5cbiAgICAgIGNvbnN0IG9sZEltcG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICBjb25zdCBuZXdJbXBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgb2xkSW1wb3J0UGF0aHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAodmFsdWUuaGFzKEVYUE9SVF9BTExfREVDTEFSQVRJT04pKSB7XG4gICAgICAgICAgb2xkRXhwb3J0QWxsLmFkZChrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZS5oYXMoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpKSB7XG4gICAgICAgICAgb2xkTmFtZXNwYWNlSW1wb3J0cy5hZGQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUuaGFzKElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUikpIHtcbiAgICAgICAgICBvbGREZWZhdWx0SW1wb3J0cy5hZGQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZS5mb3JFYWNoKHZhbCA9PiB7XG4gICAgICAgICAgaWYgKHZhbCAhPT0gSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIgJiZcbiAgICAgICAgICAgICAgdmFsICE9PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpIHtcbiAgICAgICAgICAgIG9sZEltcG9ydHMuc2V0KHZhbCwga2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHByb2Nlc3NEeW5hbWljSW1wb3J0KHNvdXJjZSkge1xuICAgICAgICBpZiAoc291cmNlLnR5cGUgIT09ICdMaXRlcmFsJykge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHAgPSByZXNvbHZlKHNvdXJjZS52YWx1ZSwgY29udGV4dCk7XG4gICAgICAgIGlmIChwID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBuZXdOYW1lc3BhY2VJbXBvcnRzLmFkZChwKTtcbiAgICAgIH1cblxuICAgICAgdmlzaXQobm9kZSwgdmlzaXRvcktleU1hcC5nZXQoZmlsZSksIHtcbiAgICAgICAgSW1wb3J0RXhwcmVzc2lvbihjaGlsZCkge1xuICAgICAgICAgIHByb2Nlc3NEeW5hbWljSW1wb3J0KGNoaWxkLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIENhbGxFeHByZXNzaW9uKGNoaWxkKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLmNhbGxlZS50eXBlID09PSAnSW1wb3J0Jykge1xuICAgICAgICAgICAgcHJvY2Vzc0R5bmFtaWNJbXBvcnQoY2hpbGQuYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgbm9kZS5ib2R5LmZvckVhY2goYXN0Tm9kZSA9PiB7XG4gICAgICAgIGxldCByZXNvbHZlZFBhdGg7XG5cbiAgICAgICAgLy8gc3VwcG9ydCBmb3IgZXhwb3J0IHsgdmFsdWUgfSBmcm9tICdtb2R1bGUnXG4gICAgICAgIGlmIChhc3ROb2RlLnR5cGUgPT09IEVYUE9SVF9OQU1FRF9ERUNMQVJBVElPTikge1xuICAgICAgICAgIGlmIChhc3ROb2RlLnNvdXJjZSkge1xuICAgICAgICAgICAgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZShhc3ROb2RlLnNvdXJjZS5yYXcucmVwbGFjZSgvKCd8XCIpL2csICcnKSwgY29udGV4dCk7XG4gICAgICAgICAgICBhc3ROb2RlLnNwZWNpZmllcnMuZm9yRWFjaChzcGVjaWZpZXIgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3BlY2lmaWVyLmxvY2FsLm5hbWU7XG4gICAgICAgICAgICAgIGlmIChzcGVjaWZpZXIubG9jYWwubmFtZSA9PT0gREVGQVVMVCkge1xuICAgICAgICAgICAgICAgIG5ld0RlZmF1bHRJbXBvcnRzLmFkZChyZXNvbHZlZFBhdGgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0ltcG9ydHMuc2V0KG5hbWUsIHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhc3ROb2RlLnR5cGUgPT09IEVYUE9SVF9BTExfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICByZXNvbHZlZFBhdGggPSByZXNvbHZlKGFzdE5vZGUuc291cmNlLnJhdy5yZXBsYWNlKC8oJ3xcIikvZywgJycpLCBjb250ZXh0KTtcbiAgICAgICAgICBuZXdFeHBvcnRBbGwuYWRkKHJlc29sdmVkUGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXN0Tm9kZS50eXBlID09PSBJTVBPUlRfREVDTEFSQVRJT04pIHtcbiAgICAgICAgICByZXNvbHZlZFBhdGggPSByZXNvbHZlKGFzdE5vZGUuc291cmNlLnJhdy5yZXBsYWNlKC8oJ3xcIikvZywgJycpLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoIXJlc29sdmVkUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc05vZGVNb2R1bGUocmVzb2x2ZWRQYXRoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChuZXdOYW1lc3BhY2VJbXBvcnRFeGlzdHMoYXN0Tm9kZS5zcGVjaWZpZXJzKSkge1xuICAgICAgICAgICAgbmV3TmFtZXNwYWNlSW1wb3J0cy5hZGQocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobmV3RGVmYXVsdEltcG9ydEV4aXN0cyhhc3ROb2RlLnNwZWNpZmllcnMpKSB7XG4gICAgICAgICAgICBuZXdEZWZhdWx0SW1wb3J0cy5hZGQocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhc3ROb2RlLnNwZWNpZmllcnMuZm9yRWFjaChzcGVjaWZpZXIgPT4ge1xuICAgICAgICAgICAgaWYgKHNwZWNpZmllci50eXBlID09PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgfHxcbiAgICAgICAgICAgICAgICBzcGVjaWZpZXIudHlwZSA9PT0gSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3SW1wb3J0cy5zZXQoc3BlY2lmaWVyLmltcG9ydGVkLm5hbWUsIHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBuZXdFeHBvcnRBbGwuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghb2xkRXhwb3J0QWxsLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBsZXQgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpbXBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1wb3J0cy5hZGQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICAgICAgb2xkSW1wb3J0UGF0aHMuc2V0KHZhbHVlLCBpbXBvcnRzKTtcblxuICAgICAgICAgIGxldCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGxldCBjdXJyZW50RXhwb3J0O1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OLCB7IHdoZXJlVXNlZCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBvbGRFeHBvcnRBbGwuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghbmV3RXhwb3J0QWxsLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcblxuICAgICAgICAgIGNvbnN0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5kZWxldGUoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbmV3RGVmYXVsdEltcG9ydHMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghb2xkRGVmYXVsdEltcG9ydHMuaGFzKHZhbHVlKSkge1xuICAgICAgICAgIGxldCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGltcG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpbXBvcnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbXBvcnRzLmFkZChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuICAgICAgICAgIG9sZEltcG9ydFBhdGhzLnNldCh2YWx1ZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICBsZXQgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBsZXQgY3VycmVudEV4cG9ydDtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIsIHsgd2hlcmVVc2VkIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG9sZERlZmF1bHRJbXBvcnRzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICBpZiAoIW5ld0RlZmF1bHRJbXBvcnRzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuXG4gICAgICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuZGVsZXRlKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG5ld05hbWVzcGFjZUltcG9ydHMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghb2xkTmFtZXNwYWNlSW1wb3J0cy5oYXModmFsdWUpKSB7XG4gICAgICAgICAgbGV0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltcG9ydHMuYWRkKElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgICAgICBvbGRJbXBvcnRQYXRocy5zZXQodmFsdWUsIGltcG9ydHMpO1xuXG4gICAgICAgICAgbGV0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgbGV0IGN1cnJlbnRFeHBvcnQ7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkTmFtZXNwYWNlSW1wb3J0cy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCFuZXdOYW1lc3BhY2VJbXBvcnRzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG5cbiAgICAgICAgICBjb25zdCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmRlbGV0ZShmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBuZXdJbXBvcnRzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKCFvbGRJbXBvcnRzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgbGV0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltcG9ydHMuYWRkKGtleSk7XG4gICAgICAgICAgb2xkSW1wb3J0UGF0aHMuc2V0KHZhbHVlLCBpbXBvcnRzKTtcblxuICAgICAgICAgIGxldCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGxldCBjdXJyZW50RXhwb3J0O1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChrZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgZXhwb3J0TGlzdC5zZXQodmFsdWUsIGV4cG9ydHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgd2hlcmVVc2VkID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgd2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICAgIGV4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkSW1wb3J0cy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmICghbmV3SW1wb3J0cy5oYXMoa2V5KSkge1xuICAgICAgICAgIGNvbnN0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGltcG9ydHMuZGVsZXRlKGtleSk7XG5cbiAgICAgICAgICBjb25zdCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5kZWxldGUoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICdQcm9ncmFtOmV4aXQnOiBub2RlID0+IHtcbiAgICAgICAgdXBkYXRlRXhwb3J0VXNhZ2Uobm9kZSk7XG4gICAgICAgIHVwZGF0ZUltcG9ydFVzYWdlKG5vZGUpO1xuICAgICAgICBjaGVja0V4cG9ydFByZXNlbmNlKG5vZGUpO1xuICAgICAgfSxcbiAgICAgICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nOiBub2RlID0+IHtcbiAgICAgICAgY2hlY2tVc2FnZShub2RlLCBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuICAgICAgfSxcbiAgICAgICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJzogbm9kZSA9PiB7XG4gICAgICAgIG5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKHNwZWNpZmllciA9PiB7XG4gICAgICAgICAgY2hlY2tVc2FnZShub2RlLCBzcGVjaWZpZXIuZXhwb3J0ZWQubmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3JFYWNoRGVjbGFyYXRpb25JZGVudGlmaWVyKG5vZGUuZGVjbGFyYXRpb24sIChuYW1lKSA9PiB7XG4gICAgICAgICAgY2hlY2tVc2FnZShub2RlLCBuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19