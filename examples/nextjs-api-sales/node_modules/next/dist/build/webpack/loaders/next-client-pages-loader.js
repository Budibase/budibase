"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _stringifyRequest = require("../stringify-request");
// this parameter: https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters
function nextClientPagesLoader() {
    const pagesLoaderSpan = this.currentTraceSpan.traceChild('next-client-pages-loader');
    return pagesLoaderSpan.traceFn(()=>{
        const { absolutePagePath , page  } = this.getOptions();
        pagesLoaderSpan.setAttribute('absolutePagePath', absolutePagePath);
        const stringifiedPagePath = (0, _stringifyRequest).stringifyRequest(this, absolutePagePath);
        const stringifiedPage = JSON.stringify(page);
        return `
    (window.__NEXT_P = window.__NEXT_P || []).push([
      ${stringifiedPage},
      function () {
        return require(${stringifiedPagePath});
      }
    ]);
    if(module.hot) {
      module.hot.dispose(function () {
        window.__NEXT_P.push([${stringifiedPage}])
      });
    }
  `;
    });
}
var _default = nextClientPagesLoader;
exports.default = _default;

//# sourceMappingURL=next-client-pages-loader.js.map