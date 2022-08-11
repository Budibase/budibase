import { Event, Identity, Group } from "@budibase/types";
import { EventProcessor } from "./types";
export default class Processor implements EventProcessor {
    initialised: boolean;
    processors: EventProcessor[];
    constructor(processors: EventProcessor[]);
    processEvent(event: Event, identity: Identity, properties: any, timestamp?: string | number): Promise<void>;
    identify(identity: Identity, timestamp?: string | number): Promise<void>;
    identifyGroup(identity: Group, timestamp?: string | number): Promise<void>;
    shutdown(): void;
}
