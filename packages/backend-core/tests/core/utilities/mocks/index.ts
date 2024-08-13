jest.mock("../../../../src/accounts")
import * as _accounts from "../../../../src/accounts"

export const accounts = jest.mocked(_accounts)

export * as date from "./date"
export * as licenses from "./licenses"
export * from "./alerts"
import "./events"
