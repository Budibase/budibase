var _Reflect$get = require("@babel/runtime-corejs3/core-js/reflect/get");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor");

var superPropBase = require("./superPropBase.js");

function _get() {
  if (typeof Reflect !== "undefined" && _Reflect$get) {
    module.exports = _get = _Reflect$get, module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;

      var desc = _Object$getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }

      return desc.value;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }

  return _get.apply(this, arguments);
}

module.exports = _get, module.exports.__esModule = true, module.exports["default"] = module.exports;