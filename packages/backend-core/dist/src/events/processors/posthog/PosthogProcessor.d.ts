import PostHog from "posthog-node";
import { Event, Identity, Group, BaseEvent } from "@budibase/types";
import { EventProcessor } from "../types";
export default class PosthogProcessor implements EventProcessor {
    posthog: PostHog;
    constructor(token: string | undefined);
    processEvent(event: Event, identity: Identity, properties: BaseEvent, timestamp?: string | number): Promise<void>;
    identify(identity: Identity, timestamp?: string | number): Promise<void>;
    identifyGroup(group: Group, timestamp?: string | number): Promise<void>;
    shutdown(): void;
}
