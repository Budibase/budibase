import { __awaiter, __generator, __values } from "tslib";
import { getCurrentHub } from '@sentry/core';
import { addContextToFrame } from '@sentry/utils';
import { readFile } from 'fs';
import { LRUMap } from 'lru_map';
var FILE_CONTENT_CACHE = new LRUMap(100);
var DEFAULT_LINES_OF_CONTEXT = 7;
// TODO: Replace with promisify when minimum supported node >= v8
function readTextFileAsync(path) {
    return new Promise(function (resolve, reject) {
        readFile(path, 'utf8', function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
/**
 * Resets the file cache. Exists for testing purposes.
 * @hidden
 */
export function resetFileContentCache() {
    FILE_CONTENT_CACHE.clear();
}
/** Add node modules / packages to the event */
var ContextLines = /** @class */ (function () {
    function ContextLines(_options) {
        if (_options === void 0) { _options = {}; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = ContextLines.id;
    }
    Object.defineProperty(ContextLines.prototype, "_contextLines", {
        /** Get's the number of context lines to add */
        get: function () {
            var _a, _b;
            // This is only here to copy frameContextLines from init options if it hasn't
            // been set via this integrations constructor.
            //
            // TODO: Remove on next major!
            if (this._options.frameContextLines === undefined) {
                var initOptions = (_a = getCurrentHub().getClient()) === null || _a === void 0 ? void 0 : _a.getOptions();
                // eslint-disable-next-line deprecation/deprecation
                this._options.frameContextLines = (_b = initOptions) === null || _b === void 0 ? void 0 : _b.frameContextLines;
            }
            return this._options.frameContextLines !== undefined ? this._options.frameContextLines : DEFAULT_LINES_OF_CONTEXT;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ContextLines.prototype.setupOnce = function (addGlobalEventProcessor) {
        var _this = this;
        addGlobalEventProcessor(function (event) { return _this.addSourceContext(event); });
    };
    /** Processes an event and adds context lines */
    ContextLines.prototype.addSourceContext = function (event) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, _d, exception, e_1_1;
            var e_1, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(this._contextLines > 0 && ((_a = event.exception) === null || _a === void 0 ? void 0 : _a.values))) return [3 /*break*/, 8];
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 6, 7, 8]);
                        _c = __values(event.exception.values), _d = _c.next();
                        _f.label = 2;
                    case 2:
                        if (!!_d.done) return [3 /*break*/, 5];
                        exception = _d.value;
                        if (!((_b = exception.stacktrace) === null || _b === void 0 ? void 0 : _b.frames)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.addSourceContextToFrames(exception.stacktrace.frames)];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        _d = _c.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, event];
                }
            });
        });
    };
    /** Adds context lines to frames */
    ContextLines.prototype.addSourceContextToFrames = function (frames) {
        return __awaiter(this, void 0, void 0, function () {
            var contextLines, frames_1, frames_1_1, frame, sourceFile, lines, e_2_1;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contextLines = this._contextLines;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        frames_1 = __values(frames), frames_1_1 = frames_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!frames_1_1.done) return [3 /*break*/, 5];
                        frame = frames_1_1.value;
                        if (!(frame.filename && frame.context_line === undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, _readSourceFile(frame.filename)];
                    case 3:
                        sourceFile = _b.sent();
                        if (sourceFile) {
                            try {
                                lines = sourceFile.split('\n');
                                addContextToFrame(lines, frame, contextLines);
                            }
                            catch (e) {
                                // anomaly, being defensive in case
                                // unlikely to ever happen in practice but can definitely happen in theory
                            }
                        }
                        _b.label = 4;
                    case 4:
                        frames_1_1 = frames_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (frames_1_1 && !frames_1_1.done && (_a = frames_1.return)) _a.call(frames_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @inheritDoc
     */
    ContextLines.id = 'ContextLines';
    return ContextLines;
}());
export { ContextLines };
/**
 * Reads file contents and caches them in a global LRU cache.
 *
 * @param filename filepath to read content from.
 */
function _readSourceFile(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var cachedFile, content, _1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cachedFile = FILE_CONTENT_CACHE.get(filename);
                    // We have a cache hit
                    if (cachedFile !== undefined) {
                        return [2 /*return*/, cachedFile];
                    }
                    content = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readTextFileAsync(filename)];
                case 2:
                    content = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    FILE_CONTENT_CACHE.set(filename, content);
                    return [2 /*return*/, content];
            }
        });
    });
}
//# sourceMappingURL=contextlines.js.map