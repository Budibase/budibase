import { context, docIds, HTTPError } from "@budibase/backend-core"
import { helpers } from "@budibase/shared-core"
import {
  DocumentType,
  prefixed,
  type AnyDocument,
  type Datasource,
  type Project,
} from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import sdk from "../.."
import { hasProject, removeProjectId } from "./utils"

interface CreateProjectInput {
  name: string
  description?: string
  color?: string
}

interface UpdateProjectInput {
  _id: string
  _rev: string
  name?: string
  description?: string
  color?: string
}

type Rollback = () => Promise<void>

const normaliseProjectColor = (color?: string) => {
  try {
    return helpers.normaliseSafeCssColor(color)
  } catch {
    throw new HTTPError("Project color is invalid.", 400)
  }
}

const isProjectId = (id?: string) =>
  id?.startsWith(prefixed(DocumentType.PROJECT))

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
  if (!isProjectId(id)) {
    return undefined
  }

  const db = context.getWorkspaceDB()
  const project = await db.tryGet<Project>(id)
  return isProjectId(project?._id) ? project : undefined
}

export async function create(project: CreateProjectInput): Promise<Project> {
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

export async function update(project: UpdateProjectInput): Promise<Project> {
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
      ...(Object.hasOwn(project, "color")
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

const rollbackAssignments = async (rollbacks: Rollback[]) => {
  const results = await Promise.allSettled(
    rollbacks.reverse().map(rollback => rollback())
  )
  const failures = results.filter(result => result.status === "rejected")
  if (failures.length) {
    console.log("Failed to roll back project assignment cleanup", { failures })
  }
}

async function clearAssignments(projectId: string) {
  const db = context.getWorkspaceDB()
  const rollbacks: Rollback[] = []
  const [
    workspaceApps,
    automations,
    agents,
    tables,
    queries,
    datasources,
    datasourcePluses,
  ] = await Promise.all([
    sdk.workspaceApps.fetch(),
    sdk.automations.fetch(),
    sdk.ai.agents.fetch(),
    sdk.tables.getAllTables(),
    sdk.queries.fetch({ enrich: false }),
    sdk.datasources.getExternalDatasources(),
    sdk.datasources.getExternalDatasources({ plus: true }),
  ])
  const allDatasources = Array.from(
    new Map(
      [...datasources, ...datasourcePluses]
        .filter((datasource): datasource is Datasource => !!datasource._id)
        .map(datasource => [datasource._id!, datasource])
    ).values()
  )

  const changedDocs: AnyDocument[] = []
  const originals: AnyDocument[] = []

  const getProjectRemovalUpdates = async <T extends AnyDocument>(docs: T[]) => {
    const ids = docs
      .filter(
        (doc): doc is T & { _id: string } =>
          !!doc._id && hasProject(doc, projectId)
      )
      .map(doc => doc._id)

    if (!ids.length) {
      return []
    }

    const currentDocs = await db.getMultiple<AnyDocument>(ids)
    return currentDocs
      .filter(doc => hasProject(doc, projectId))
      .map(current => ({
        original: current,
        updated: removeProjectId(current, projectId),
      }))
  }

  const assignmentUpdates = (
    await Promise.all([
      getProjectRemovalUpdates(workspaceApps),
      getProjectRemovalUpdates(automations),
      getProjectRemovalUpdates(agents),
      getProjectRemovalUpdates(
        tables.filter(table => !isExternalTableID(table._id!))
      ),
      getProjectRemovalUpdates(queries),
    ])
  ).flat()

  for (const { original, updated } of assignmentUpdates) {
    originals.push(original)
    changedDocs.push(updated)
  }

  const datasourceCandidates = allDatasources.filter(datasource => {
    const entityKeys = Object.entries(datasource.entities || {}).filter(
      ([_, entity]) => hasProject(entity, projectId)
    )
    return hasProject(datasource, projectId) || entityKeys.length
  })

  const datasourceUpdates = await Promise.all(
    datasourceCandidates.map(async datasource => {
      const current = await db.get<Datasource>(datasource._id!)
      const entityKeys = Object.entries(current.entities || {})
        .filter(([_, entity]) => hasProject(entity, projectId))
        .map(([key]) => key)
      const entities = { ...current.entities }
      for (const key of entityKeys) {
        const entity = entities[key]
        if (entity) {
          entities[key] = removeProjectId(entity, projectId)
        }
      }
      return {
        original: current,
        updated: {
          ...removeProjectId(current, projectId),
          entities,
        },
      }
    })
  )

  for (const { original, updated } of datasourceUpdates) {
    originals.push(original)
    changedDocs.push(updated)
  }

  if (!changedDocs.length) {
    return rollbacks
  }

  try {
    const results = await db.bulkDocs(changedDocs)
    const failures = results
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.error)

    if (failures.length) {
      for (const { result, index } of results
        .map((result, index) => ({ result, index }))
        .filter(({ result }) => !result.error)) {
        const original = originals[index]
        rollbacks.push(async () => {
          await db.put({ ...original, _rev: result.rev })
        })
      }
      await rollbackAssignments(rollbacks)
      throw new HTTPError("Failed to clear project assignments.", 500)
    }

    for (const [index, result] of results.entries()) {
      const original = originals[index]
      rollbacks.push(async () => {
        await db.put({ ...original, _rev: result.rev })
      })
    }
  } catch (err) {
    if (!(err instanceof HTTPError)) {
      await rollbackAssignments(rollbacks)
    }
    throw err
  }

  return rollbacks
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

  const rollbacks = await clearAssignments(id)
  try {
    return await db.remove(id, rev)
  } catch (err) {
    await rollbackAssignments(rollbacks)
    throw err
  }
}
