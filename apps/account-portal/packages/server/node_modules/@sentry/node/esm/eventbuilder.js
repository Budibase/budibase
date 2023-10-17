import { __assign } from "tslib";
import { getCurrentHub } from '@sentry/hub';
import { Severity } from '@sentry/types';
import { addExceptionMechanism, addExceptionTypeValue, createStackParser, extractExceptionKeysForMessage, isError, isPlainObject, normalizeToSize, } from '@sentry/utils';
import { nodeStackParser } from './stack-parser';
/**
 * Extracts stack frames from the error.stack string
 */
export function parseStackFrames(error) {
    return createStackParser(nodeStackParser)(error.stack || '', 1);
}
/**
 * Extracts stack frames from the error and builds a Sentry Exception
 */
export function exceptionFromError(error) {
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
/**
 * Builds and Event from a Exception
 * @hidden
 */
export function eventFromUnknownInput(exception, hint) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var ex = exception;
    var providedMechanism = hint && hint.data && hint.data.mechanism;
    var mechanism = providedMechanism || {
        handled: true,
        type: 'generic',
    };
    if (!isError(exception)) {
        if (isPlainObject(exception)) {
            // This will allow us to group events based on top-level keys
            // which is much better than creating new group when any key/value change
            var message = "Non-Error exception captured with keys: " + extractExceptionKeysForMessage(exception);
            getCurrentHub().configureScope(function (scope) {
                scope.setExtra('__serialized__', normalizeToSize(exception));
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
    addExceptionTypeValue(event, undefined, undefined);
    addExceptionMechanism(event, mechanism);
    return __assign(__assign({}, event), { event_id: hint && hint.event_id });
}
/**
 * Builds and Event from a Message
 * @hidden
 */
export function eventFromMessage(message, level, hint, attachStacktrace) {
    if (level === void 0) { level = Severity.Info; }
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
//# sourceMappingURL=eventbuilder.js.map