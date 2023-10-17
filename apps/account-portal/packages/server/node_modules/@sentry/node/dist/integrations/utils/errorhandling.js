Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@sentry/core");
var utils_1 = require("@sentry/utils");
var flags_1 = require("../../flags");
var DEFAULT_SHUTDOWN_TIMEOUT = 2000;
/**
 * @hidden
 */
function logAndExitProcess(error) {
    // eslint-disable-next-line no-console
    console.error(error && error.stack ? error.stack : error);
    var client = core_1.getCurrentHub().getClient();
    if (client === undefined) {
        flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('No NodeClient was defined, we are exiting the process now.');
        global.process.exit(1);
    }
    var options = client.getOptions();
    var timeout = (options && options.shutdownTimeout && options.shutdownTimeout > 0 && options.shutdownTimeout) ||
        DEFAULT_SHUTDOWN_TIMEOUT;
    utils_1.forget(client.close(timeout).then(function (result) {
        if (!result) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('We reached the timeout for emptying the request buffer, still exiting now!');
        }
        global.process.exit(1);
    }));
}
exports.logAndExitProcess = logAndExitProcess;
//# sourceMappingURL=errorhandling.js.map