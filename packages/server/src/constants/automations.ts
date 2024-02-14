import { Duration } from "@budibase/backend-core"
import env from "../environment"

const defaults = env.getDefaults()
export const AUTOMATION_SYNC_TIMEOUT = Duration.fromMinutes(2).toMs()
export const AUTOMATION_ASYNC_TIMEOUT = defaults.QUERY_THREAD_TIMEOUT
