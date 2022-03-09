"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = run;
var _context = require("./context");
async function run(params) {
    const { runInContext , context  } = (0, _context).getModuleContext({
        module: params.name,
        onWarning: params.onWarning,
        useCache: params.useCache !== false,
        env: params.env
    });
    for (const paramPath of params.paths){
        runInContext(paramPath);
    }
    const subreq = params.request.headers[`x-middleware-subrequest`];
    const subrequests = typeof subreq === 'string' ? subreq.split(':') : [];
    if (subrequests.includes(params.name)) {
        return {
            waitUntil: Promise.resolve(),
            response: new context.Response(null, {
                headers: {
                    'x-middleware-next': '1'
                }
            })
        };
    }
    return context._ENTRIES[`middleware_${params.name}`].default({
        request: params.request
    });
}

//# sourceMappingURL=sandbox.js.map