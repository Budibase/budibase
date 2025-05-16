import { context, docIds, HTTPError, utils } from "@budibase/backend-core"
import {
  DocumentType,
  WorkspaceApp,
  SEPARATOR,
  WithoutDocMetadata,
} from "@budibase/types"

async function guardName(name: string, id?: string) {
  const existingProjectApps = await fetch()

  if (existingProjectApps.find(p => p.name === name && p._id !== id)) {
    throw new HTTPError(`App with name '${name}' is already taken.`, 400)
  }
}

export async function fetch(): Promise<WorkspaceApp[]> {
  const db = context.getAppDB()
  const docs = await db.allDocs<WorkspaceApp>(
    docIds.getProjectAppParams(null, { include_docs: true })
  )
  const result = docs.rows.map(r => ({
    ...r.doc!,
    _id: r.doc!._id!,
    _rev: r.doc!._rev!,
  }))
  return result
}

export async function get(id: string): Promise<WorkspaceApp | undefined> {
  const db = context.getAppDB()
  const workspaceApp = await db.tryGet<WorkspaceApp>(id)
  return workspaceApp
}

export async function create(workspaceApp: WithoutDocMetadata<WorkspaceApp>) {
  const db = context.getAppDB()

  await guardName(workspaceApp.name)

  const response = await db.put({
    _id: `${DocumentType.PROJECT_APP}${SEPARATOR}${utils.newid()}`,
    ...workspaceApp,
  })
  return {
    _id: response.id!,
    _rev: response.rev!,
    ...workspaceApp,
  }
}

export async function update(
  workspaceApp: Omit<WorkspaceApp, "createdAt" | "updatedAt">
) {
  const db = context.getAppDB()

  await guardName(workspaceApp.name, workspaceApp._id)

  const response = await db.put(workspaceApp)
  return {
    _id: response.id!,
    _rev: response.rev!,
    ...workspaceApp,
  }
}

export async function remove(
  projectAppId: string,
  _rev: string
): Promise<void> {
  const db = context.getAppDB()
  try {
    await db.remove(projectAppId, _rev)
  } catch (e: any) {
    if (e.status === 404) {
      throw new HTTPError(
        `Project app with id '${projectAppId}' not found.`,
        404
      )
    }
    throw e
  }
}
