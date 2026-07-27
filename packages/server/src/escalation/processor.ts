export type {
  CreateEscalationInput,
  CreateEscalationResult,
  EscalationSummary,
  IEscalationProcessor,
} from "./processors"
export { BullEscalationProcessor } from "./processors/bull"

import { BullEscalationProcessor } from "./processors/bull"
import type { IEscalationProcessor } from "./processors"

export const escalationProcessor: IEscalationProcessor =
  new BullEscalationProcessor()
