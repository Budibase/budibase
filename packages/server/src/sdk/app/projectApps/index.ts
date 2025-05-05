import { context, docIds, HTTPError, utils } from "@budibase/backend-core"
import { DocumentType, ProjectApp, SEPARATOR } from "@budibase/types"

async function guardName(name: string, id?: string) {
  const existingProjectApps = await fetch()

  if (existingProjectApps.find(p => p.name === name && p._id !== id)) {
    throw new HTTPError(`App with name '${name}' is already taken.`, 400)
  }
}

export async function fetch(): Promise<ProjectApp[]> {
  const db = context.getAppDB()
  const docs = await db.allDocs<ProjectApp>(
    docIds.getProjectAppParams(null, { include_docs: true })
  )
  const result = docs.rows.map(r => ({
    ...r.doc!,
    _id: r.doc!._id!,
    _rev: r.doc!._rev!,
  }))
  return result
}

export async function create(
  projectApp: Omit<ProjectApp, "_id" | "_rev" | "createdAt" | "updatedAt">
) {
  const db = context.getAppDB()

  await guardName(projectApp.name)

  const response = await db.put({
    _id: `${DocumentType.PROJECT_APP}${SEPARATOR}${utils.newid()}`,
    ...projectApp,
  })
  return {
    _id: response.id!,
    _rev: response.rev!,
    ...projectApp,
  }
}

export async function update(
  projectApp: Omit<ProjectApp, "createdAt" | "updatedAt">
) {
  const db = context.getAppDB()

  await guardName(projectApp.name, projectApp._id)

  const response = await db.put(projectApp)
  return {
    _id: response.id!,
    _rev: response.rev!,
    ...projectApp,
  }
}
