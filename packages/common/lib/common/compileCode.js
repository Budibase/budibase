"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.compileCode = void 0;var _compilerUtil = require("@nx-js/compiler-util");
var _fp = require("lodash/fp");

var compileCode = function compileCode(code) {
  var func;
  var safeCode;

  if ((0, _fp.includes)("return ")(code)) {
    safeCode = code;
  } else {
    var trimmed = code.trim();
    trimmed = trimmed.endsWith(";") ?
    trimmed.substring(0, trimmed.length - 1) :
    trimmed;
    safeCode = "return (".concat(trimmed, ")");
  }

  try {
    func = (0, _compilerUtil.compileCode)(safeCode);
  } catch (e) {
    e.message = "Error compiling code : ".concat(code, " : ").concat(e.message);
    throw e;
  }

  return func;
};exports.compileCode = compileCode;
//# sourceMappingURL=compileCode.js.map