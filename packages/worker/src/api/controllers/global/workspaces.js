const {
  getWorkspaceParams,
  generateWorkspaceID,
} = require("@budibase/backend-core/db")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")

exports.save = async function (ctx) {
  const db = getGlobalDB()
  const workspaceDoc = ctx.request.body

  // workspace does not exist yet
  if (!workspaceDoc._id) {
    workspaceDoc._id = generateWorkspaceID()
  }

  try {
    const response = await db.put(workspaceDoc)
    ctx.body = {
      _id: response.id,
      _rev: response.rev,
    }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.fetch = async function (ctx) {
  const db = getGlobalDB()
  const response = await db.allDocs(
    getWorkspaceParams(undefined, {
      include_docs: true,
    })
  )
  ctx.body = response.rows.map(row => row.doc)
}

exports.find = async function (ctx) {
  const db = getGlobalDB()
  try {
    ctx.body = await db.get(ctx.params.id)
  } catch (err) {
    ctx.throw(err.status, err)
  }
}

exports.destroy = async function (ctx) {
  const db = getGlobalDB()
  const { id, rev } = ctx.params

  try {
    await db.remove(id, rev)
    ctx.body = { message: "Workspace deleted successfully" }
  } catch (err) {
    ctx.throw(err.status, err)
  }
}
