import { context, docIds, HTTPError } from "@budibase/backend-core"
import { Playbook, RequiredKeys, WithoutDocMetadata } from "@budibase/types"
import sdk from "../.."

export async function fetch(): Promise<Playbook[]> {
  const db = context.getWorkspaceDB()
  const docs = await db.allDocs<Playbook>(
    docIds.getPlaybookParams(null, { include_docs: true })
  )

  return docs.rows
    .map(row => row.doc)
    .filter((doc): doc is Playbook => !!doc)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function get(id: string): Promise<Playbook | undefined> {
  const db = context.getWorkspaceDB()
  return await db.tryGet<Playbook>(id)
}

export async function create(
  playbook: WithoutDocMetadata<Playbook>
): Promise<Playbook> {
  const db = context.getWorkspaceDB()
  const now = new Date().toISOString()

  const response = await db.put(
    {
      ...playbook,
      _id: docIds.generatePlaybookID(),
      createdAt: now,
      updatedAt: now,
    },
    { returnDoc: true }
  )

  return response.doc
}

export async function update(
  playbook: RequiredKeys<Playbook>
): Promise<Playbook> {
  if (!playbook._id) {
    throw new HTTPError("Playbook id is required.", 400)
  }

  const db = context.getWorkspaceDB()
  const persisted = await get(playbook._id)
  if (!persisted) {
    throw new HTTPError(`Playbook with id '${playbook._id}' not found.`, 404)
  }

  const response = await db.put(
    {
      ...persisted,
      ...playbook,
      updatedAt: new Date().toISOString(),
    },
    { returnDoc: true }
  )

  return response.doc
}

async function clearAssignments(playbookId: string) {
  const [workspaceApps, automations, agents, tables, queries, datasources] =
    await Promise.all([
      sdk.workspaceApps.fetch(),
      sdk.automations.fetch(),
      sdk.ai.agents.fetch(),
      sdk.tables.getAllTables(),
      sdk.queries.fetch(),
      sdk.datasources.getExternalDatasources(),
    ])

  await Promise.all([
    ...workspaceApps
      .filter(workspaceApp => workspaceApp.playbookId === playbookId)
      .map(workspaceApp =>
        sdk.workspaceApps.update({ ...workspaceApp, playbookId: undefined })
      ),
    ...automations
      .filter(automation => automation.playbookId === playbookId)
      .map(automation =>
        sdk.automations.update({ ...automation, playbookId: undefined })
      ),
    ...agents
      .filter(agent => agent.playbookId === playbookId)
      .map(agent => sdk.ai.agents.update({ ...agent, playbookId: undefined })),
    ...tables
      .filter(table => table.playbookId === playbookId)
      .map(table => sdk.tables.saveTable({ ...table, playbookId: undefined })),
    ...queries
      .filter(query => query.playbookId === playbookId)
      .map(query =>
        context.getWorkspaceDB().put({ ...query, playbookId: undefined })
      ),
    ...datasources
      .filter(datasource => datasource.playbookId === playbookId)
      .map(datasource =>
        context.getWorkspaceDB().put(
          sdk.tables.populateExternalTableSchemas({
            ...datasource,
            playbookId: undefined,
          })
        )
      ),
  ])
}

export async function remove(id: string, rev: string) {
  const db = context.getWorkspaceDB()
  const playbook = await get(id)
  if (!playbook) {
    throw new HTTPError(`Playbook with id '${id}' not found.`, 404)
  }

  const response = await db.remove(id, rev)
  await clearAssignments(id)
  return response
}
