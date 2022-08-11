// Type definitions for posthog-node
// Project: Posthog

declare module 'posthog-node' {
    interface Option {
        flushAt?: number
        flushInterval?: number
        host?: string
        enable?: boolean
        personalApiKey?: string
        featureFlagsPollingInterval?: number
    }
    interface IdentifyMessage {
        distinctId: string
        properties?: Record<string | number, any>
    }

    interface EventMessage extends IdentifyMessage {
        event: string
        groups?: Record<string, string | number> // Mapping of group type to group id
    }

    type GroupType = string
    type GroupKey = string

    interface GroupIdentifyMessage {
        groupType: GroupType
        groupKey: GroupKey // Unique identifier for the group
        properties?: Record<string | number, any>
    }

    export default class PostHog {
        constructor(apiKey: string, options?: Option)
        /**
         * @description Capture allows you to capture anything a user does within your system,
         * which you can later use in PostHog to find patterns in usage,
         * work out which features to improve or where people are giving up.
         * A capture call requires:
         * @param distinctId which uniquely identifies your user
         * @param event We recommend using [verb] [noun], like movie played or movie updated to easily identify what your events mean later on.
         * @param properties OPTIONAL | which can be a object with any information you'd like to add
         * @param groups OPTIONAL | object of what groups are related to this event, example: { company: 'id:5' }. Can be used to analyze companies instead of users.
         */
        capture({ distinctId, event, properties, groups }: EventMessage): void

        /**
         * @description Identify lets you add metadata on your users so you can more easily identify who they are in PostHog,
         * and even do things like segment users by these properties.
         * An identify call requires:
         * @param distinctId which uniquely identifies your user
         * @param properties with a dict with any key: value pairs
         */
        identify({ distinctId, properties }: IdentifyMessage): void

        /**
         * @description To marry up whatever a user does before they sign up or log in with what they do after you need to make an alias call.
         * This will allow you to answer questions like "Which marketing channels leads to users churning after a month?"
         * or "What do users do on our website before signing up?"
         * In a purely back-end implementation, this means whenever an anonymous user does something, you'll want to send a session ID with the capture call.
         * Then, when that users signs up, you want to do an alias call with the session ID and the newly created user ID.
         * The same concept applies for when a user logs in. If you're using PostHog in the front-end and back-end,
         *  doing the identify call in the frontend will be enough.:
         * @param distinctId the current unique id
         * @param alias the unique ID of the user before
         */
        alias(data: { distinctId: string; alias: string }): void


        /**
         * @description PostHog feature flags (https://posthog.com/docs/features/feature-flags)
         * allow you to safely deploy and roll back new features. Once you've created a feature flag in PostHog,
         * you can use this method to check if the flag is on for a given user, allowing you to create logic to turn
         * features on and off for different user groups or individual users.
         * IMPORTANT: To use this method, you need to specify `personalApiKey` in your config! More info: https://posthog.com/docs/api/overview
         * @param key the unique key of your feature flag
         * @param distinctId the current unique id
         * @param defaultResult optional - default value to be returned if the feature flag is not on for the user
         * @param groups optional - what groups are currently active (group analytics)
        */
        isFeatureEnabled(key: string, distinctId: string, defaultResult?: boolean, groups?: Record<GroupType, GroupKey>): Promise<boolean>


        /**
         * @description Sets a groups properties, which allows asking questions like "Who are the most active companies"
         * using my product in PostHog.
         *
         * @param groupType Type of group (ex: 'company'). Limited to 5 per project
         * @param groupKey Unique identifier for that type of group (ex: 'id:5')
         * @param properties OPTIONAL | which can be a object with any information you'd like to add
        */
       groupIdentify({ groupType, groupKey, properties }: GroupIdentifyMessage): void

        /**
         * @description Force an immediate reload of the polled feature flags. Please note that they are
         * already polled automatically at a regular interval.
        */
        reloadFeatureFlags(): Promise<void>

        /**
         * @description Flushes the events still in the queue and clears the feature flags poller to allow for
         * a clean shutdown.
        */
        shutdown(): void
    }

}
