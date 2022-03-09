"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _webpack = require("next/dist/compiled/webpack/webpack");
var _fontUtils = require("../../../server/font-utils");
var _postcss = _interopRequireDefault(require("postcss"));
var _cssnanoSimple = _interopRequireDefault(require("next/dist/compiled/cssnano-simple"));
var _constants = require("../../../shared/lib/constants");
var Log = _interopRequireWildcard(require("../../output/log"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
function minifyCss(css) {
    return (0, _postcss).default([
        (0, _cssnanoSimple).default({
            excludeAll: true,
            discardComments: true,
            normalizeWhitespace: {
                exclude: false
            }
        }, _postcss.default), 
    ]).process(css, {
        from: undefined
    }).then((res)=>res.css
    );
}
class FontStylesheetGatheringPlugin {
    constructor({ isLikeServerless  }){
        this.gatheredStylesheets = [];
        this.manifestContent = [];
        this.parserHandler = (factory)=>{
            const JS_TYPES = [
                'auto',
                'esm',
                'dynamic'
            ];
            // Do an extra walk per module and add interested visitors to the walk.
            for (const type of JS_TYPES){
                factory.hooks.parser.for('javascript/' + type).tap(this.constructor.name, (parser)=>{
                    /**
           * Webpack fun facts:
           * `parser.hooks.call.for` cannot catch calls for user defined identifiers like `__jsx`
           * it can only detect calls for native objects like `window`, `this`, `eval` etc.
           * In order to be able to catch calls of variables like `__jsx`, first we need to catch them as
           * Identifier and then return `BasicEvaluatedExpression` whose `id` and `type` webpack matches to
           * invoke hook for call.
           * See: https://github.com/webpack/webpack/blob/webpack-4/lib/Parser.js#L1931-L1932.
           */ parser.hooks.evaluate.for('Identifier').tap(this.constructor.name, (node)=>{
                        var ref, ref1;
                        // We will only optimize fonts from first party code.
                        if (parser === null || parser === void 0 ? void 0 : (ref = parser.state) === null || ref === void 0 ? void 0 : (ref1 = ref.module) === null || ref1 === void 0 ? void 0 : ref1.resource.includes('node_modules')) {
                            return;
                        }
                        let result;
                        if (node.name === '_jsx' || node.name === '__jsx') {
                            result = new _webpack.BasicEvaluatedExpression();
                            // @ts-ignore
                            result.setRange(node.range);
                            result.setExpression(node);
                            result.setIdentifier(node.name);
                            // This was added in webpack 5.
                            result.getMembers = ()=>[]
                            ;
                        }
                        return result;
                    });
                    const jsxNodeHandler = (node)=>{
                        var ref, ref6;
                        if (node.arguments.length !== 2) {
                            // A font link tag has only two arguments rel=stylesheet and href='...'
                            return;
                        }
                        if (!isNodeCreatingLinkElement(node)) {
                            return;
                        }
                        // node.arguments[0] is the name of the tag and [1] are the props.
                        const arg1 = node.arguments[1];
                        const propsNode = arg1.type === 'ObjectExpression' ? arg1 : undefined;
                        const props = {
                        };
                        if (propsNode) {
                            propsNode.properties.forEach((prop)=>{
                                if (prop.type !== 'Property') {
                                    return;
                                }
                                if (prop.key.type === 'Identifier' && prop.value.type === 'Literal') {
                                    props[prop.key.name] = prop.value.value;
                                }
                            });
                        }
                        if (!props.rel || props.rel !== 'stylesheet' || !props.href || !_constants.OPTIMIZED_FONT_PROVIDERS.some(({ url  })=>props.href.startsWith(url)
                        )) {
                            return false;
                        }
                        this.gatheredStylesheets.push(props.href);
                        const buildInfo = parser === null || parser === void 0 ? void 0 : (ref = parser.state) === null || ref === void 0 ? void 0 : (ref6 = ref.module) === null || ref6 === void 0 ? void 0 : ref6.buildInfo;
                        if (buildInfo) {
                            buildInfo.valueDependencies.set(_constants.FONT_MANIFEST, this.gatheredStylesheets);
                        }
                    };
                    // React JSX transform:
                    parser.hooks.call.for('_jsx').tap(this.constructor.name, jsxNodeHandler);
                    // Next.js JSX transform:
                    parser.hooks.call.for('__jsx').tap(this.constructor.name, jsxNodeHandler);
                    // New React JSX transform:
                    parser.hooks.call.for('imported var').tap(this.constructor.name, jsxNodeHandler);
                });
            }
        };
        this.isLikeServerless = isLikeServerless;
    }
    apply(compiler) {
        this.compiler = compiler;
        compiler.hooks.normalModuleFactory.tap(this.constructor.name, this.parserHandler);
        compiler.hooks.make.tapAsync(this.constructor.name, (compilation, cb)=>{
            if (this.isLikeServerless) {
                /**
         * Inline font manifest for serverless case only.
         * For target: server drive the manifest through physical file and less of webpack magic.
         */ const mainTemplate = compilation.mainTemplate;
                mainTemplate.hooks.requireExtensions.tap(this.constructor.name, (source)=>{
                    return `${source}
                // Font manifest declaration
                __webpack_require__.__NEXT_FONT_MANIFEST__ = ${JSON.stringify(this.manifestContent)};
            // Enable feature:
            process.env.__NEXT_OPTIMIZE_FONTS = JSON.stringify(true);`;
                });
            }
            compilation.hooks.finishModules.tapAsync(this.constructor.name, async (modules, modulesFinished)=>{
                let fontStylesheets = this.gatheredStylesheets;
                const fontUrls = new Set();
                modules.forEach((module)=>{
                    var ref, ref1;
                    const fontDependencies = module === null || module === void 0 ? void 0 : (ref = module.buildInfo) === null || ref === void 0 ? void 0 : (ref1 = ref.valueDependencies) === null || ref1 === void 0 ? void 0 : ref1.get(_constants.FONT_MANIFEST);
                    if (fontDependencies) {
                        fontDependencies.forEach((v)=>fontUrls.add(v)
                        );
                    }
                });
                fontStylesheets = Array.from(fontUrls);
                const fontDefinitionPromises = fontStylesheets.map((url)=>(0, _fontUtils).getFontDefinitionFromNetwork(url)
                );
                this.manifestContent = [];
                for(let promiseIndex in fontDefinitionPromises){
                    const css = await fontDefinitionPromises[promiseIndex];
                    if (css) {
                        try {
                            const content = await minifyCss(css);
                            this.manifestContent.push({
                                url: fontStylesheets[promiseIndex],
                                content
                            });
                        } catch (err) {
                            Log.warn(`Failed to minify the stylesheet for ${fontStylesheets[promiseIndex]}. Skipped optimizing this font.`);
                            console.error(err);
                        }
                    }
                }
                compilation.assets[_constants.FONT_MANIFEST] = new _webpack.sources.RawSource(JSON.stringify(this.manifestContent, null, '  '));
                modulesFinished();
            });
            cb();
        });
        compiler.hooks.make.tap(this.constructor.name, (compilation)=>{
            // @ts-ignore TODO: Remove ignore when webpack 5 is stable
            compilation.hooks.processAssets.tap({
                name: this.constructor.name,
                // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                stage: _webpack.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, (assets)=>{
                assets['../' + _constants.FONT_MANIFEST] = new _webpack.sources.RawSource(JSON.stringify(this.manifestContent, null, '  '));
            });
        });
    }
}
exports.FontStylesheetGatheringPlugin = FontStylesheetGatheringPlugin;
function isNodeCreatingLinkElement(node) {
    const callee = node.callee;
    if (callee.type !== 'Identifier') {
        return false;
    }
    const componentNode = node.arguments[0];
    if (componentNode.type !== 'Literal') {
        return false;
    }
    // React has pragma: _jsx.
    // Next has pragma: __jsx.
    return (callee.name === '_jsx' || callee.name === '__jsx') && componentNode.value === 'link';
}

//# sourceMappingURL=font-stylesheet-gathering-plugin.js.map