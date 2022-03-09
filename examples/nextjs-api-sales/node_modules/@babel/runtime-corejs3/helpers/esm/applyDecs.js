import _typeof from "./typeof.js";
import _Map from "@babel/runtime-corejs3/core-js/map";
import _Symbol from "@babel/runtime-corejs3/core-js/symbol";
import _Symbol$for from "@babel/runtime-corejs3/core-js/symbol/for";
import _Object$getOwnPropertySymbols from "@babel/runtime-corejs3/core-js/object/get-own-property-symbols";
import _Object$setPrototypeOf from "@babel/runtime-corejs3/core-js/object/set-prototype-of";
import _Array$from from "@babel/runtime-corejs3/core-js/array/from";
import _valuesInstanceProperty from "@babel/runtime-corejs3/core-js/instance/values";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js/instance/concat";
import _Object$assign from "@babel/runtime-corejs3/core-js/object/assign";
import _Object$getOwnPropertyDescriptor from "@babel/runtime-corejs3/core-js/object/get-own-property-descriptor";
import _Object$defineProperty from "@babel/runtime-corejs3/core-js/object/define-property";
import _Array$isArray from "@babel/runtime-corejs3/core-js/array/is-array";
import _sliceInstanceProperty from "@babel/runtime-corejs3/core-js/instance/slice";

function createMetadataMethodsForProperty(metadataMap, kind, property) {
  return {
    getMetadata: function getMetadata(key) {
      if ("symbol" != _typeof(key)) throw new TypeError("Metadata keys must be symbols, received: " + key);
      var metadataForKey = metadataMap[key];
      if (void 0 !== metadataForKey) if (1 === kind) {
        var pub = metadataForKey["public"];
        if (void 0 !== pub) return pub[property];
      } else if (2 === kind) {
        var priv = metadataForKey["private"];
        if (void 0 !== priv) return priv.get(property);
      } else if (Object.hasOwnProperty.call(metadataForKey, "constructor")) return metadataForKey.constructor;
    },
    setMetadata: function setMetadata(key, value) {
      if ("symbol" != _typeof(key)) throw new TypeError("Metadata keys must be symbols, received: " + key);
      var metadataForKey = metadataMap[key];

      if (void 0 === metadataForKey && (metadataForKey = metadataMap[key] = {}), 1 === kind) {
        var pub = metadataForKey["public"];
        void 0 === pub && (pub = metadataForKey["public"] = {}), pub[property] = value;
      } else if (2 === kind) {
        var priv = metadataForKey.priv;
        void 0 === priv && (priv = metadataForKey["private"] = new _Map()), priv.set(property, value);
      } else metadataForKey.constructor = value;
    }
  };
}

function convertMetadataMapToFinal(obj, metadataMap) {
  var parentMetadataMap = obj[_Symbol.metadata || _Symbol$for("Symbol.metadata")],
      metadataKeys = _Object$getOwnPropertySymbols(metadataMap);

  if (0 !== metadataKeys.length) {
    for (var i = 0; i < metadataKeys.length; i++) {
      var key = metadataKeys[i],
          metaForKey = metadataMap[key],
          parentMetaForKey = parentMetadataMap ? parentMetadataMap[key] : null,
          pub = metaForKey["public"],
          parentPub = parentMetaForKey ? parentMetaForKey["public"] : null;
      pub && parentPub && _Object$setPrototypeOf(pub, parentPub);
      var priv = metaForKey["private"];

      if (priv) {
        var privArr = _Array$from(_valuesInstanceProperty(priv).call(priv)),
            parentPriv = parentMetaForKey ? parentMetaForKey["private"] : null;

        parentPriv && (privArr = _concatInstanceProperty(privArr).call(privArr, parentPriv)), metaForKey["private"] = privArr;
      }

      parentMetaForKey && _Object$setPrototypeOf(metaForKey, parentMetaForKey);
    }

    parentMetadataMap && _Object$setPrototypeOf(metadataMap, parentMetadataMap), obj[_Symbol.metadata || _Symbol$for("Symbol.metadata")] = metadataMap;
  }
}

