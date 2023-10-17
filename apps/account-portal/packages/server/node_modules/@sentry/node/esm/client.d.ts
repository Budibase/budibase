import { BaseClient, Scope } from '@sentry/core';
import { SessionFlusher } from '@sentry/hub';
import { Event, EventHint } from '@sentry/types';
import { NodeBackend } from './backend';
import { NodeOptions } from './types';
/**
 * The Sentry Node SDK Client.
 *
 * @see NodeOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
export declare class NodeClient extends BaseClient<NodeBackend, NodeOptions> {
    protected _sessionFlusher: SessionFlusher | undefined;
    /**
     * Creates a new Node SDK instance.
     * @param options Configuration options for this SDK.
     */
    constructor(options: NodeOptions);
    /**
     * @inheritDoc
     */
    captureException(exception: any, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     * @inheritDoc
     */
    captureEvent(event: Event, hint?: EventHint, scope?: Scope): string | undefined;
    /**
     *
     * @inheritdoc
     */
    close(timeout?: number): PromiseLike<boolean>;
    /** Method that initialises an instance of SessionFlusher on Client */
    initSessionFlusher(): void;
    /**
     * @inheritDoc
     */
    protected _prepareEvent(event: Event, scope?: Scope, hint?: EventHint): PromiseLike<Event | null>;
    /**
     * Method responsible for capturing/ending a request session by calling `incrementSessionStatusCount` to increment
     * appropriate session aggregates bucket
     */
    protected _captureRequestSession(): void;
}
//# sourceMappingURL=client.d.ts.map