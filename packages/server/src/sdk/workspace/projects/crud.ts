import { context, docIds, HTTPError } from "@budibase/backend-core"
import { Project, WithoutDocMetadata } from "@budibase/types"
import sdk from "../.."

type ProjectUpdate = Pick<Project, "_id" | "_rev"> &
  Partial<Pick<Project, "name" | "description" | "color">>

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

  await Promise.all([
    ...workspaceApps
      .filter(workspaceApp => workspaceApp.projectId === projectId)
      .map(workspaceApp =>
        sdk.workspaceApps.update({ ...workspaceApp, projectId: undefined })
      ),
    ...automations
      .filter(automation => automation.projectId === projectId)
      .map(automation =>
        sdk.automations.update({ ...automation, projectId: undefined })
      ),
    ...agents
      .filter(agent => agent.projectId === projectId)
      .map(agent => sdk.ai.agents.update({ ...agent, projectId: undefined })),
    ...tables
      .filter(table => table.projectId === projectId)
      .map(table => sdk.tables.saveTable({ ...table, projectId: undefined })),
    ...queries
      .filter(query => query.projectId === projectId)
      .map(query =>
        context.getWorkspaceDB().put({ ...query, projectId: undefined })
      ),
    ...datasources
      .filter(datasource => datasource.projectId === projectId)
      .map(datasource =>
        context.getWorkspaceDB().put(
          sdk.tables.populateExternalTableSchemas({
            ...datasource,
            projectId: undefined,
          })
        )
      ),
  ])
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

  await clearAssignments(id)
  return await db.remove(id, rev)
}