function createAddInitializerMethod(initializers) {
  return function (initializer) {
    assertValidInitializer(initializer), initializers.push(initializer);
  };
}

function memberDecCtx(base, name, desc, metadataMap, initializers, kind, isStatic, isPrivate) {
  var kindStr;

  switch (kind) {
    case 1:
      kindStr = "accessor";
      break;

    case 2:
      kindStr = "method";
      break;

    case 3:
      kindStr = "getter";
      break;

    case 4:
      kindStr = "setter";
      break;

    default:
      kindStr = "field";
  }

  var metadataKind,
      metadataName,
      ctx = {
    kind: kindStr,
    name: isPrivate ? "#" + name : name,
    isStatic: isStatic,
    isPrivate: isPrivate
  };

  if (0 !== kind && (ctx.addInitializer = createAddInitializerMethod(initializers)), isPrivate) {
    metadataKind = 2, metadataName = _Symbol(name);
    var access = {};
    0 === kind ? (access.get = desc.get, access.set = desc.set) : 2 === kind ? access.get = function () {
      return desc.value;
    } : (1 !== kind && 3 !== kind || (access.get = function () {
      return desc.get.call(this);
    }), 1 !== kind && 4 !== kind || (access.set = function (v) {
      desc.set.call(this, v);
    })), ctx.access = access;
  } else metadataKind = 1, metadataName = name;

  return _Object$assign(ctx, createMetadataMethodsForProperty(metadataMap, metadataKind, metadataName));
}

function assertValidInitializer(initializer) {
  if ("function" != typeof initializer) throw new Error("initializers must be functions");
}

function assertValidReturnValue(kind, value) {
  var type = _typeof(value);

  if (1 === kind) {
    if ("object" !== type || null === value) throw new Error("accessor decorators must return an object with get, set, or initializer properties or void 0");
  } else if ("function" !== type) throw 0 === kind ? new Error("field decorators must return a initializer function or void 0") : new Error("method decorators must return a function or void 0");
}

function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, metadataMap, initializers) {
  var desc,
      initializer,
      value,
      decs = decInfo[0];
  isPrivate ? desc = 0 === kind || 1 === kind ? {
    get: decInfo[3],
    set: decInfo[4]
  } : 3 === kind ? {
    get: decInfo[3]
  } : 4 === kind ? {
    set: decInfo[3]
  } : {
    value: decInfo[3]
  } : 0 !== kind && (desc = _Object$getOwnPropertyDescriptor(base, name)), 1 === kind ? value = {
    get: desc.get,
    set: desc.set
  } : 2 === kind ? value = desc.value : 3 === kind ? value = desc.get : 4 === kind && (value = desc.set);
  var newValue,
      get,
      set,
      ctx = memberDecCtx(base, name, desc, metadataMap, initializers, kind, isStatic, isPrivate);
  if ("function" == typeof decs) void 0 !== (newValue = decs(value, ctx)) && (assertValidReturnValue(kind, newValue), 0 === kind ? initializer = newValue : 1 === kind ? (initializer = newValue.initializer, get = newValue.get || value.get, set = newValue.set || value.set, value = {
    get: get,
    set: set
  }) : value = newValue);else for (var i = decs.length - 1; i >= 0; i--) {
    var newInit;
    if (void 0 !== (newValue = (0, decs[i])(value, ctx))) assertValidReturnValue(kind, newValue), 0 === kind ? newInit = newValue : 1 === kind ? (newInit = newValue.initializer, get = newValue.get || value.get, set = newValue.set || value.set, value = {
      get: get,
      set: set
    }) : value = newValue, void 0 !== newInit && (void 0 === initializer ? initializer = newInit : "function" == typeof initializer ? initializer = [initializer, newInit] : initializer.push(newInit));
  }

  if (0 === kind || 1 === kind) {
    if (void 0 === initializer) initializer = function initializer(instance, init) {
      return init;
    };else if ("function" != typeof initializer) {
      var ownInitializers = initializer;

      initializer = function initializer(instance, init) {
        for (var value = init, i = 0; i < ownInitializers.length; i++) {
          value = ownInitializers[i].call(instance, value);
        }

        return value;
      };
    } else {
      var originalInitializer = initializer;

      initializer = function initializer(instance, init) {
        return originalInitializer.call(instance, init);
      };
    }
    ret.push(initializer);
  }

  0 !== kind && (1 === kind ? (desc.get = value.get, desc.set = value.set) : 2 === kind ? desc.value = value : 3 === kind ? desc.get = value : 4 === kind && (desc.set = value), isPrivate ? 1 === kind ? (ret.push(function (instance, args) {
    return value.get.call(instance, args);
  }), ret.push(function (instance, args) {
    return value.set.call(instance, args);
  })) : 2 === kind ? ret.push(value) : ret.push(function (instance, args) {
    return value.call(instance, args);
  }) : _Object$defineProperty(base, name, desc));
}

