import { cache, context, db as dbUtils, logging } from "@budibase/backend-core"
import { BBRequest } from "@budibase/types"
import dayjs from "dayjs"

const { DocWritethrough } = cache.docWritethrough

function getLogDocId() {
  return `${dbUtils.DocumentType.SCIM_LOG}${dbUtils.SEPARATOR}${dayjs().format(
    "YYYYMMDD"
  )}`
}

const getDB = () => {
  const dbName = context.getScimDBName()

  return new DocWritethrough(dbUtils.getDB(dbName), getLogDocId())
}

export async function logRequest(request: BBRequest<any>) {
  logging.logWarn("SCIM request log", request)
  const logId = Date.now().toString()
  const writethrough = getDB()
  await writethrough.patch({
    [`${logId}_request`]: {
      ts: new Date().toISOString(),
      ...request,
    },
  })
  return logId
}

export async function logResponse(logId: string, response: any) {
  // log to console for now
  logging.logWarn(`SCIM response`, response)
  const writethrough = getDB()
  await writethrough.patch({
    [`${logId}_response`]: {
      ts: new Date().toISOString(),
      ...response,
    },
  })
}
