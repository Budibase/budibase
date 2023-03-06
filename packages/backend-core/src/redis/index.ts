// Mimic the outer package export for usage in index.ts
// The outer exports can't be used as they now reference dist directly
export { default as Client } from "./redis"
export * as utils from "./utils"
export * as clients from "./init"
export * as locks from "./redlockImpl"
