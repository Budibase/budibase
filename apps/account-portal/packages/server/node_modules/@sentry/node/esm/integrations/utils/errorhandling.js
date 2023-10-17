import { getCurrentHub } from '@sentry/core';
import { forget, logger } from '@sentry/utils';
import { IS_DEBUG_BUILD } from '../../flags';
var DEFAULT_SHUTDOWN_TIMEOUT = 2000;
/**
 * @hidden
 */
export function logAndExitProcess(error) {
    // eslint-disable-next-line no-console
    console.error(error && error.stack ? error.stack : error);
    var client = getCurrentHub().getClient();
    if (client === undefined) {
        IS_DEBUG_BUILD && logger.warn('No NodeClient was defined, we are exiting the process now.');
        global.process.exit(1);
    }
    var options = client.getOptions();
    var timeout = (options && options.shutdownTimeout && options.shutdownTimeout > 0 && options.shutdownTimeout) ||
        DEFAULT_SHUTDOWN_TIMEOUT;
    forget(client.close(timeout).then(function (result) {
        if (!result) {
            IS_DEBUG_BUILD && logger.warn('We reached the timeout for emptying the request buffer, still exiting now!');
        }
        global.process.exit(1);
    }));
}
//# sourceMappingURL=errorhandling.js.map