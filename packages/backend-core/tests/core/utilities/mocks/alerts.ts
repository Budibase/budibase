jest.mock("../../../../src/logging/alerts")
import * as _alerts from "../../../../src/logging/alerts"

export const alerts = jest.mocked(_alerts)
