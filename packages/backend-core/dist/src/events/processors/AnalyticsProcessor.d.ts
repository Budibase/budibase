import { Event, Identity, Group } from "@budibase/types";
import { EventProcessor } from "./types";
import PosthogProcessor from "./posthog";
export default class AnalyticsProcessor implements EventProcessor {
    posthog: PosthogProcessor | undefined;
    constructor();
    processEvent(event: Event, identity: Identity, properties: any, timestamp?: string | number): Promise<void>;
    identify(identity: Identity, timestamp?: string | number): Promise<void>;
    identifyGroup(group: Group, timestamp?: string | number): Promise<void>;
    shutdown(): void;
}
