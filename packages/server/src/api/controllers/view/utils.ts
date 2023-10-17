import {
  ViewName,
  generateMemoryViewID,
  getMemoryViewParams,
  DocumentType,
  SEPARATOR,
} from "../../../db/utils"
import env from "../../../environment"
import { context } from "@budibase/backend-core"
import viewBuilder from "./viewBuilder"
import { Database } from "@budibase/types"

export async function getView(viewName: string) {
  const db = context.getAppDB()
  if (env.SELF_HOSTED) {
    const designDoc = await db.get<any>("_design/database")
    return designDoc.views[viewName]
  } else {
    // This is a table view, don't read the view from the DB
    if (viewName.startsWith(DocumentType.TABLE + SEPARATOR)) {
      return null
    }

    try {
      const viewDoc = await db.get<any>(generateMemoryViewID(viewName))
      return viewDoc.view
    } catch (err: any) {
      // Return null when PouchDB doesn't found the view
      if (err.status === 404) {
        return null
      }

      throw err
    }
  }
}

export async function getViews() {
  const db = context.getAppDB()
  const response = []
  if (env.SELF_HOSTED) {
    const designDoc = await db.get<any>("_design/database")
    for (let name of Object.keys(designDoc.views)) {
      // Only return custom views, not built ins
      const viewNames = Object.values(ViewName) as string[]
      if (viewNames.indexOf(name) !== -1) {
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

export async function saveView(
  originalName: string | null,
  viewName: string,
  viewTemplate: any
) {
  const db = context.getAppDB()
  if (env.SELF_HOSTED) {
    const designDoc = await db.get<any>("_design/database")
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
    const viewDoc: any = {
      _id: id,
      view: viewTemplate,
      name: viewName,
      tableId: viewTemplate.meta.tableId,
    }
    try {
      const old = await db.get<any>(id)
      if (originalId) {
        const originalDoc = await db.get<any>(originalId)
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

export async function deleteView(viewName: string) {
  const db = context.getAppDB()
  if (env.SELF_HOSTED) {
    const designDoc = await db.get<any>("_design/database")
    const view = designDoc.views[viewName]
    delete designDoc.views[viewName]
    await db.put(designDoc)
    return view
  } else {
    const id = generateMemoryViewID(viewName)
    const viewDoc = await db.get<any>(id)
    await db.remove(viewDoc._id, viewDoc._rev)
    return viewDoc.view
  }
}

export async function migrateToInMemoryView(db: Database, viewName: string) {
  // delete the view initially
  const designDoc = await db.get<any>("_design/database")
  // run the view back through the view builder to update it
  const view = viewBuilder(designDoc.views[viewName].meta)
  delete designDoc.views[viewName]
  await db.put(designDoc)
  await exports.saveView(db, null, viewName, view)
}

export async function migrateToDesignView(db: Database, viewName: string) {
  let view = await db.get<any>(generateMemoryViewID(viewName))
  const designDoc = await db.get<any>("_design/database")
  designDoc.views[viewName] = viewBuilder(view.view.meta)
  await db.put(designDoc)
  await db.remove(view._id, view._rev)
}

export async function getFromDesignDoc(db: Database, viewName: string) {
  const designDoc = await db.get<any>("_design/database")
  let view = designDoc.views[viewName]
  if (view == null) {
    throw { status: 404, message: "Unable to get view" }
  }
  return view
}

export async function getFromMemoryDoc(db: Database, viewName: string) {
  let view = await db.get<any>(generateMemoryViewID(viewName))
  if (view) {
    view = view.view
  } else {
    throw { status: 404, message: "Unable to get view" }
  }
  return view
}
