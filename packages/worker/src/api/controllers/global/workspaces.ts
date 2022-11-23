import { tenancy, db as dbCore } from "@budibase/backend-core"
import { BBContext } from "@budibase/types"

export async function save(ctx: BBContext) {
  const db = tenancy.getGlobalDB()
  const workspaceDoc = ctx.request.body

  // workspace does not exist yet
  if (!workspaceDoc._id) {
    workspaceDoc._id = dbCore.generateWorkspaceID()
  }

  try {
    const response = await db.put(workspaceDoc)
    ctx.body = {
      _id: response.id,
      _rev: response.rev,
    }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export async function fetch(ctx: BBContext) {
  const db = tenancy.getGlobalDB()
  const response = await db.allDocs(
    dbCore.getWorkspaceParams(undefined, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map(row => row.doc)
}

export async function find(ctx: BBContext) {
  const db = tenancy.getGlobalDB()
  try {
    ctx.body = await db.get(ctx.params.id)
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}

export async function destroy(ctx: BBContext) {
  const db = tenancy.getGlobalDB()
  const { id, rev } = ctx.params

  try {
    await db.remove(id, rev)
    ctx.body = { message: "Workspace deleted successfully" }
  } catch (err: any) {
    ctx.throw(err.status, err)
  }
}
