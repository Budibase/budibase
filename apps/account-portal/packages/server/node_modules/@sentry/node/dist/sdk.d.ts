import { Integrations as CoreIntegrations } from '@sentry/core';
import { NodeClient } from './client';
import { Console, ContextLines, Http, LinkedErrors, OnUncaughtException, OnUnhandledRejection } from './integrations';
import { NodeOptions } from './types';
export declare const defaultIntegrations: (CoreIntegrations.FunctionToString | CoreIntegrations.InboundFilters | Console | Http | OnUncaughtException | OnUnhandledRejection | ContextLines | LinkedErrors)[];
/**
 * The Sentry Node SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible in the
 * main entry module. To set context information or send manual events, use the
 * provided methods.
 *
 * @example
 * ```
 *
 * const { init } = require('@sentry/node');
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { configureScope } = require('@sentry/node');
 * configureScope((scope: Scope) => {
 *   scope.setExtra({ battery: 0.7 });
 *   scope.setTag({ user_mode: 'admin' });
 *   scope.setUser({ id: '4711' });
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { addBreadcrumb } = require('@sentry/node');
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * const Sentry = require('@sentry/node');
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link NodeOptions} for documentation on configuration options.
 */
export declare function init(options?: NodeOptions): void;
/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 */
export declare function lastEventId(): string | undefined;
/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */
export declare function flush(timeout?: number): Promise<boolean>;
/**
 * Call `close()` on the current client, if there is one. See {@link Client.close}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue before shutting down. Omitting this
 * parameter will cause the client to wait until all events are sent before disabling itself.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */
export declare function close(timeout?: number): Promise<boolean>;
/**
 * Function that takes an instance of NodeClient and checks if autoSessionTracking option is enabled for that client
 */
export declare function isAutoSessionTrackingEnabled(client?: NodeClient): boolean;
/**
 * Returns a release dynamically from environment variables.
 */
export declare function getSentryRelease(fallback?: string): string | undefined;
//# sourceMappingURL=sdk.d.ts.map