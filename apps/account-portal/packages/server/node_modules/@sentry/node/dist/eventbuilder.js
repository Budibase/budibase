Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var hub_1 = require("@sentry/hub");
var types_1 = require("@sentry/types");
var utils_1 = require("@sentry/utils");
var stack_parser_1 = require("./stack-parser");
/**
 * Extracts stack frames from the error.stack string
 */
function parseStackFrames(error) {
    return utils_1.createStackParser(stack_parser_1.nodeStackParser)(error.stack || '', 1);
}
exports.parseStackFrames = parseStackFrames;
/**
 * Extracts stack frames from the error and builds a Sentry Exception
 */
function exceptionFromError(error) {
    var exception = {
        type: error.name || error.constructor.name,
        value: error.message,
    };
    var frames = parseStackFrames(error);
    if (frames.length) {
        exception.stacktrace = { frames: frames };
    }
    return exception;
}
exports.exceptionFromError = exceptionFromError;
/**
 * Builds and Event from a Exception
 * @hidden
 */
function eventFromUnknownInput(exception, hint) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var ex = exception;
    var providedMechanism = hint && hint.data && hint.data.mechanism;
    var mechanism = providedMechanism || {
        handled: true,
        type: 'generic',
    };
    if (!utils_1.isError(exception)) {
        if (utils_1.isPlainObject(exception)) {
            // This will allow us to group events based on top-level keys
            // which is much better than creating new group when any key/value change
            var message = "Non-Error exception captured with keys: " + utils_1.extractExceptionKeysForMessage(exception);
            hub_1.getCurrentHub().configureScope(function (scope) {
                scope.setExtra('__serialized__', utils_1.normalizeToSize(exception));
            });
            ex = (hint && hint.syntheticException) || new Error(message);
            ex.message = message;
        }
        else {
            // This handles when someone does: `throw "something awesome";`
            // We use synthesized Error here so we can extract a (rough) stack trace.
            ex = (hint && hint.syntheticException) || new Error(exception);
            ex.message = exception;
        }
        mechanism.synthetic = true;
    }
    var event = {
        exception: {
            values: [exceptionFromError(ex)],
        },
    };
    utils_1.addExceptionTypeValue(event, undefined, undefined);
    utils_1.addExceptionMechanism(event, mechanism);
    return tslib_1.__assign(tslib_1.__assign({}, event), { event_id: hint && hint.event_id });
}
exports.eventFromUnknownInput = eventFromUnknownInput;
/**
 * Builds and Event from a Message
 * @hidden
 */
function eventFromMessage(message, level, hint, attachStacktrace) {
    if (level === void 0) { level = types_1.Severity.Info; }
    var event = {
        event_id: hint && hint.event_id,
        level: level,
        message: message,
    };
    if (attachStacktrace && hint && hint.syntheticException) {
        var frames_1 = parseStackFrames(hint.syntheticException);
        if (frames_1.length) {
            event.stacktrace = { frames: frames_1 };
        }
    }
    return event;
}
exports.eventFromMessage = eventFromMessage;
//# sourceMappingURL=eventbuilder.js.map