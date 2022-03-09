"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _webpackModuleError = require("./webpackModuleError");
class WellKnownErrorsPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('WellKnownErrorsPlugin', (compilation)=>{
            compilation.hooks.afterSeal.tapPromise('WellKnownErrorsPlugin', async ()=>{
                var ref;
                if ((ref = compilation.errors) === null || ref === void 0 ? void 0 : ref.length) {
                    await Promise.all(compilation.errors.map(async (err, i)=>{
                        try {
                            const moduleError = await (0, _webpackModuleError).getModuleBuildError(compilation, err);
                            if (moduleError !== false) {
                                compilation.errors[i] = moduleError;
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }));
                }
            });
        });
    }
}
exports.WellKnownErrorsPlugin = WellKnownErrorsPlugin;

//# sourceMappingURL=index.js.map