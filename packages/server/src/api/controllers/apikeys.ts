import { db as dbCore, tenancy } from "@budibase/backend-core"
import { BBContext, Document } from "@budibase/types"

const KEYS_DOC = dbCore.StaticDatabases.GLOBAL.docs.apiKeys

async function getBuilderMainDoc() {
  const db = tenancy.getGlobalDB()
  try {
    return await db.get<any>(KEYS_DOC)
  } catch (err) {
    // doesn't exist yet, nothing to get
    return {
      _id: KEYS_DOC,
    }
  }
}

async function setBuilderMainDoc(doc: Document) {
  // make sure to override the ID
  doc._id = KEYS_DOC
  const db = tenancy.getGlobalDB()
  return db.put(doc)
}

export async function fetch(ctx: BBContext) {
  try {
    const mainDoc = await getBuilderMainDoc()
    ctx.body = mainDoc.apiKeys ? mainDoc.apiKeys : {}
  } catch (err: any) {
    /* istanbul ignore next */
    ctx.throw(400, err)
  }
}

export async function update(ctx: BBContext) {
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
