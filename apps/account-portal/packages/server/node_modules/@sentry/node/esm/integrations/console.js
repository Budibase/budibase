import { __read, __spread, __values } from "tslib";
import { getCurrentHub } from '@sentry/core';
import { fill, severityFromString } from '@sentry/utils';
import * as util from 'util';
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
            for (var _b = __values(['debug', 'info', 'warn', 'error', 'log']), _c = _b.next(); !_c.done; _c = _b.next()) {
                var level = _c.value;
                fill(console, level, createConsoleWrapper(level));
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
export { Console };
/**
 * Wrapper function that'll be used for every console level
 */
function createConsoleWrapper(level) {
    return function consoleWrapper(originalConsoleMethod) {
        var sentryLevel = severityFromString(level);
        /* eslint-disable prefer-rest-params */
        return function () {
            if (getCurrentHub().getIntegration(Console)) {
                getCurrentHub().addBreadcrumb({
                    category: 'console',
                    level: sentryLevel,
                    message: util.format.apply(undefined, arguments),
                }, {
                    input: __spread(arguments),
                    level: level,
                });
            }
            originalConsoleMethod.apply(this, arguments);
        };
        /* eslint-enable prefer-rest-params */
    };
}
//# sourceMappingURL=console.js.map