const {
  ViewNames,
  generateMemoryViewID,
  getMemoryViewParams,
  DocumentTypes,
  SEPARATOR,
} = require("../../../db/utils")
const env = require("../../../environment")
const { getAppDB } = require("@budibase/backend-core/context")
const viewBuilder = require("./viewBuilder")

exports.getView = async viewName => {
  const db = getAppDB()
  if (env.SELF_HOSTED) {
    const designDoc = await db.get("_design/database")
    return designDoc.views[viewName]
  } else {
    // This is a table view, don't read the view from the DB
    if (viewName.startsWith(DocumentTypes.TABLE + SEPARATOR)) {
      return null
    }

    const viewDoc = await db.get(generateMemoryViewID(viewName))
    return viewDoc.view
  }
}

exports.getViews = async () => {
  const db = getAppDB()
  const response = []
  if (env.SELF_HOSTED) {
    const designDoc = await db.get("_design/database")
    for (let name of Object.keys(designDoc.views)) {
      // Only return custom views, not built ins
      if (Object.values(ViewNames).indexOf(name) !== -1) {
        continue
      }
      response.push({
        name,
        ...designDoc.views[name],
      })
    }
  } else {
    const views = (
      await db.allDocs(
        getMemoryViewParams({
          include_docs: true,
        })
      )
    ).rows.map(row => row.doc)
    for (let viewDoc of views) {
      response.push({
        name: viewDoc.name,
        ...viewDoc.view,
      })
    }
  }
  return response
}

exports.saveView = async (originalName, viewName, viewTemplate) => {
  const db = getAppDB()
  if (env.SELF_HOSTED) {
    const designDoc = await db.get("_design/database")
    designDoc.views = {
      ...designDoc.views,
      [viewName]: viewTemplate,
    }
    // view has been renamed
    if (originalName) {
      delete designDoc.views[originalName]
    }
    await db.put(designDoc)
  } else {
    const id = generateMemoryViewID(viewName)
    const originalId = originalName ? generateMemoryViewID(originalName) : null
    const viewDoc = {
      _id: id,
      view: viewTemplate,
      name: viewName,
      tableId: viewTemplate.meta.tableId,
    }
    try {
      const old = await db.get(id)
      if (originalId) {
        const originalDoc = await db.get(originalId)
        await db.remove(originalDoc._id, originalDoc._rev)
      }
      if (old && old._rev) {
        viewDoc._rev = old._rev
      }
    } catch (err) {
      // didn't exist, just skip
    }
    await db.put(viewDoc)
  }
}

exports.deleteView = async viewName => {
  const db = getAppDB()
  if (env.SELF_HOSTED) {
    const designDoc = await db.get("_design/database")
    const view = designDoc.views[viewName]
    delete designDoc.views[viewName]
    await db.put(designDoc)
    return view
  } else {
    const id = generateMemoryViewID(viewName)
    const viewDoc = await db.get(id)
    await db.remove(viewDoc._id, viewDoc._rev)
    return viewDoc.view
  }
}

exports.migrateToInMemoryView = async (db, viewName) => {
  // delete the view initially
  const designDoc = await db.get("_design/database")
  // run the view back through the view builder to update it
  const view = viewBuilder(designDoc.views[viewName].meta)
  delete designDoc.views[viewName]
  await db.put(designDoc)
  await exports.saveView(db, null, viewName, view)
}

exports.migrateToDesignView = async (db, viewName) => {
  let view = await db.get(generateMemoryViewID(viewName))
  const designDoc = await db.get("_design/database")
  designDoc.views[viewName] = viewBuilder(view.view.meta)
  await db.put(designDoc)
  await db.remove(view._id, view._rev)
}

exports.getFromDesignDoc = async (db, viewName) => {
  const designDoc = await db.get("_design/database")
  let view = designDoc.views[viewName]
  if (view == null) {
    throw { status: 404, message: "Unable to get view" }
  }
  return view
}

exports.getFromMemoryDoc = async (db, viewName) => {
  let view = await db.get(generateMemoryViewID(viewName))
  if (view) {
    view = view.view
  } else {
    throw { status: 404, message: "Unable to get view" }
  }
  return view
}
