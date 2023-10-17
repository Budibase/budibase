Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@sentry/core");
var utils_1 = require("@sentry/utils");
var eventbuilder_1 = require("../eventbuilder");
var contextlines_1 = require("./contextlines");
var DEFAULT_KEY = 'cause';
var DEFAULT_LIMIT = 5;
/** Adds SDK info to an event. */
var LinkedErrors = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function LinkedErrors(options) {
        if (options === void 0) { options = {}; }
        /**
         * @inheritDoc
         */
        this.name = LinkedErrors.id;
        this._key = options.key || DEFAULT_KEY;
        this._limit = options.limit || DEFAULT_LIMIT;
    }
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype.setupOnce = function () {
        core_1.addGlobalEventProcessor(function (event, hint) {
            var self = core_1.getCurrentHub().getIntegration(LinkedErrors);
            if (self) {
                var handler = self._handler && self._handler.bind(self);
                return typeof handler === 'function' ? handler(event, hint) : event;
            }
            return event;
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype._handler = function (event, hint) {
        var _this = this;
        if (!event.exception || !event.exception.values || !hint || !utils_1.isInstanceOf(hint.originalException, Error)) {
            return utils_1.resolvedSyncPromise(event);
        }
        return new utils_1.SyncPromise(function (resolve) {
            void _this._walkErrorTree(hint.originalException, _this._key)
                .then(function (linkedErrors) {
                if (event && event.exception && event.exception.values) {
                    event.exception.values = tslib_1.__spread(linkedErrors, event.exception.values);
                }
                resolve(event);
            })
                .then(null, function () {
                resolve(event);
            });
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype._walkErrorTree = function (error, key, stack) {
        if (stack === void 0) { stack = []; }
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var exception, contextLines;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!utils_1.isInstanceOf(error[key], Error) || stack.length + 1 >= this._limit) {
                            return [2 /*return*/, Promise.resolve(stack)];
                        }
                        exception = eventbuilder_1.exceptionFromError(error[key]);
                        contextLines = core_1.getCurrentHub().getIntegration(contextlines_1.ContextLines);
                        if (!(contextLines && ((_a = exception.stacktrace) === null || _a === void 0 ? void 0 : _a.frames))) return [3 /*break*/, 2];
                        return [4 /*yield*/, contextLines.addSourceContextToFrames(exception.stacktrace.frames)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                            void _this._walkErrorTree(error[key], key, tslib_1.__spread([exception], stack))
                                .then(resolve)
                                .then(null, function () {
                                reject();
                            });
                        })];
                }
            });
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.id = 'LinkedErrors';
    return LinkedErrors;
}());
exports.LinkedErrors = LinkedErrors;
//# sourceMappingURL=linkederrors.js.map