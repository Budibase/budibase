import { context, docIds, HTTPError } from "@budibase/backend-core"
import { Datasource, Project } from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import sdk from "../.."
import { hasProject, removeProjectId } from "./utils"

type ProjectCreate = Pick<Project, "name"> &
  Partial<Pick<Project, "description" | "color">>
type ProjectUpdate = Pick<Project, "_id" | "_rev"> &
  Partial<Pick<Project, "name" | "description" | "color">>

const normaliseProjectColor = (color?: string) => {
  if (color == null || color.trim() === "") {
    return undefined
  }
  return color.trim()
}

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

export async function create(project: ProjectCreate): Promise<Project> {
  const db = context.getWorkspaceDB()
  const now = new Date().toISOString()

  const response = await db.put(
    {
      ...project,
      color: normaliseProjectColor(project.color),
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
      ...(Object.prototype.hasOwnProperty.call(project, "color")
        ? { color: normaliseProjectColor(project.color) }
        : {}),
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

  const db = context.getWorkspaceDB()
  for (const workspaceApp of workspaceApps.filter(workspaceApp =>
    hasProject(workspaceApp, projectId)
  )) {
    const workspaceAppWithoutProject = removeProjectId(workspaceApp, projectId)
    await sdk.workspaceApps.update({
      ...workspaceAppWithoutProject,
      projectIds: workspaceAppWithoutProject.projectIds,
    })
  }

  for (const automation of automations.filter(automation =>
    hasProject(automation, projectId)
  )) {
    await sdk.automations.update(removeProjectId(automation, projectId))
  }

  for (const agent of agents.filter(agent => hasProject(agent, projectId))) {
    const agentWithoutProject = removeProjectId(agent, projectId)
    await sdk.ai.agents.update({
      ...agentWithoutProject,
      projectIds: agentWithoutProject.projectIds,
    })
  }

  for (const table of tables.filter(
    table => hasProject(table, projectId) && !isExternalTableID(table._id!)
  )) {
    await sdk.tables.saveTable(removeProjectId(table, projectId))
  }

  for (const query of queries.filter(query => hasProject(query, projectId))) {
    await db.put(removeProjectId(query, projectId))
  }

  for (const datasource of datasources) {
    const entityKeys = Object.entries(datasource.entities || {})
      .filter(([_, entity]) => hasProject(entity, projectId))
      .map(([key]) => key)
    if (!hasProject(datasource, projectId) && !entityKeys.length) {
      continue
    }

    const current = await db.get<Datasource>(datasource._id!)
    const entities = { ...current.entities }
    for (const key of entityKeys) {
      const entity = entities[key]
      if (entity) {
        entities[key] = removeProjectId(entity, projectId)
      }
    }
    await db.put({
      ...removeProjectId(current, projectId),
      entities,
    })
  }
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
