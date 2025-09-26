import { context, docIds, events, HTTPError } from "@budibase/backend-core"
import { RequiredKeys, WithoutDocMetadata, WorkspaceApp } from "@budibase/types"
import sdk from "../.."
import { helpers } from "@budibase/shared-core"

async function guardName(name: string, id?: string) {
  const existingWorkspaceApps = await fetch()

  if (existingWorkspaceApps.find(p => p.name === name && p._id !== id)) {
    throw new HTTPError(`App with name '${name}' is already taken.`, 400)
  }
}

const duplicateScreens = async (originalAppId: string, newAppId: string) => {
  const screens = await sdk.screens.fetch()

  const appScreens = screens.filter(s => s.workspaceAppId === originalAppId)
  const newScreens = []
  for (let i = 0; i < appScreens.length; i++) {
    const screen = appScreens[i]
    const createdScreen = await sdk.screens.create({
      ...{
        layoutId: screen.layoutId,
        showNavigation: screen.showNavigation,
        width: screen.width,
        routing: screen.routing,
        props: screen.props,
        name: screen.name,
        pluginAdded: screen.pluginAdded,
        onLoad: screen.onLoad,
        variant: screen.variant,
      },
      workspaceAppId: newAppId,
    })

    newScreens.push(createdScreen)
  }

  return newScreens
}

const createDuplicatedApp = async (workspaceApp: WorkspaceApp) => {
  const otherApps = await sdk.workspaceApps.fetch()

  const name = helpers.duplicateName(
    workspaceApp.name,
    otherApps.map(a => a.name)
  )

  const duplicatedAppData = {
    name,
    url: `/${slugify(name)}`,
    disabled: true,
    navigation: workspaceApp.navigation,
    isDefault: false,
  }

  return sdk.workspaceApps.create(duplicatedAppData)
}

const slugify = (text: string) => text.toLowerCase().replaceAll(" ", "-")

export async function fetch(
  db = context.getWorkspaceDB()
): Promise<WorkspaceApp[]> {
  const docs = await db.allDocs<WorkspaceApp>(
    docIds.getWorkspaceAppParams(null, { include_docs: true })
  )
  const result = docs.rows.map(r => ({
    ...r.doc!,
    _id: r.doc!._id!,
    _rev: r.doc!._rev!,
  }))
  return result
}

export async function get(id: string): Promise<WorkspaceApp | undefined> {
  const db = context.getWorkspaceDB()
  const workspaceApp = await db.tryGet<WorkspaceApp>(id)
  return workspaceApp
}

export async function create(
  workspaceApp: WithoutDocMetadata<WorkspaceApp>
): Promise<WorkspaceApp> {
  const db = context.getWorkspaceDB()

  await guardName(workspaceApp.name)

  const response = await db.put(
    {
      ...workspaceApp,
      _id: docIds.generateWorkspaceAppID(),
    },
    { returnDoc: true }
  )
  return response.doc
}

export async function duplicate(
  appToDuplicate: WorkspaceApp
): Promise<WorkspaceApp> {
  const duplicated = await createDuplicatedApp(appToDuplicate)
  await duplicateScreens(appToDuplicate._id as string, duplicated._id as string)
  return duplicated
}

export async function update(
  workspaceApp: Omit<WorkspaceApp, "createdAt" | "updatedAt" | "isDefault">
): Promise<WorkspaceApp> {
  const db = context.getWorkspaceDB()

  const persisted = await get(workspaceApp._id!)
  if (!persisted) {
    throw new HTTPError(
      `Project app with id '${workspaceApp._id}' not found.`,
      404
    )
  }
  if (workspaceApp.name !== persisted.name) {
    await guardName(workspaceApp.name, workspaceApp._id)
  }
  const docToUpdate: RequiredKeys<WorkspaceApp> = {
    _id: workspaceApp._id,
    _rev: workspaceApp._rev,
    name: workspaceApp.name,
    url: workspaceApp.url,
    navigation: workspaceApp.navigation,
    disabled: workspaceApp.disabled,

    // Immutable properties
    createdAt: persisted.createdAt,
    updatedAt: persisted.updatedAt,
    isDefault: persisted.isDefault,
    _deleted: undefined,
  }
  const response = await db.put(docToUpdate, { returnDoc: true })
  return response.doc
}

export async function remove(
  workspaceAppId: string,
  _rev: string
): Promise<void> {
  const db = context.getWorkspaceDB()
  try {
    const existing = await db.tryGet<WorkspaceApp>(workspaceAppId)
    if (!existing)
      throw new HTTPError(
        `Project app with id '${workspaceAppId}' not found.`,
        404
      )

    await db.remove(workspaceAppId, _rev)

    // Clear out any favourites related to this
    events.workspace.deleted(existing, context.getWorkspaceId()!)
  } catch (e: any) {
    if (e.status === 404) {
      throw new HTTPError(
        `Project app with id '${workspaceAppId}' not found.`,
        404
      )
    }
    throw e
  }

  const screensToDelete = (await sdk.screens.fetch()).filter(
    s => s.workspaceAppId === workspaceAppId
  )
  await db.bulkRemove(screensToDelete)
}
