import { db as dbCore, tenancy } from "@budibase/backend-core"
import {
  Document,
  UserCtx,
  ApiKeyDoc,
  ApiKeyFetchResponse,
  UpdateApiKeyRequest,
  UpdateApiKeyResponse,
} from "@budibase/types"

const KEYS_DOC = dbCore.StaticDatabases.GLOBAL.docs.apiKeys

async function getBuilderMainDoc() {
  const db = tenancy.getGlobalDB()
  const doc = await db.tryGet<ApiKeyDoc>(KEYS_DOC)
  if (!doc) {
    return {
      _id: KEYS_DOC,
      apiKeys: {},
    }
  }
  return doc
}

async function setBuilderMainDoc(doc: Document) {
  // make sure to override the ID
  doc._id = KEYS_DOC
  const db = tenancy.getGlobalDB()
  return db.put(doc)
}

export async function fetch(ctx: UserCtx<void, ApiKeyFetchResponse>) {
  try {
    const mainDoc = await getBuilderMainDoc()
    ctx.body = mainDoc.apiKeys ? mainDoc.apiKeys : {}
  } catch (err: any) {
    /* istanbul ignore next */
    ctx.throw(400, err)
  }
}

export async function update(
  ctx: UserCtx<UpdateApiKeyRequest, UpdateApiKeyResponse>
) {
  const key = ctx.params.key
  const value = ctx.request.body.value

  try {
    const mainDoc = await getBuilderMainDoc()
    if (mainDoc.apiKeys == null) {
      mainDoc.apiKeys = {}
    }
    mainDoc.apiKeys[key] = value
    const resp = await setBuilderMainDoc(mainDoc)
    ctx.body = {
      _id: resp.id,
      _rev: resp.rev,
    }
  } catch (err: any) {
    /* istanbul ignore next */
    ctx.throw(400, err)
  }
}
