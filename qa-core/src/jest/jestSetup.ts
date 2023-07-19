import { logging } from "@budibase/backend-core"
logging.LOG_CONTEXT = false

jest.retryTimes(2)
jest.setTimeout(60000)
