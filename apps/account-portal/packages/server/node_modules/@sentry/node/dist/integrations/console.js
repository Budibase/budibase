Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@sentry/core");
var utils_1 = require("@sentry/utils");
var util = require("util");
/** Console module integration */
var Console = /** @class */ (function () {
    function Console() {
        /**
         * @inheritDoc
         */
        this.name = Console.id;
    }
    /**
     * @inheritDoc
     */
    Console.prototype.setupOnce = function () {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(['debug', 'info', 'warn', 'error', 'log']), _c = _b.next(); !_c.done; _c = _b.next()) {
                var level = _c.value;
                utils_1.fill(console, level, createConsoleWrapper(level));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * @inheritDoc
     */
    Console.id = 'Console';
    return Console;
}());
exports.Console = Console;
/**
 * Wrapper function that'll be used for every console level
 */
function createConsoleWrapper(level) {
    return function consoleWrapper(originalConsoleMethod) {
        var sentryLevel = utils_1.severityFromString(level);
        /* eslint-disable prefer-rest-params */
        return function () {
            if (core_1.getCurrentHub().getIntegration(Console)) {
                core_1.getCurrentHub().addBreadcrumb({
                    category: 'console',
                    level: sentryLevel,
                    message: util.format.apply(undefined, arguments),
                }, {
                    input: tslib_1.__spread(arguments),
                    level: level,
                });
            }
            originalConsoleMethod.apply(this, arguments);
        };
        /* eslint-enable prefer-rest-params */
    };
}
//# sourceMappingURL=console.js.map