"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.plugin = exports.unshiftLoader = exports.loader = void 0;
var _lodashCurry = _interopRequireDefault(require("next/dist/compiled/lodash.curry"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const loader = (0, _lodashCurry).default(function loader(rule, config) {
    if (!config.module) {
        config.module = {
            rules: []
        };
    }
    if (rule.oneOf) {
        const existing = config.module.rules.find((arrayRule)=>arrayRule.oneOf
        );
        if (existing) {
            existing.oneOf.push(...rule.oneOf);
            return config;
        }
    }
    config.module.rules.push(rule);
    return config;
});
exports.loader = loader;
const unshiftLoader = (0, _lodashCurry).default(function unshiftLoader(rule, config) {
    if (!config.module) {
        config.module = {
            rules: []
        };
    }
    if (rule.oneOf) {
        const existing = config.module.rules.find((arrayRule)=>arrayRule.oneOf
        );
        if (existing) {
            existing.oneOf.unshift(...rule.oneOf);
            return config;
        }
    }
    config.module.rules.unshift(rule);
    return config;
});
exports.unshiftLoader = unshiftLoader;
const plugin = (0, _lodashCurry).default(function plugin(p, config) {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.plugins.push(p);
    return config;
});
exports.plugin = plugin;

//# sourceMappingURL=helpers.js.map