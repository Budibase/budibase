import { Duration } from "@budibase/backend-core"

export const AUTOMATION_SYNC_TIMEOUT = Duration.fromMinutes(2).toMs()
export const AUTOMATION_ASYNC_TIMEOUT = Duration.fromSeconds(12).toMs()
