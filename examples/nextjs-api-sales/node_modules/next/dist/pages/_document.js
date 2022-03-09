"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DocumentContext", {
    enumerable: true,
    get: function() {
        return _utils.DocumentContext;
    }
});
Object.defineProperty(exports, "DocumentInitialProps", {
    enumerable: true,
    get: function() {
        return _utils.DocumentInitialProps;
    }
});
Object.defineProperty(exports, "DocumentProps", {
    enumerable: true,
    get: function() {
        return _utils.DocumentProps;
    }
});
exports.Html = Html;
exports.Main = Main;
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _constants = require("../shared/lib/constants");
var _utils = require("../shared/lib/utils");
var _getPageFiles = require("../server/get-page-files");
var _utils1 = require("../server/utils");
var _htmlescape = require("../server/htmlescape");
var _script = _interopRequireDefault(require("../client/script"));
var _isError = _interopRequireDefault(require("../lib/is-error"));
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
function getDocumentFiles(buildManifest, pathname, inAmpMode) {
    const sharedFiles = (0, _getPageFiles).getPageFiles(buildManifest, '/_app');
    const pageFiles = inAmpMode ? [] : (0, _getPageFiles).getPageFiles(buildManifest, pathname);
    return {
        sharedFiles,
        pageFiles,
        allFiles: [
            ...new Set([
                ...sharedFiles,
                ...pageFiles
            ])
        ]
    };
}
function getPolyfillScripts(context, props) {
    // polyfills.js has to be rendered as nomodule without async
    // It also has to be the first script to load
    const { assetPrefix , buildManifest , devOnlyCacheBusterQueryString , disableOptimizedLoading , crossOrigin ,  } = context;
    return buildManifest.polyfillFiles.filter((polyfill)=>polyfill.endsWith('.js') && !polyfill.endsWith('.module.js')
    ).map((polyfill)=>/*#__PURE__*/ _react.default.createElement("script", {
            key: polyfill,
            defer: !disableOptimizedLoading,
            nonce: props.nonce,
            crossOrigin: props.crossOrigin || crossOrigin,
            noModule: true,
            src: `${assetPrefix}/_next/${polyfill}${devOnlyCacheBusterQueryString}`
        })
    );
}
function getPreNextScripts(context, props) {
    const { scriptLoader , disableOptimizedLoading , crossOrigin  } = context;
    return (scriptLoader.beforeInteractive || []).map((file, index)=>{
        const { strategy , ...scriptProps } = file;
        return(/*#__PURE__*/ _react.default.createElement("script", Object.assign({
        }, scriptProps, {
            key: scriptProps.src || index,
            defer: !disableOptimizedLoading,
            nonce: props.nonce,
            "data-nscript": "beforeInteractive",
            crossOrigin: props.crossOrigin || crossOrigin
        })));
    });
}
function getDynamicChunks(context, props, files) {
    const { dynamicImports , assetPrefix , isDevelopment , devOnlyCacheBusterQueryString , disableOptimizedLoading , crossOrigin ,  } = context;
    return dynamicImports.map((file)=>{
        if (!file.endsWith('.js') || files.allFiles.includes(file)) return null;
        return(/*#__PURE__*/ _react.default.createElement("script", {
            async: !isDevelopment && disableOptimizedLoading,
            defer: !disableOptimizedLoading,
            key: file,
            src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
            nonce: props.nonce,
            crossOrigin: props.crossOrigin || crossOrigin
        }));
    });
}
function getScripts(context, props, files) {
    var ref;
    const { assetPrefix , buildManifest , isDevelopment , devOnlyCacheBusterQueryString , disableOptimizedLoading , crossOrigin ,  } = context;
    const normalScripts = files.allFiles.filter((file)=>file.endsWith('.js')
    );
    const lowPriorityScripts = (ref = buildManifest.lowPriorityFiles) === null || ref === void 0 ? void 0 : ref.filter((file)=>file.endsWith('.js')
    );
    return [
        ...normalScripts,
        ...lowPriorityScripts
    ].map((file)=>{
        return(/*#__PURE__*/ _react.default.createElement("script", {
            key: file,
            src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
            nonce: props.nonce,
            async: !isDevelopment && disableOptimizedLoading,
            defer: !disableOptimizedLoading,
            crossOrigin: props.crossOrigin || crossOrigin
        }));
    });
}
class Document extends _react.Component {
    /**
   * `getInitialProps` hook returns the context object with the addition of `renderPage`.
   * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
   */ static getInitialProps(ctx) {
        return ctx.defaultGetInitialProps(ctx);
    }
    render() {
        return(/*#__PURE__*/ _react.default.createElement(Html, null, /*#__PURE__*/ _react.default.createElement(Head, null), /*#__PURE__*/ _react.default.createElement("body", null, /*#__PURE__*/ _react.default.createElement(Main, null), /*#__PURE__*/ _react.default.createElement(NextScript, null))));
    }
}
exports.default = Document;
function Html(props) {
    const { inAmpMode , docComponentsRendered , locale  } = (0, _react).useContext(_utils.HtmlContext);
    docComponentsRendered.Html = true;
    return(/*#__PURE__*/ _react.default.createElement("html", Object.assign({
    }, props, {
        lang: props.lang || locale || undefined,
        amp: inAmpMode ? '' : undefined,
        "data-ampdevmode": inAmpMode && process.env.NODE_ENV !== 'production' ? '' : undefined
    })));
}
function AmpStyles({ styles  }) {
    if (!styles) return null;
    // try to parse styles from fragment for backwards compat
    const curStyles = Array.isArray(styles) ? styles : [];
    if (// @ts-ignore Property 'props' does not exist on type ReactElement
    styles.props && // @ts-ignore Property 'props' does not exist on type ReactElement
    Array.isArray(styles.props.children)) {
        const hasStyles = (el)=>{
            var ref, ref1;
            return el === null || el === void 0 ? void 0 : (ref = el.props) === null || ref === void 0 ? void 0 : (ref1 = ref.dangerouslySetInnerHTML) === null || ref1 === void 0 ? void 0 : ref1.__html;
        };
        // @ts-ignore Property 'props' does not exist on type ReactElement
        styles.props.children.forEach((child)=>{
            if (Array.isArray(child)) {
                child.forEach((el)=>hasStyles(el) && curStyles.push(el)
                );
            } else if (hasStyles(child)) {
                curStyles.push(child);
            }
        });
    }
    /* Add custom styles before AMP styles to prevent accidental overrides */ return(/*#__PURE__*/ _react.default.createElement("style", {
        "amp-custom": "",
        dangerouslySetInnerHTML: {
            __html: curStyles.map((style)=>style.props.dangerouslySetInnerHTML.__html
            ).join('').replace(/\/\*# sourceMappingURL=.*\*\//g, '').replace(/\/\*@ sourceURL=.*?\*\//g, '')
        }
    }));
}
class Head extends _react.Component {
    getCssLinks(files) {
        const { assetPrefix , devOnlyCacheBusterQueryString , dynamicImports , crossOrigin , optimizeCss , optimizeFonts ,  } = this.context;
        const cssFiles = files.allFiles.filter((f)=>f.endsWith('.css')
        );
        const sharedFiles = new Set(files.sharedFiles);
        // Unmanaged files are CSS files that will be handled directly by the
        // webpack runtime (`mini-css-extract-plugin`).
        let unmangedFiles = new Set([]);
        let dynamicCssFiles = Array.from(new Set(dynamicImports.filter((file)=>file.endsWith('.css')
        )));
        if (dynamicCssFiles.length) {
            const existing = new Set(cssFiles);
            dynamicCssFiles = dynamicCssFiles.filter((f)=>!(existing.has(f) || sharedFiles.has(f))
            );
            unmangedFiles = new Set(dynamicCssFiles);
            cssFiles.push(...dynamicCssFiles);
        }
        let cssLinkElements = [];
        cssFiles.forEach((file)=>{
            const isSharedFile = sharedFiles.has(file);
            if (!optimizeCss) {
                cssLinkElements.push(/*#__PURE__*/ _react.default.createElement("link", {
                    key: `${file}-preload`,
                    nonce: this.props.nonce,
                    rel: "preload",
                    href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                    as: "style",
                    crossOrigin: this.props.crossOrigin || crossOrigin
                }));
            }
            const isUnmanagedFile = unmangedFiles.has(file);
            cssLinkElements.push(/*#__PURE__*/ _react.default.createElement("link", {
                key: file,
                nonce: this.props.nonce,
                rel: "stylesheet",
                href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                crossOrigin: this.props.crossOrigin || crossOrigin,
                "data-n-g": isUnmanagedFile ? undefined : isSharedFile ? '' : undefined,
                "data-n-p": isUnmanagedFile ? undefined : isSharedFile ? undefined : ''
            }));
        });
        if (process.env.NODE_ENV !== 'development' && optimizeFonts) {
            cssLinkElements = this.makeStylesheetInert(cssLinkElements);
        }
        return cssLinkElements.length === 0 ? null : cssLinkElements;
    }
    getPreloadDynamicChunks() {
        const { dynamicImports , assetPrefix , devOnlyCacheBusterQueryString , crossOrigin ,  } = this.context;
        return dynamicImports.map((file)=>{
            if (!file.endsWith('.js')) {
                return null;
            }
            return(/*#__PURE__*/ _react.default.createElement("link", {
                rel: "preload",
                key: file,
                href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                as: "script",
                nonce: this.props.nonce,
                crossOrigin: this.props.crossOrigin || crossOrigin
            }));
        })// Filter out nulled scripts
        .filter(Boolean);
    }
    getPreloadMainLinks(files) {
        const { assetPrefix , devOnlyCacheBusterQueryString , scriptLoader , crossOrigin ,  } = this.context;
        const preloadFiles = files.allFiles.filter((file)=>{
            return file.endsWith('.js');
        });
        return [
            ...(scriptLoader.beforeInteractive || []).map((file)=>/*#__PURE__*/ _react.default.createElement("link", {
                    key: file.src,
                    nonce: this.props.nonce,
                    rel: "preload",
                    href: file.src,
                    as: "script",
                    crossOrigin: this.props.crossOrigin || crossOrigin
                })
            ),
            ...preloadFiles.map((file)=>/*#__PURE__*/ _react.default.createElement("link", {
                    key: file,
                    nonce: this.props.nonce,
                    rel: "preload",
                    href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                    as: "script",
                    crossOrigin: this.props.crossOrigin || crossOrigin
                })
            ), 
        ];
    }
    getDynamicChunks(files) {
        return getDynamicChunks(this.context, this.props, files);
    }
    getPreNextScripts() {
        return getPreNextScripts(this.context, this.props);
    }
    getScripts(files) {
        return getScripts(this.context, this.props, files);
    }
    getPolyfillScripts() {
        return getPolyfillScripts(this.context, this.props);
    }
    handleDocumentScriptLoaderItems(children) {
        const { scriptLoader  } = this.context;
        const scriptLoaderItems = [];
        const filteredChildren = [];
        _react.default.Children.forEach(children, (child)=>{
            if (child.type === _script.default) {
                if (child.props.strategy === 'beforeInteractive') {
                    scriptLoader.beforeInteractive = (scriptLoader.beforeInteractive || []).concat([
                        {
                            ...child.props
                        }, 
                    ]);
                    return;
                } else if ([
                    'lazyOnload',
                    'afterInteractive'
                ].includes(child.props.strategy)) {
                    scriptLoaderItems.push(child.props);
                    return;
                }
            }
            filteredChildren.push(child);
        });
        this.context.__NEXT_DATA__.scriptLoader = scriptLoaderItems;
        return filteredChildren;
    }
    makeStylesheetInert(node) {
        return _react.default.Children.map(node, (c)=>{
            var ref12, ref6;
            if ((c === null || c === void 0 ? void 0 : c.type) === 'link' && (c === null || c === void 0 ? void 0 : (ref12 = c.props) === null || ref12 === void 0 ? void 0 : ref12.href) && _constants.OPTIMIZED_FONT_PROVIDERS.some(({ url  })=>{
                var ref, ref10;
                return c === null || c === void 0 ? void 0 : (ref = c.props) === null || ref === void 0 ? void 0 : (ref10 = ref.href) === null || ref10 === void 0 ? void 0 : ref10.startsWith(url);
            })) {
                const newProps = {
                    ...c.props || {
                    },
                    'data-href': c.props.href,
                    href: undefined
                };
                return(/*#__PURE__*/ _react.default.cloneElement(c, newProps));
            } else if (c === null || c === void 0 ? void 0 : (ref6 = c.props) === null || ref6 === void 0 ? void 0 : ref6.children) {
                const newProps = {
                    ...c.props || {
                    },
                    children: this.makeStylesheetInert(c.props.children)
                };
                return(/*#__PURE__*/ _react.default.cloneElement(c, newProps));
            }
            return c;
        }).filter(Boolean);
    }
    render() {
        const { styles , ampPath , inAmpMode , hybridAmp , canonicalBase , __NEXT_DATA__ , dangerousAsPath , headTags , unstable_runtimeJS , unstable_JsPreload , disableOptimizedLoading , useMaybeDeferContent , optimizeCss , optimizeFonts , runtime ,  } = this.context;
        const hasConcurrentFeatures = !!runtime;
        const disableRuntimeJS = unstable_runtimeJS === false;
        const disableJsPreload = unstable_JsPreload === false || !disableOptimizedLoading;
        this.context.docComponentsRendered.Head = true;
        let { head  } = this.context;
        let cssPreloads = [];
        let otherHeadElements = [];
        if (head) {
            head.forEach((c)=>{
                if (c && c.type === 'link' && c.props['rel'] === 'preload' && c.props['as'] === 'style') {
                    cssPreloads.push(c);
                } else {
                    c && otherHeadElements.push(c);
                }
            });
            head = cssPreloads.concat(otherHeadElements);
        }
        let children = _react.default.Children.toArray(this.props.children).filter(Boolean);
        // show a warning if Head contains <title> (only in development)
        if (process.env.NODE_ENV !== 'production') {
            children = _react.default.Children.map(children, (child)=>{
                var ref;
                const isReactHelmet = child === null || child === void 0 ? void 0 : (ref = child.props) === null || ref === void 0 ? void 0 : ref['data-react-helmet'];
                if (!isReactHelmet) {
                    var ref15;
                    if ((child === null || child === void 0 ? void 0 : child.type) === 'title') {
                        console.warn("Warning: <title> should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-title");
                    } else if ((child === null || child === void 0 ? void 0 : child.type) === 'meta' && (child === null || child === void 0 ? void 0 : (ref15 = child.props) === null || ref15 === void 0 ? void 0 : ref15.name) === 'viewport') {
                        console.warn("Warning: viewport meta tags should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-viewport-meta");
                    }
                }
                return child;
            });
            if (this.props.crossOrigin) console.warn('Warning: `Head` attribute `crossOrigin` is deprecated. https://nextjs.org/docs/messages/doc-crossorigin-deprecated');
        }
        if (process.env.NODE_ENV !== 'development' && optimizeFonts && !inAmpMode) {
            children = this.makeStylesheetInert(children);
        }
        children = this.handleDocumentScriptLoaderItems(children);
        let hasAmphtmlRel = false;
        let hasCanonicalRel = false;
        // show warning and remove conflicting amp head tags
        head = _react.default.Children.map(head || [], (child)=>{
            if (!child) return child;
            const { type , props  } = child;
            if (inAmpMode) {
                let badProp = '';
                if (type === 'meta' && props.name === 'viewport') {
                    badProp = 'name="viewport"';
                } else if (type === 'link' && props.rel === 'canonical') {
                    hasCanonicalRel = true;
                } else if (type === 'script') {
                    // only block if
                    // 1. it has a src and isn't pointing to ampproject's CDN
                    // 2. it is using dangerouslySetInnerHTML without a type or
                    // a type of text/javascript
                    if (props.src && props.src.indexOf('ampproject') < -1 || props.dangerouslySetInnerHTML && (!props.type || props.type === 'text/javascript')) {
                        badProp = '<script';
                        Object.keys(props).forEach((prop)=>{
                            badProp += ` ${prop}="${props[prop]}"`;
                        });
                        badProp += '/>';
                    }
                }
                if (badProp) {
                    console.warn(`Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://nextjs.org/docs/messages/conflicting-amp-tag`);
                    return null;
                }
            } else {
                // non-amp mode
                if (type === 'link' && props.rel === 'amphtml') {
                    hasAmphtmlRel = true;
                }
            }
            return child;
        });
        const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);
        // Must use nested component to allow use of a custom hook
        const DeferrableHead = ()=>{
            const getDynamicHeadContent = ()=>{
                return(/*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, head, /*#__PURE__*/ _react.default.createElement("meta", {
                    name: "next-head-count",
                    content: _react.default.Children.count(head || []).toString()
                })));
            };
            const getDynamicScriptPreloads = ()=>{
                return(/*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, !disableRuntimeJS && !disableJsPreload && this.getPreloadDynamicChunks(), !disableRuntimeJS && !disableJsPreload && this.getPreloadMainLinks(files)));
            };
            const getDynamicScriptContent = ()=>{
                return(/*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, !disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), !disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), !disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files)));
            };
            const [isDeferred] = useMaybeDeferContent('HEAD', ()=>{
                return(/*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, getDynamicHeadContent(), getDynamicScriptPreloads(), getDynamicScriptContent()));
            });
            var _nonce, _nonce1;
            return(/*#__PURE__*/ _react.default.createElement("head", Object.assign({
            }, this.props), !hasConcurrentFeatures && this.context.isDevelopment && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("style", {
                "data-next-hide-fouc": true,
                "data-ampdevmode": inAmpMode ? 'true' : undefined,
                dangerouslySetInnerHTML: {
                    __html: `body{display:none}`
                }
            }), /*#__PURE__*/ _react.default.createElement("noscript", {
                "data-next-hide-fouc": true,
                "data-ampdevmode": inAmpMode ? 'true' : undefined
            }, /*#__PURE__*/ _react.default.createElement("style", {
                dangerouslySetInnerHTML: {
                    __html: `body{display:block}`
                }
            }))), !isDeferred && getDynamicHeadContent(), children, optimizeFonts && /*#__PURE__*/ _react.default.createElement("meta", {
                name: "next-font-preconnect"
            }), inAmpMode && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/ _react.default.createElement("meta", {
                name: "viewport",
                content: "width=device-width,minimum-scale=1,initial-scale=1"
            }), !hasCanonicalRel && /*#__PURE__*/ _react.default.createElement("link", {
                rel: "canonical",
                href: canonicalBase + (0, _utils1).cleanAmpPath(dangerousAsPath)
            }), /*#__PURE__*/ _react.default.createElement("link", {
                rel: "preload",
                as: "script",
                href: "https://cdn.ampproject.org/v0.js"
            }), /*#__PURE__*/ _react.default.createElement(AmpStyles, {
                styles: styles
            }), /*#__PURE__*/ _react.default.createElement("style", {
                "amp-boilerplate": "",
                dangerouslySetInnerHTML: {
                    __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`
                }
            }), /*#__PURE__*/ _react.default.createElement("noscript", null, /*#__PURE__*/ _react.default.createElement("style", {
                "amp-boilerplate": "",
                dangerouslySetInnerHTML: {
                    __html: `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`
                }
            })), /*#__PURE__*/ _react.default.createElement("script", {
                async: true,
                src: "https://cdn.ampproject.org/v0.js"
            })), !inAmpMode && /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, !hasAmphtmlRel && hybridAmp && /*#__PURE__*/ _react.default.createElement("link", {
                rel: "amphtml",
                href: canonicalBase + getAmpPath(ampPath, dangerousAsPath)
            }), !optimizeCss && this.getCssLinks(files), !optimizeCss && /*#__PURE__*/ _react.default.createElement("noscript", {
                "data-n-css": (_nonce = this.props.nonce) !== null && _nonce !== void 0 ? _nonce : ''
            }), !isDeferred && getDynamicScriptPreloads(), !disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), !isDeferred && getDynamicScriptContent(), optimizeCss && this.getCssLinks(files), optimizeCss && /*#__PURE__*/ _react.default.createElement("noscript", {
                "data-n-css": (_nonce1 = this.props.nonce) !== null && _nonce1 !== void 0 ? _nonce1 : ''
            }), this.context.isDevelopment && // this element is used to mount development styles so the
            // ordering matches production
            // (by default, style-loader injects at the bottom of <head />)
            /*#__PURE__*/ _react.default.createElement("noscript", {
                id: "__next_css__DO_NOT_USE__"
            }), styles || null), /*#__PURE__*/ _react.default.createElement(_react.default.Fragment, {
            }, ...headTags || [])));
        };
        return(/*#__PURE__*/ _react.default.createElement(DeferrableHead, null));
    }
}
exports.Head = Head;
Head.contextType = _utils.HtmlContext;
function Main() {
    const { docComponentsRendered  } = (0, _react).useContext(_utils.HtmlContext);
    docComponentsRendered.Main = true;
    // @ts-ignore
    return(/*#__PURE__*/ _react.default.createElement("next-js-internal-body-render-target", null));
}
class NextScript extends _react.Component {
    getDynamicChunks(files) {
        return getDynamicChunks(this.context, this.props, files);
    }
    getPreNextScripts() {
        return getPreNextScripts(this.context, this.props);
    }
    getScripts(files) {
        return getScripts(this.context, this.props, files);
    }
    getPolyfillScripts() {
        return getPolyfillScripts(this.context, this.props);
    }
    static getInlineScriptSource(context) {
        const { __NEXT_DATA__  } = context;
        try {
            const data = JSON.stringify(__NEXT_DATA__);
            if (process.env.NODE_ENV === 'development') {
                const bytes = Buffer.from(data).byteLength;
                const prettyBytes = require('../lib/pretty-bytes').default;
                if (bytes > 128 * 1000) {
                    console.warn(`Warning: data for page "${__NEXT_DATA__.page}" is ${prettyBytes(bytes)}, this amount of data can reduce performance.\nSee more info here: https://nextjs.org/docs/messages/large-page-data`);
                }
            }
            return (0, _htmlescape).htmlEscapeJsonString(data);
        } catch (err) {
            if ((0, _isError).default(err) && err.message.indexOf('circular structure') !== -1) {
                throw new Error(`Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://nextjs.org/docs/messages/circular-structure`);
            }
            throw err;
        }
    }
    render() {
        const { assetPrefix , inAmpMode , buildManifest , unstable_runtimeJS , docComponentsRendered , devOnlyCacheBusterQueryString , disableOptimizedLoading , useMaybeDeferContent , crossOrigin ,  } = this.context;
        const disableRuntimeJS = unstable_runtimeJS === false;
        docComponentsRendered.NextScript = true;
        // Must nest component to use custom hook
        const DeferrableNextScript = ()=>{
            const [, content] = useMaybeDeferContent('NEXT_SCRIPT', ()=>{
                if (inAmpMode) {
                    const ampDevFiles = [
                        ...buildManifest.devFiles,
                        ...buildManifest.polyfillFiles,
                        ...buildManifest.ampDevFiles, 
                    ];
                    return(/*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, disableRuntimeJS ? null : /*#__PURE__*/ _react.default.createElement("script", {
                        id: "__NEXT_DATA__",
                        type: "application/json",
                        nonce: this.props.nonce,
                        crossOrigin: this.props.crossOrigin || crossOrigin,
                        dangerouslySetInnerHTML: {
                            __html: NextScript.getInlineScriptSource(this.context)
                        },
                        "data-ampdevmode": true
                    }), ampDevFiles.map((file)=>/*#__PURE__*/ _react.default.createElement("script", {
                            key: file,
                            src: `${assetPrefix}/_next/${file}${devOnlyCacheBusterQueryString}`,
                            nonce: this.props.nonce,
                            crossOrigin: this.props.crossOrigin || crossOrigin,
                            "data-ampdevmode": true
                        })
                    )));
                }
                if (process.env.NODE_ENV !== 'production') {
                    if (this.props.crossOrigin) console.warn('Warning: `NextScript` attribute `crossOrigin` is deprecated. https://nextjs.org/docs/messages/doc-crossorigin-deprecated');
                }
                const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);
                return(/*#__PURE__*/ _react.default.createElement(_react.default.Fragment, null, !disableRuntimeJS && buildManifest.devFiles ? buildManifest.devFiles.map((file)=>/*#__PURE__*/ _react.default.createElement("script", {
                        key: file,
                        src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
                        nonce: this.props.nonce,
                        crossOrigin: this.props.crossOrigin || crossOrigin
                    })
                ) : null, disableRuntimeJS ? null : /*#__PURE__*/ _react.default.createElement("script", {
                    id: "__NEXT_DATA__",
                    type: "application/json",
                    nonce: this.props.nonce,
                    crossOrigin: this.props.crossOrigin || crossOrigin,
                    dangerouslySetInnerHTML: {
                        __html: NextScript.getInlineScriptSource(this.context)
                    }
                }), disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files)));
            });
            if (inAmpMode && process.env.NODE_ENV === 'production') {
                return null;
            }
            return content;
        };
        return(/*#__PURE__*/ _react.default.createElement(DeferrableNextScript, null));
    }
}
exports.NextScript = NextScript;
NextScript.contextType = _utils.HtmlContext;
NextScript.safariNomoduleFix = '!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();';
function getAmpPath(ampPath, asPath) {
    return ampPath || `${asPath}${asPath.includes('?') ? '&' : '?'}amp=1`;
}

//# sourceMappingURL=_document.js.map