function applyMemberDecs(ret, Class, protoMetadataMap, staticMetadataMap, decInfos) {
  for (var protoInitializers = [], staticInitializers = [], existingProtoNonFields = new _Map(), existingStaticNonFields = new _Map(), i = 0; i < decInfos.length; i++) {
    var decInfo = decInfos[i];

    if (_Array$isArray(decInfo)) {
      var base,
          metadataMap,
          initializers,
          kind = decInfo[1],
          name = decInfo[2],
          isPrivate = decInfo.length > 3,
          isStatic = kind >= 5;

      if (isStatic ? (base = Class, metadataMap = staticMetadataMap, kind -= 5, initializers = staticInitializers) : (base = Class.prototype, metadataMap = protoMetadataMap, initializers = protoInitializers), 0 !== kind && !isPrivate) {
        var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields,
            existingKind = existingNonFields.get(name) || 0;
        if (!0 === existingKind || 3 === existingKind && 4 !== kind || 4 === existingKind && 3 !== kind) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
        !existingKind && kind > 2 ? existingNonFields.set(name, kind) : existingNonFields.set(name, !0);
      }

      applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, metadataMap, initializers);
    }
  }

  protoInitializers.length > 0 && pushInitializers(ret, protoInitializers), staticInitializers.length > 0 && pushInitializers(ret, staticInitializers);
}

function pushInitializers(ret, initializers) {
  initializers.length > 0 ? (initializers = _sliceInstanceProperty(initializers).call(initializers), ret.push(function (instance) {
    for (var i = 0; i < initializers.length; i++) {
      initializers[i].call(instance, instance);
    }

    return instance;
  })) : ret.push(function (instance) {
    return instance;
  });
}

function applyClassDecs(ret, targetClass, metadataMap, classDecs) {
  for (var initializers = [], newClass = targetClass, name = targetClass.name, ctx = _Object$assign({
    kind: "class",
    name: name,
    addInitializer: createAddInitializerMethod(initializers)
  }, createMetadataMethodsForProperty(metadataMap, 0, name)), i = classDecs.length - 1; i >= 0; i--) {
    newClass = classDecs[i](newClass, ctx) || newClass;
  }

  ret.push(newClass), initializers.length > 0 ? ret.push(function () {
    for (var i = 0; i < initializers.length; i++) {
      initializers[i].call(newClass, newClass);
    }
  }) : ret.push(function () {});
}

export default function applyDecs(targetClass, memberDecs, classDecs) {
  var ret = [],
      staticMetadataMap = {};

  if (memberDecs) {
    var protoMetadataMap = {};
    applyMemberDecs(ret, targetClass, protoMetadataMap, staticMetadataMap, memberDecs), convertMetadataMapToFinal(targetClass.prototype, protoMetadataMap);
  }

  return classDecs && applyClassDecs(ret, targetClass, staticMetadataMap, classDecs), convertMetadataMapToFinal(targetClass, staticMetadataMap), ret;
}