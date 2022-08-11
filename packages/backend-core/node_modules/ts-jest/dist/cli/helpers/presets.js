"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsWIthBabel = exports.jsWithTs = exports.defaults = exports.allPresets = void 0;
var definePreset = function (fullName) { return ({
    fullName: fullName,
    get name() {
        return this.isDefault ? 'ts-jest' : fullName;
    },
    get label() {
        return fullName.split('/').pop();
    },
    get jsVarName() {
        return this.isDefault
            ? 'defaults'
            :
                fullName
                    .split('/')
                    .pop()
                    .replace(/\-([a-z])/g, function (_, l) { return l.toUpperCase(); });
    },
    get value() {
        return require("../../../".concat(fullName.replace(/^ts-jest\//, ''), "/jest-preset"));
    },
    jsImport: function (varName) {
        if (varName === void 0) { varName = 'tsjPreset'; }
        return "const { ".concat(this.jsVarName, ": ").concat(varName, " } = require('ts-jest/presets')");
    },
    get isDefault() {
        return fullName === "ts-jest/presets/default";
    },
}); };
exports.allPresets = {};
exports.defaults = (exports.allPresets["ts-jest/presets/default"] = definePreset("ts-jest/presets/default"));
exports.jsWithTs = (exports.allPresets["ts-jest/presets/js-with-ts"] = definePreset("ts-jest/presets/js-with-ts"));
exports.jsWIthBabel = (exports.allPresets["ts-jest/presets/js-with-babel"] = definePreset("ts-jest/presets/js-with-babel"));
