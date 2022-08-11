import { Event } from "@budibase/types";
export declare const start: (events: Event[]) => Promise<void>;
export declare const recordEvent: (event: Event, properties: any) => Promise<void>;
export declare const end: () => Promise<void>;
export declare const isBackfillingEvent: (event: Event) => Promise<boolean>;
export declare const isAlreadySent: (event: Event, properties: any) => Promise<boolean>;
