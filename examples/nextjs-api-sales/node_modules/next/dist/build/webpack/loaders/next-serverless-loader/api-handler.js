"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getApiHandler = getApiHandler;
var _url = require("url");
var _http = require("http");
var _node = require("../../../../server/api-utils/node");
var _utils = require("./utils");
var _utils1 = require("../../../../shared/lib/utils");
var _node1 = require("../../../../server/base-http/node");
function getApiHandler(ctx) {
    const { pageModule , encodedPreviewProps , pageIsDynamic  } = ctx;
    const { handleRewrites , handleBasePath , dynamicRouteMatcher , normalizeDynamicRouteParams ,  } = (0, _utils).getUtils(ctx);
    return async (rawReq, rawRes)=>{
        const req = rawReq instanceof _http.IncomingMessage ? new _node1.NodeNextRequest(rawReq) : rawReq;
        const res = rawRes instanceof _http.ServerResponse ? new _node1.NodeNextResponse(rawRes) : rawRes;
        try {
            // We need to trust the dynamic route params from the proxy
            // to ensure we are using the correct values
            const trustQuery = req.headers[_utils.vercelHeader];
            const parsedUrl = handleRewrites(req, (0, _url).parse(req.url, true));
            if (parsedUrl.query.nextInternalLocale) {
                delete parsedUrl.query.nextInternalLocale;
            }
            handleBasePath(req, parsedUrl);
            let params = {
            };
            if (pageIsDynamic) {
                const result = normalizeDynamicRouteParams(trustQuery ? parsedUrl.query : dynamicRouteMatcher(parsedUrl.pathname));
                params = result.params;
            }
            await (0, _node).apiResolver(req.originalRequest, res.originalResponse, Object.assign({
            }, parsedUrl.query, params), await pageModule, encodedPreviewProps, true);
        } catch (err) {
            console.error(err);
            if (err instanceof _utils1.DecodeError) {
                res.statusCode = 400;
                res.body('Bad Request').send();
            } else {
                // Throw the error to crash the serverless function
                throw err;
            }
        }
    };
}

//# sourceMappingURL=api-handler.js.map