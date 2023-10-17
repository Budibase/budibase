import { Event, EventProcessor, Integration, StackFrame } from '@sentry/types';
/**
 * Resets the file cache. Exists for testing purposes.
 * @hidden
 */
export declare function resetFileContentCache(): void;
interface ContextLinesOptions {
    /**
     * Sets the number of context lines for each frame when loading a file.
     * Defaults to 7.
     *
     * Set to 0 to disable loading and inclusion of source files.
     **/
    frameContextLines?: number;
}
/** Add node modules / packages to the event */
export declare class ContextLines implements Integration {
    private readonly _options;
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    constructor(_options?: ContextLinesOptions);
    /** Get's the number of context lines to add */
    private get _contextLines();
    /**
     * @inheritDoc
     */
    setupOnce(addGlobalEventProcessor: (callback: EventProcessor) => void): void;
    /** Processes an event and adds context lines */
    addSourceContext(event: Event): Promise<Event>;
    /** Adds context lines to frames */
    addSourceContextToFrames(frames: StackFrame[]): Promise<void>;
}
export {};
//# sourceMappingURL=contextlines.d.ts.map