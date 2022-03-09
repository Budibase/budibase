"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = NextPageDisallowReExportAllExports;
function NextPageDisallowReExportAllExports() {
    return {
        visitor: {
            ExportAllDeclaration (path) {
                var ref, ref1;
                const err = new SyntaxError(`Using \`export * from '...'\` in a page is disallowed. Please use \`export { default } from '...'\` instead.\n` + `Read more: https://nextjs.org/docs/messages/export-all-in-page`);
                err.code = 'BABEL_PARSE_ERROR';
                var ref2, ref3;
                err.loc = (ref3 = (ref2 = (ref = path.node.loc) === null || ref === void 0 ? void 0 : ref.start) !== null && ref2 !== void 0 ? ref2 : (ref1 = path.node.loc) === null || ref1 === void 0 ? void 0 : ref1.end) !== null && ref3 !== void 0 ? ref3 : path.node.loc;
                throw err;
            }
        }
    };
}

//# sourceMappingURL=next-page-disallow-re-export-all-exports.js.map