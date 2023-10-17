import { Event, EventHint, Exception, Severity, StackFrame } from '@sentry/types';
/**
 * Extracts stack frames from the error.stack string
 */
export declare function parseStackFrames(error: Error): StackFrame[];
/**
 * Extracts stack frames from the error and builds a Sentry Exception
 */
export declare function exceptionFromError(error: Error): Exception;
/**
 * Builds and Event from a Exception
 * @hidden
 */
export declare function eventFromUnknownInput(exception: unknown, hint?: EventHint): Event;
/**
 * Builds and Event from a Message
 * @hidden
 */
export declare function eventFromMessage(message: string, level?: Severity, hint?: EventHint, attachStacktrace?: boolean): Event;
//# sourceMappingURL=eventbuilder.d.ts.map