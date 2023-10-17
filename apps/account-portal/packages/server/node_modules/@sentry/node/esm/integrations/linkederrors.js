import { __awaiter, __generator, __read, __spread } from "tslib";
import { addGlobalEventProcessor, getCurrentHub } from '@sentry/core';
import { isInstanceOf, resolvedSyncPromise, SyncPromise } from '@sentry/utils';
import { exceptionFromError } from '../eventbuilder';
import { ContextLines } from './contextlines';
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
        addGlobalEventProcessor(function (event, hint) {
            var self = getCurrentHub().getIntegration(LinkedErrors);
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
        if (!event.exception || !event.exception.values || !hint || !isInstanceOf(hint.originalException, Error)) {
            return resolvedSyncPromise(event);
        }
        return new SyncPromise(function (resolve) {
            void _this._walkErrorTree(hint.originalException, _this._key)
                .then(function (linkedErrors) {
                if (event && event.exception && event.exception.values) {
                    event.exception.values = __spread(linkedErrors, event.exception.values);
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
        return __awaiter(this, void 0, void 0, function () {
            var exception, contextLines;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!isInstanceOf(error[key], Error) || stack.length + 1 >= this._limit) {
                            return [2 /*return*/, Promise.resolve(stack)];
                        }
                        exception = exceptionFromError(error[key]);
                        contextLines = getCurrentHub().getIntegration(ContextLines);
                        if (!(contextLines && ((_a = exception.stacktrace) === null || _a === void 0 ? void 0 : _a.frames))) return [3 /*break*/, 2];
                        return [4 /*yield*/, contextLines.addSourceContextToFrames(exception.stacktrace.frames)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                            void _this._walkErrorTree(error[key], key, __spread([exception], stack))
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
export { LinkedErrors };
//# sourceMappingURL=linkederrors.js.map