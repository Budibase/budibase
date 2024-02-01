import { vi } from "vitest"
vi.mock("../../../../src/accounts")
import * as _accounts from "../../../../src/accounts"

export const accounts = vi.mocked(_accounts) as typeof _accounts

export * as date from "./date"
export * as licenses from "./licenses"
export { default as fetch } from "./fetch"
export * from "./alerts"
import "./events"
import "./posthog"
