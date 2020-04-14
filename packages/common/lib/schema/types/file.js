"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = exports.isLegalFilename = void 0;var _fp = require("lodash/fp");
var _typeHelpers = require("./typeHelpers");





var _index = require("../../common/index.js");







var illegalCharacters = "*?\\/:<>|\0\b\f\v";

var isLegalFilename = function isLegalFilename(filePath) {
  var fn = fileName(filePath);
  return (
    fn.length <= 255 &&
    (0, _fp.intersection)(fn.split(""))(illegalCharacters.split("")).length === 0 &&
    (0, _index.none)(function (f) {return f === "..";})((0, _index.splitKey)(filePath)));

};exports.isLegalFilename = isLegalFilename;

var fileNothing = function fileNothing() {return { relativePath: "", size: 0 };};

var fileFunctions = (0, _typeHelpers.typeFunctions)({
  "default": fileNothing });


var fileTryParse = function fileTryParse(v) {return (
    (0, _index.switchCase)(
    [isValidFile, _typeHelpers.parsedSuccess],
    [_fp.isNull, function () {return (0, _typeHelpers.parsedSuccess)(fileNothing());}],
    [_index.defaultCase, _typeHelpers.parsedFailed])(
    v));};

var fileName = function fileName(filePath) {return (0, _index.$)(filePath, [_index.splitKey, _fp.last]);};

var isValidFile = function isValidFile(f) {return (
    !(0, _fp.isNull)(f) &&
    (0, _fp.has)("relativePath")(f) &&
    (0, _fp.has)("size")(f) &&
    (0, _fp.isNumber)(f.size) &&
    (0, _fp.isString)(f.relativePath) &&
    isLegalFilename(f.relativePath));};

var options = {};

var typeConstraints = [];var _default =

(0, _typeHelpers.getDefaultExport)(
"file",
fileTryParse,
fileFunctions,
options,
typeConstraints,
{ relativePath: "some_file.jpg", size: 1000 },
JSON.stringify);exports["default"] = _default;
//# sourceMappingURL=file.js.map