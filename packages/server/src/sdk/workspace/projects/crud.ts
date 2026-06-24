import { context, docIds, HTTPError } from "@budibase/backend-core"
import { Datasource, Project, WithoutDocMetadata } from "@budibase/types"
import { isExternalTableID } from "../../../integrations/utils"
import sdk from "../.."
import { addProjectId, hasProject, removeProjectId } from "./utils"

type ProjectUpdate = Pick<Project, "_id" | "_rev"> &
  Partial<Pick<Project, "name" | "description" | "color">>

type AssignmentRollback = () => Promise<unknown>
type AssignmentUpdate = () => Promise<AssignmentRollback>

const PROJECT_COLOR_PATTERNS = [
  /^(?:#[0-9a-f]{3,4}|#[0-9a-f]{6}|#[0-9a-f]{8})$/i,
  /^[a-z]+$/i,
  /^rgba?\([0-9.%+\-\s,/]+\)$/i,
  /^hsla?\([0-9.%+\-\s,/]*(?:deg|grad|rad|turn)?[0-9.%+\-\s,/]*\)$/i,
  /^var\(--spectrum-global-color-[a-z0-9-]+\)$/i,
]

const validateProjectColor = (color?: string) => {
  if (color == null || color.trim() === "") {
    return undefined
  }

  const value = color.trim()
  if (!PROJECT_COLOR_PATTERNS.some(pattern => pattern.test(value))) {
    throw new HTTPError("Project color is invalid.", 400)
  }
  return value
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

export async function create(
  project: WithoutDocMetadata<Project>
): Promise<Project> {
  const db = context.getWorkspaceDB()
  const now = new Date().toISOString()

  const response = await db.put(
    {
      ...project,
      color: validateProjectColor(project.color),
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
        ? { color: validateProjectColor(project.color) }
        : {}),
      _rev: project._rev,
      createdAt: persisted.createdAt,
      updatedAt: new Date().toISOString(),
    },
    { returnDoc: true }
  )

  return response.doc
}

async function rollbackAssignments(rollbacks: AssignmentRollback[]) {
  const errors: unknown[] = []
  for (const rollback of [...rollbacks].reverse()) {
    try {
      await rollback()
    } catch (err) {
      errors.push(err)
    }
  }
  return errors
}

function throwWithRollbackErrors(err: unknown, rollbackErrors: unknown[]) {
  if (!rollbackErrors.length) {
    throw err
  }

  throw new AggregateError(
    [err, ...rollbackErrors],
    err instanceof Error ? err.message : "Project operation failed."
  )
}

async function applyAssignmentUpdates(updates: AssignmentUpdate[]) {
  const rollbacks: AssignmentRollback[] = []
  try {
    for (const update of updates) {
      rollbacks.push(await update())
    }
  } catch (err) {
    const rollbackErrors = await rollbackAssignments(rollbacks)
    throwWithRollbackErrors(err, rollbackErrors)
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
      .filter(workspaceApp => hasProject(workspaceApp, projectId))
      .map(workspaceApp => async () => {
        const updated = await sdk.workspaceApps.update(
          removeProjectId(workspaceApp, projectId)
        )
        return async () =>
          await sdk.workspaceApps.update(addProjectId(updated, projectId))
      }),
    ...automations
      .filter(automation => hasProject(automation, projectId))
      .map(automation => async () => {
        const updated = await sdk.automations.update(
          removeProjectId(automation, projectId)
        )
        return async () =>
          await sdk.automations.update(addProjectId(updated, projectId))
      }),
    ...agents
      .filter(agent => hasProject(agent, projectId))
      .map(agent => async () => {
        const updated = await sdk.ai.agents.update(
          removeProjectId(agent, projectId)
        )
        return async () =>
          await sdk.ai.agents.update(addProjectId(updated, projectId))
      }),
    ...tables
      .filter(
        table => hasProject(table, projectId) && !isExternalTableID(table._id!)
      )
      .map(table => async () => {
        const updated = await sdk.tables.saveTable(
          removeProjectId(table, projectId)
        )
        return async () =>
          await sdk.tables.saveTable(addProjectId(updated, projectId))
      }),
    ...queries
      .filter(query => hasProject(query, projectId))
      .map(query => async () => {
        const response = await db.put(removeProjectId(query, projectId))
        return async () =>
          await db.put(addProjectId({ ...query, _rev: response.rev }, projectId))
      }),
    ...datasources.flatMap(datasource => {
      const entityKeys = Object.entries(datasource.entities || {})
        .filter(([_, entity]) => hasProject(entity, projectId))
        .map(([key]) => key)
      const clearDatasourceProjectIds = hasProject(datasource, projectId)
      if (!clearDatasourceProjectIds && !entityKeys.length) {
        return []
      }

      return [
        async () => {
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
          return async () => {
            const updated = await db.get<Datasource>(datasource._id!)
            const restoredEntities = { ...updated.entities }
            for (const key of entityKeys) {
              const entity = restoredEntities[key]
              if (entity) {
                restoredEntities[key] = addProjectId(entity, projectId)
              }
            }
            const restoredDatasource = clearDatasourceProjectIds
              ? addProjectId(updated, projectId)
              : updated
            await db.put({
              ...restoredDatasource,
              entities: restoredEntities,
            })
          }
        },
      ]
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
    const rollbackErrors = await restoreAssignments()
    throwWithRollbackErrors(err, rollbackErrors)
  }
}
