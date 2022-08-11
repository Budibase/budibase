import { Event } from "@budibase/types";
/**
 * Check if this event should be sent right now
 * Return false to signal the event SHOULD be sent
 * Return true to signal the event should NOT be sent
 */
export declare const limited: (event: Event) => Promise<boolean>;
