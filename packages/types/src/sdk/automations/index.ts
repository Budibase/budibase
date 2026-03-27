import {
  Automation,
  AutomationMetadata,
  Row,
  UserBindings,
} from "../../documents"

export interface QueueJobOptions {
  attempts?: number
  backoff?: number | { type?: string; delay?: number }
  delay?: number
  jobId?: string | number
  lifo?: boolean
  preventParsingData?: boolean
  priority?: number
  removeOnComplete?: boolean | number
  removeOnFail?: boolean | number
  repeat?: {
    cron?: string
    every?: number
    tz?: string
    endDate?: string | number | Date
  }
  stackTraceLimit?: number
  timeout?: number
}

export interface QueueJob<T = any> {
  id: string | number
  name?: string
  timestamp: number
  data: T
  opts: QueueJobOptions
  attemptsMade: number
  failedReason?: string
  discard: () => Promise<void>
  finished: () => Promise<any>
}

export interface AutomationDataEvent {
  appId?: string
  metadata?: AutomationMetadata
  automation?: Automation
  timeout?: number
  row?: Row
  oldRow?: Row
  user?: UserBindings
  timestamp?: number
  fields?: Record<string, any>
}

export interface AutomationData {
  event: AutomationDataEvent
  automation: Automation
}

export interface AutomationRowEvent {
  appId: string
  row: Row
  oldRow: Row
}

export type AutomationJob = QueueJob<AutomationData>
