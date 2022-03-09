"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = transform;
var _traverse = _interopRequireDefault(require("next/dist/compiled/babel/traverse"));
var _generator = _interopRequireDefault(require("next/dist/compiled/babel/generator"));
var _coreLibNormalizeFile = _interopRequireDefault(require("next/dist/compiled/babel/core-lib-normalize-file"));
var _coreLibNormalizeOpts = _interopRequireDefault(require("next/dist/compiled/babel/core-lib-normalize-opts"));
var _coreLibBlockHoistPlugin = _interopRequireDefault(require("next/dist/compiled/babel/core-lib-block-hoist-plugin"));
var _coreLibPluginPass = _interopRequireDefault(require("next/dist/compiled/babel/core-lib-plugin-pass"));
var _getConfig = _interopRequireDefault(require("./get-config"));
var _util = require("./util");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getTraversalParams(file, pluginPairs) {
    const passPairs = [];
    const passes = [];
    const visitors = [];
    for (const plugin of pluginPairs.concat((0, _coreLibBlockHoistPlugin).default())){
        const pass = new _coreLibPluginPass.default(file, plugin.key, plugin.options);
        passPairs.push([
            plugin,
            pass
        ]);
        passes.push(pass);
        visitors.push(plugin.visitor);
    }
    return {
        passPairs,
        passes,
        visitors
    };
}
function invokePluginPre(file, passPairs) {
    for (const [{ pre  }, pass] of passPairs){
        if (pre) {
            pre.call(pass, file);
        }
    }
}
function invokePluginPost(file, passPairs) {
    for (const [{ post  }, pass] of passPairs){
        if (post) {
            post.call(pass, file);
        }
    }
}
function transformAstPass(file, pluginPairs, parentSpan) {
    const { passPairs , passes , visitors  } = getTraversalParams(file, pluginPairs);
    invokePluginPre(file, passPairs);
    const visitor = _traverse.default.visitors.merge(visitors, passes, // @ts-ignore - the exported types are incorrect here
    file.opts.wrapPluginVisitorMethod);
    parentSpan.traceChild('babel-turbo-traverse').traceFn(()=>(0, _traverse).default(file.ast, visitor, file.scope)
    );
    invokePluginPost(file, passPairs);
}
function transformAst(file, babelConfig, parentSpan) {
    for (const pluginPairs of babelConfig.passes){
        transformAstPass(file, pluginPairs, parentSpan);
    }
}
function transform(source, inputSourceMap, loaderOptions, filename, target, parentSpan) {
    const getConfigSpan = parentSpan.traceChild('babel-turbo-get-config');
    const babelConfig = _getConfig.default.call(this, {
        source,
        loaderOptions,
        inputSourceMap,
        target,
        filename
    });
    getConfigSpan.stop();
    const normalizeSpan = parentSpan.traceChild('babel-turbo-normalize-file');
    const file = (0, _util).consumeIterator((0, _coreLibNormalizeFile).default(babelConfig.passes, (0, _coreLibNormalizeOpts).default(babelConfig), source));
    normalizeSpan.stop();
    const transformSpan = parentSpan.traceChild('babel-turbo-transform');
    transformAst(file, babelConfig, transformSpan);
    transformSpan.stop();
    const generateSpan = parentSpan.traceChild('babel-turbo-generate');
    const { code , map  } = (0, _generator).default(file.ast, file.opts.generatorOpts, file.code);
    generateSpan.stop();
    return {
        code,
        map
    };
}

//# sourceMappingURL=transform.js.map