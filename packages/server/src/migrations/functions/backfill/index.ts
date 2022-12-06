export * as app from "./app"
export * as global from "./global"
export * as installation from "./installation"

// historical events are free in posthog - make sure we default to a
// historical time if no other can be found
export const DEFAULT_TIMESTAMP = new Date(2022, 0, 1).getTime()
