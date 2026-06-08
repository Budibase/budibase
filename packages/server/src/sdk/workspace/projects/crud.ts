import { context, docIds, HTTPError } from "@budibase/backend-core"
import { Project, WithoutDocMetadata } from "@budibase/types"
import sdk from "../.."

type ProjectUpdate = Pick<Project, "_id" | "_rev"> &
  Partial<Pick<Project, "name" | "description" | "color">>

type AssignmentRollback = () => Promise<unknown>
type AssignmentUpdate = () => Promise<AssignmentRollback>

export async function fetch(): Promise<Project[]> {
  const db = context.getWorkspaceDB()
  const docs = await db.allDocs<Project>(
    docIds.getProjectParams(null, { include_docs: true })
  )

  return docs.rows
    .map(row => row.doc)
    .filter((doc): doc is Project => !!doc)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function get(id: string): Promise<Project | undefined> {
  const db = context.getWorkspaceDB()
  return await db.tryGet<Project>(id)
}

export async function create(
  project: WithoutDocMetadata<Project>
): Promise<Project> {
  const db = context.getWorkspaceDB()
  const now = new Date().toISOString()

  const response = await db.put(
    {
      ...project,
      _id: docIds.generateProjectID(),
      createdAt: now,
      updatedAt: now,
    },
    { returnDoc: true }
  )

  return response.doc
}

export async function update(project: ProjectUpdate): Promise<Project> {
  if (!project._id) {
    throw new HTTPError("Project id is required.", 400)
  }
  if (!project._rev) {
    throw new HTTPError("Project revision is required.", 400)
  }

  const db = context.getWorkspaceDB()
  const persisted = await get(project._id)
  if (!persisted) {
    throw new HTTPError(`Project with id '${project._id}' not found.`, 404)
  }

  const response = await db.put(
    {
      ...persisted,
      ...project,
      _rev: project._rev,
      createdAt: persisted.createdAt,
      updatedAt: new Date().toISOString(),
    },
    { returnDoc: true }
  )

  return response.doc
}

async function rollbackAssignments(rollbacks: AssignmentRollback[]) {
  for (const rollback of [...rollbacks].reverse()) {
    await rollback()
  }
}

async function applyAssignmentUpdates(updates: AssignmentUpdate[]) {
  const rollbacks: AssignmentRollback[] = []
  try {
    for (const update of updates) {
      rollbacks.push(await update())
    }
  } catch (err) {
    await rollbackAssignments(rollbacks)
    throw err
  }
  return async () => await rollbackAssignments(rollbacks)
}

async function clearAssignments(projectId: string) {
  const [workspaceApps, automations, agents, tables, queries, datasources] =
    await Promise.all([
      sdk.workspaceApps.fetch(),
      sdk.automations.fetch(),
      sdk.ai.agents.fetch(),
      sdk.tables.getAllTables(),
      sdk.queries.fetch({ enrich: false }),
      sdk.datasources.getExternalDatasources(),
    ])

  const db = context.getWorkspaceDB()
  const updates: AssignmentUpdate[] = [
    ...workspaceApps
      .filter(workspaceApp => workspaceApp.projectId === projectId)
      .map(workspaceApp => async () => {
        const updated = await sdk.workspaceApps.update({
          ...workspaceApp,
          projectId: undefined,
        })
        return async () =>
          await sdk.workspaceApps.update({ ...updated, projectId })
      }),
    ...automations
      .filter(automation => automation.projectId === projectId)
      .map(automation => async () => {
        const updated = await sdk.automations.update({
          ...automation,
          projectId: undefined,
        })
        return async () =>
          await sdk.automations.update({ ...updated, projectId })
      }),
    ...agents
      .filter(agent => agent.projectId === projectId)
      .map(agent => async () => {
        const updated = await sdk.ai.agents.update({
          ...agent,
          projectId: undefined,
        })
        return async () => await sdk.ai.agents.update({ ...updated, projectId })
      }),
    ...tables
      .filter(table => table.projectId === projectId)
      .map(table => async () => {
        const updated = await sdk.tables.saveTable({
          ...table,
          projectId: undefined,
        })
        return async () => await sdk.tables.saveTable({ ...updated, projectId })
      }),
    ...queries
      .filter(query => query.projectId === projectId)
      .map(query => async () => {
        const response = await db.put({ ...query, projectId: undefined })
        return async () =>
          await db.put({ ...query, _rev: response.rev, projectId })
      }),
    ...datasources
      .filter(datasource => datasource.projectId === projectId)
      .map(datasource => async () => {
        const response = await db.put(
          sdk.tables.populateExternalTableSchemas({
            ...datasource,
            projectId: undefined,
          })
        )
        return async () =>
          await db.put({
            ...datasource,
            _rev: response.rev,
            projectId,
          })
      }),
  ]

  return await applyAssignmentUpdates(updates)
}

export async function remove(id: string, rev: string) {
  const db = context.getWorkspaceDB()
  const project = await get(id)
  if (!project) {
    throw new HTTPError(`Project with id '${id}' not found.`, 404)
  }
  if (project._rev !== rev) {
    throw new HTTPError("Project revision does not match.", 409)
  }

  const restoreAssignments = await clearAssignments(id)
  try {
    return await db.remove(id, rev)
  } catch (err) {
    await restoreAssignments()
    throw err
  }
}
