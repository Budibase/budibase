// const CouchDB = require("../../../db")
// const { generateQueryID } = require("../../db/utils")
// const viewTemplate = require("./viewBuilder")

// exports.save = async ctx => {
//   const db = new CouchDB(ctx.user.appId)
//   const { datasourceId, query } = ctx.request.body

//   const datasource = await db.get(datasourceId)

//   const queryId = generateQueryID()

//   datasource.queries[queryId] = query

//   const response = await db.put(datasource)

//   ctx.body = query
//   ctx.message = `View ${viewToSave.name} saved successfully.`
// }

// exports.destroy = async ctx => {
//   const db = new CouchDB(ctx.user.appId)
//   const designDoc = await db.get("_design/database")

//   const viewName = decodeURI(ctx.params.viewName)

//   const view = designDoc.views[viewName]

//   delete designDoc.views[viewName]

//   await db.put(designDoc)

//   const table = await db.get(view.meta.tableId)
//   delete table.views[viewName]
//   await db.put(table)

//   ctx.body = view
//   ctx.message = `View ${ctx.params.viewName} saved successfully.`
// }
