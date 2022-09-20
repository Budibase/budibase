"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLUGIN_TYPE_ARR = exports.PluginSource = exports.PluginType = void 0;
var PluginType;
(function (PluginType) {
    PluginType["DATASOURCE"] = "datasource";
    PluginType["COMPONENT"] = "component";
})(PluginType = exports.PluginType || (exports.PluginType = {}));
var PluginSource;
(function (PluginSource) {
    PluginSource["NPM"] = "NPM";
    PluginSource["GITHUB"] = "Github";
    PluginSource["URL"] = "URL";
    PluginSource["FILE"] = "File Upload";
})(PluginSource = exports.PluginSource || (exports.PluginSource = {}));
exports.PLUGIN_TYPE_ARR = Object.values(PluginType);
//# sourceMappingURL=plugin.js.map