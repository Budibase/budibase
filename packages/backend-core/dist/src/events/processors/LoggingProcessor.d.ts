import { Event, Identity, Group } from "@budibase/types";
import { EventProcessor } from "./types";
export default class LoggingProcessor implements EventProcessor {
    processEvent(event: Event, identity: Identity, properties: any, timestamp?: string): Promise<void>;
    identify(identity: Identity, timestamp?: string | number): Promise<void>;
    identifyGroup(group: Group, timestamp?: string | number): Promise<void>;
    shutdown(): void;
}
