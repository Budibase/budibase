"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
class ServerlessPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('ServerlessPlugin', (compilation)=>{
            const hook = compilation.hooks.optimizeChunks;
            hook.tap('ServerlessPlugin', (chunks)=>{
                for (const chunk of chunks){
                    // If chunk is not an entry point skip them
                    // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                    if (compilation.chunkGraph.getNumberOfEntryModules(chunk) === 0) {
                        continue;
                    }
                    // Async chunks are usages of import() for example
                    const dynamicChunks = chunk.getAllAsyncChunks();
                    for (const dynamicChunk of dynamicChunks){
                        // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                        for (const module of compilation.chunkGraph.getChunkModulesIterable(dynamicChunk)){
                            // Add module back into the entry chunk
                            // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                            if (!compilation.chunkGraph.isModuleInChunk(module, chunk)) {
                                // @ts-ignore TODO: Remove ignore when webpack 5 is stable
                                compilation.chunkGraph.connectChunkAndModule(chunk, module);
                            }
                        }
                    }
                }
            });
        });
    }
}
exports.ServerlessPlugin = ServerlessPlugin;

//# sourceMappingURL=serverless-plugin.js.map