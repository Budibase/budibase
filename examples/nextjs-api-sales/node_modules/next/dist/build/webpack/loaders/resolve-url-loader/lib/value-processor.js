"use strict";
var _loaderUtils2 = _interopRequireDefault(require("next/dist/compiled/loader-utils2"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function valueProcessor(filename, options) {
    const URL_STATEMENT_REGEX = /(url\s*\()\s*(?:(['"])((?:(?!\2).)*)(\2)|([^'"](?:(?!\)).)*[^'"]))\s*(\))/g;
    const directory = _path.default.dirname(filename);
    const join = options.join(filename, options);
    /**
   * Process the given CSS declaration value.
   *
   * @param {string} value A declaration value that may or may not contain a url() statement
   * @param {string|Iterator.<string>} candidate An absolute path that may be the correct base or an Iterator thereof
   */ return function transformValue(value, candidate) {
        // allow multiple url() values in the declaration
        //  split by url statements and process the content
        //  additional capture groups are needed to match quotations correctly
        //  escaped quotations are not considered
        return value.split(URL_STATEMENT_REGEX).map((token, i, arr)=>{
            // we can get groups as undefined under certain match circumstances
            const initialised = token || '';
            // the content of the url() statement is either in group 3 or group 5
            const mod = i % 7;
            if (mod === 3 || mod === 5) {
                // detect quoted url and unescape backslashes
                const before = arr[i - 1], after = arr[i + 1], isQuoted = before === after && (before === "'" || before === '"'), unescaped = isQuoted ? initialised.replace(/\\{2}/g, '\\') : initialised;
                // split into uri and query/hash and then find the absolute path to the uri
                const split = unescaped.split(/([?#])/g), uri = split[0], absolute = testIsRelative(uri) && join(uri, candidate) || testIsAbsolute(uri) && join(uri), query = options.keepQuery ? split.slice(1).join('') : '';
                // use the absolute path in absolute mode or else relative path (or default to initialised)
                // #6 - backslashes are not legal in URI
                if (!absolute) {
                    return initialised;
                } else if (options.absolute) {
                    return absolute.replace(/\\/g, '/') + query;
                } else {
                    return _loaderUtils2.default.urlToRequest(_path.default.relative(directory, absolute).replace(/\\/g, '/') + query);
                }
            } else {
                return initialised;
            }
        }).join('');
    };
    /**
   * The loaderUtils.isUrlRequest() doesn't support windows absolute paths on principle. We do not subscribe to that
   * dogma so we add path.isAbsolute() check to allow them.
   *
   * We also eliminate module relative (~) paths.
   *
   * @param {string|undefined} uri A uri string possibly empty or undefined
   * @return {boolean} True for relative uri
   */ function testIsRelative(uri) {
        return !!uri && _loaderUtils2.default.isUrlRequest(uri, false) && !_path.default.isAbsolute(uri) && uri.indexOf('~') !== 0;
    }
    /**
   * The loaderUtils.isUrlRequest() doesn't support windows absolute paths on principle. We do not subscribe to that
   * dogma so we add path.isAbsolute() check to allow them.
   *
   * @param {string|undefined} uri A uri string possibly empty or undefined
   * @return {boolean} True for absolute uri
   */ function testIsAbsolute(uri) {
        return !!uri && typeof options.root === 'string' && _loaderUtils2.default.isUrlRequest(uri, options.root) && (/^\//.test(uri) || _path.default.isAbsolute(uri));
    }
}
module.exports = valueProcessor;

//# sourceMappingURL=value-processor.js.map