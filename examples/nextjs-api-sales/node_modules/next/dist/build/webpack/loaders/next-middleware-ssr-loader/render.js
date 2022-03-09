"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRender = getRender;
var _utils = require("../../../../server/web/utils");
var _webServer = _interopRequireDefault(require("../../../../server/web-server"));
var _web = require("../../../../server/base-http/web");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const createHeaders = (args)=>({
        ...args,
        'x-middleware-ssr': '1',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
    })
;
function sendError(req, error) {
    const defaultMessage = 'An error occurred while rendering ' + req.url + '.';
    return new Response(error && error.message || defaultMessage, {
        status: 500,
        headers: createHeaders()
    });
}
// Polyfilled for `path-browserify` inside the Web Server.
process.cwd = ()=>''
;
function getRender({ dev , page , pageMod , errorMod , error500Mod , Document , App , buildManifest , reactLoadableManifest , serverComponentManifest , isServerComponent , config , buildId  }) {
    const baseLoadComponentResult = {
        dev,
        buildManifest,
        reactLoadableManifest,
        Document,
        App
    };
    const server = new _webServer.default({
        conf: config,
        minimalMode: true,
        webServerConfig: {
            extendRenderOpts: {
                buildId,
                reactRoot: true,
                runtime: 'edge',
                supportsDynamicHTML: true,
                disableOptimizedLoading: true,
                serverComponentManifest
            },
            loadComponent: async (pathname)=>{
                if (pathname === page) {
                    return {
                        ...baseLoadComponentResult,
                        Component: pageMod.default,
                        pageConfig: pageMod.config || {
                        },
                        getStaticProps: pageMod.getStaticProps,
                        getServerSideProps: pageMod.getServerSideProps,
                        getStaticPaths: pageMod.getStaticPaths,
                        ComponentMod: pageMod
                    };
                }
                // If there is a custom 500 page, we need to handle it separately.
                if (pathname === '/500' && error500Mod) {
                    return {
                        ...baseLoadComponentResult,
                        Component: error500Mod.default,
                        pageConfig: error500Mod.config || {
                        },
                        getStaticProps: error500Mod.getStaticProps,
                        getServerSideProps: error500Mod.getServerSideProps,
                        getStaticPaths: error500Mod.getStaticPaths,
                        ComponentMod: error500Mod
                    };
                }
                if (pathname === '/_error') {
                    return {
                        ...baseLoadComponentResult,
                        Component: errorMod.default,
                        pageConfig: errorMod.config || {
                        },
                        getStaticProps: errorMod.getStaticProps,
                        getServerSideProps: errorMod.getServerSideProps,
                        getStaticPaths: errorMod.getStaticPaths,
                        ComponentMod: errorMod
                    };
                }
                return null;
            }
        }
    });
    const requestHandler = server.getRequestHandler();
    return async function render(request) {
        const { nextUrl: url , cookies , headers  } = request;
        const { pathname , searchParams  } = url;
        const query = Object.fromEntries(searchParams);
        const req = {
            url: pathname,
            cookies,
            headers: (0, _utils).toNodeHeaders(headers)
        };
        // Preflight request
        if (request.method === 'HEAD') {
            return new Response(null, {
                headers: createHeaders()
            });
        }
        // @TODO: We should move this into server/render.
        if (Document.getInitialProps) {
            const err = new Error('`getInitialProps` in Document component is not supported with the Edge Runtime.');
            return sendError(req, err);
        }
        const renderServerComponentData = isServerComponent ? query.__flight__ !== undefined : false;
        const serverComponentProps = isServerComponent && query.__props__ ? JSON.parse(query.__props__) : undefined;
        // Extend the render options.
        server.updateRenderOpts({
            renderServerComponentData,
            serverComponentProps
        });
        const extendedReq = new _web.WebNextRequest(request);
        const extendedRes = new _web.WebNextResponse();
        requestHandler(extendedReq, extendedRes);
        return await extendedRes.toResponse();
    };
}

//# sourceMappingURL=render.js.map