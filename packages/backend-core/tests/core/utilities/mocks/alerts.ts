import { vi } from "vitest"
vi.mock("../../../../src/logging/alerts")
import * as _alerts from "../../../../src/logging/alerts"

export const alerts = vi.mocked(_alerts) as typeof _alerts
