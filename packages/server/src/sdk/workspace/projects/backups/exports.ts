import { context, encryption, logging } from "@budibase/backend-core"
import {
  Agent,
  AnyDocument,
  Datasource,
  INTERNAL_TABLE_SOURCE_ID,
  KnowledgeBaseFile,
  Project,
  ProjectPackageDependencyIndex,
  ProjectPackageManifest,
  ProjectPackageUnsupportedContent,
  ResourceType,
  Screen,
  UsedResource,
} from "@budibase/types"
import fsp from "fs/promises"
import { dirname, join } from "path"
import * as tar from "tar"
import { v4 as uuid } from "uuid"
import sdk from "../../.."
import { budibaseTempDir } from "../../../../utilities/budibaseDir"
import { streamFile } from "../../../../utilities/fileSystem"
import { isExternalTableID } from "../../../../integrations/utils"
import {
  PROJECT_ATTACHMENTS_DIRECTORY,
  PROJECT_DEPENDENCY_INDEX_FILE,
  PROJECT_DOCS_DIRECTORY,
  PROJECT_EXPORT_FORMAT_VERSION,
  PROJECT_FILE,
  PROJECT_MANIFEST_FILE,
} from "./constants"
import { hasProject } from "../utils"

async function tarFilesToTmp(tmpDir: string, files: string[]) {
  const fileName = `${uuid()}.tar.gz`
  const exportFile = join(budibaseTempDir(), fileName)
  await tar.create(
    {
      gzip: true,
      file: exportFile,
      noDirRecurse: false,
      cwd: tmpDir,
    },
    files
  )
  return exportFile
}

function getExportDirectoryName(resourceType: ResourceType) {
  return resourceType
}

const sortResources = (resources: UsedResource[]) =>
  [...resources].sort(
    (a, b) => a.type.localeCompare(b.type) || a.id.localeCompare(b.id)
  )

export async function listAssignedAgentFiles(
  projectId: string,
  assignedAgents: Agent[],
  listFilesForAgent = sdk.ai.rag.listFilesForAgent
): Promise<KnowledgeBaseFile[]> {
  return (
    await Promise.all(
      assignedAgents.map(async agent => {
        try {
          return await listFilesForAgent(agent._id!)
        } catch (err) {
          logging.logWarn(
            "Project export: failed to list RAG files for agent",
            {
              err,
              projectId,
              agentId: agent._id,
            }
          )
          return []
        }
      })
    )
  ).flat()
}

async function getDirectMembers(projectId: string): Promise<UsedResource[]> {
  const [datasources, tables, queries, automations, agents, workspaceApps] =
    await Promise.all([
      sdk.datasources.fetch(),
      sdk.tables.getAllTables(),
      sdk.queries.fetch(),
      sdk.automations.fetch(),
      sdk.ai.agents.fetch(),
      sdk.workspaceApps.fetch(),
    ])

  const asUsedResource = (
    doc: { _id?: string; name?: string },
    type: ResourceType
  ): UsedResource => ({
    id: doc._id!,
    name: doc.name || "Unknown",
    type,
  })

  return sortResources([
    ...datasources
      .filter(
        datasource =>
          datasource._id !== INTERNAL_TABLE_SOURCE_ID &&
          (hasProject(datasource, projectId) ||
            Object.values(datasource.entities || {}).some(entity =>
              hasProject(entity, projectId)
            ))
      )
      .map(datasource => asUsedResource(datasource, ResourceType.DATASOURCE)),
    ...tables
      .filter(
        table => hasProject(table, projectId) && !isExternalTableID(table._id!)
      )
      .map(table => asUsedResource(table, ResourceType.TABLE)),
    ...queries
      .filter(query => hasProject(query, projectId))
      .map(query => asUsedResource(query, ResourceType.QUERY)),
    ...automations
      .filter(automation => hasProject(automation, projectId))
      .map(automation => asUsedResource(automation, ResourceType.AUTOMATION)),
    ...agents
      .filter(agent => hasProject(agent, projectId))
      .map(agent => asUsedResource(agent, ResourceType.AGENT)),
    ...workspaceApps
      .filter(workspaceApp => hasProject(workspaceApp, projectId))
      .map(workspaceApp =>
        asUsedResource(workspaceApp, ResourceType.WORKSPACE_APP)
      ),
  ])
}

async function getUnsupportedContent(
  projectId: string
): Promise<ProjectPackageUnsupportedContent[]> {
  const agents = await sdk.ai.agents.fetch()
  const workspaceApps = await sdk.workspaceApps.fetch()
  const assignedAgents = agents.filter(agent => hasProject(agent, projectId))
  const assignedWorkspaceApps = workspaceApps.filter(workspaceApp =>
    hasProject(workspaceApp, projectId)
  )
  const assignedWorkspaceAppIds = new Set(
    assignedWorkspaceApps.map(workspaceApp => workspaceApp._id)
  )
  const defaultWorkspaceApp =
    workspaceApps.find(workspaceApp => workspaceApp.isDefault) ||
    workspaceApps[0]
  const [assignedAgentFiles, orphanScreens] = await Promise.all([
    listAssignedAgentFiles(projectId, assignedAgents),
    defaultWorkspaceApp && assignedWorkspaceAppIds.has(defaultWorkspaceApp._id)
      ? sdk.screens
          .fetch(undefined, { repairMissingWorkspaceAppId: false })
          .then(screens => screens.filter(screen => !screen.workspaceAppId))
      : [],
  ])

  const unsupported: ProjectPackageUnsupportedContent[] = []

  if (assignedAgentFiles.length) {
    unsupported.push({
      type: "agent_file",
      count: assignedAgentFiles.length,
      reason:
        "Agent files and related RAG data are excluded from Project exports.",
    })
  }

  if (assignedAgents.length) {
    unsupported.push({
      type: "agent_linked_content",
      count: assignedAgents.length,
      reason:
        "Agent chats, deployments, and other linked AI content are excluded from Project exports.",
    })
  }

  if (assignedWorkspaceApps.length && orphanScreens.length) {
    unsupported.push({
      type: "screen",
      count: orphanScreens.length,
      reason:
        "Screens without a workspace app link are excluded from deterministic Project export packaging.",
    })
  }

  return unsupported
}

async function sanitizeDocumentForExport(
  doc: AnyDocument,
  type: ResourceType,
  screenWorkspaceAppIdByScreenId?: Map<string, string>
) {
  const sanitized = structuredClone(doc)
  delete sanitized._rev

  if (type === ResourceType.DATASOURCE) {
    return await sdk.datasources.removeSecretSingle(sanitized as Datasource)
  }

  if (type === ResourceType.AGENT) {
    return sdk.ai.agents.sanitiseAgentForExport(sanitized as Agent)
  }

  if (type === ResourceType.SCREEN && !sanitized.workspaceAppId) {
    const workspaceAppId = screenWorkspaceAppIdByScreenId?.get(doc._id!)
    if (workspaceAppId) {
      ;(sanitized as Screen).workspaceAppId = workspaceAppId
    }
  }

  return sanitized
}

function sanitizeProjectForExport(project: Project) {
  const sanitized = structuredClone(project)
  delete sanitized._rev
  return sanitized
}

function buildManifest(
  project: Project,
  workspaceId: string,
  dependencies: UsedResource[],
  unsupportedContent: ProjectPackageUnsupportedContent[]
): ProjectPackageManifest {
  const resourcesByType = dependencies.reduce<
    Partial<Record<ResourceType, number>>
  >(
    (acc, dependency) => {
      acc[dependency.type] = (acc[dependency.type] || 0) + 1
      return acc
    },
    { [ResourceType.PROJECT]: 1 }
  )

  return {
    formatVersion: PROJECT_EXPORT_FORMAT_VERSION,
    artifactType: "project",
    budibaseVersion: process.env.BUDIBASE_VERSION || "unknown",
    exportedAt: new Date().toISOString(),
    project: {
      _id: project._id!,
      name: project.name,
      description: project.description,
      color: project.color,
      createdAt: String(project.createdAt),
      updatedAt: project.updatedAt,
    },
    sourceWorkspace: {
      id: workspaceId,
    },
    resourcesByType,
    containsRows: false,
    containsAttachments: false,
    requiresSecrets:
      !!resourcesByType[ResourceType.DATASOURCE] ||
      !!resourcesByType[ResourceType.AGENT],
    unsupportedContent,
    supportedImportModes: ["additiveImport"],
  }
}

async function writeJsonFile(filePath: string, value: unknown) {
  await fsp.mkdir(dirname(filePath), { recursive: true })
  await fsp.writeFile(filePath, JSON.stringify(value, null, 2))
}

async function encryptDirectory(dirPath: string, password: string) {
  for (let file of await fsp.readdir(dirPath)) {
    const fullPath = join(dirPath, file)
    if (file === PROJECT_ATTACHMENTS_DIRECTORY) {
      continue
    }

    const stats = await fsp.lstat(fullPath)
    if (stats.isFile()) {
      await encryption.encryptFile({ dir: dirPath, filename: file }, password)
      await fsp.rm(fullPath)
    } else if (stats.isDirectory()) {
      await encryptDirectory(fullPath, password)
    }
  }
}

export async function exportProject(
  projectId: string,
  opts?: {
    encryptPassword?: string
  }
) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Could not determine workspace for Project export")
  }

  const project = await sdk.projects.get(projectId)
  if (!project) {
    throw new Error(`Project '${projectId}' not found`)
  }

  const graph = await sdk.resources.getResourcesInfo()
  const projectDependencies = sortResources(
    Array.from(
      new Map(
        (graph[projectId]?.dependencies || []).map(resource => [
          resource.id,
          resource,
        ])
      ).values()
    )
  )
  const directMembers = await getDirectMembers(projectId)
  const unsupportedContent = await getUnsupportedContent(projectId)

  const typeByResourceId = new Map(
    projectDependencies.map(resource => [resource.id, resource.type])
  )
  const docsToExport = projectDependencies.map(resource => resource.id)
  const exportedDocs = docsToExport.length
    ? await context.getWorkspaceDB().getMultiple<AnyDocument>(docsToExport, {
        allowMissing: false,
      })
    : []

  const dependencyIndex: ProjectPackageDependencyIndex = {
    rootProjectId: projectId,
    directMembers,
    resources: {
      [projectId]: {
        dependencies: sortResources(graph[projectId]?.dependencies || []),
      },
      ...Object.fromEntries(
        docsToExport.map(id => [
          id,
          { dependencies: sortResources(graph[id]?.dependencies || []) },
        ])
      ),
    },
  }

  const manifest = buildManifest(
    project,
    workspaceId,
    projectDependencies,
    unsupportedContent
  )
  const screenWorkspaceAppIdByScreenId = new Map<string, string>()

  for (const workspaceAppId of docsToExport.filter(
    id => typeByResourceId.get(id) === ResourceType.WORKSPACE_APP
  )) {
    for (const dependency of graph[workspaceAppId]?.dependencies || []) {
      if (dependency.type === ResourceType.SCREEN) {
        screenWorkspaceAppIdByScreenId.set(dependency.id, workspaceAppId)
      }
    }
  }

  const tmpPath = await fsp.mkdtemp(join(budibaseTempDir(), "project-export-"))
  try {
    await writeJsonFile(join(tmpPath, PROJECT_MANIFEST_FILE), manifest)
    await writeJsonFile(
      join(tmpPath, PROJECT_FILE),
      sanitizeProjectForExport(project)
    )
    await writeJsonFile(
      join(tmpPath, PROJECT_DEPENDENCY_INDEX_FILE),
      dependencyIndex
    )
    await fsp.mkdir(join(tmpPath, PROJECT_DOCS_DIRECTORY), { recursive: true })

    for (const doc of exportedDocs) {
      const type = typeByResourceId.get(doc._id!)
      if (!type) {
        continue
      }

      const sanitized = await sanitizeDocumentForExport(
        doc,
        type,
        screenWorkspaceAppIdByScreenId
      )
      await writeJsonFile(
        join(
          tmpPath,
          PROJECT_DOCS_DIRECTORY,
          getExportDirectoryName(type),
          `${doc._id}.json`
        ),
        sanitized
      )
    }

    if (opts?.encryptPassword) {
      await encryptDirectory(tmpPath, opts.encryptPassword)
    }

    return await tarFilesToTmp(tmpPath, await fsp.readdir(tmpPath))
  } finally {
    await fsp.rm(tmpPath, { recursive: true, force: true })
  }
}

export async function streamExportProject({
  projectId,
  encryptPassword,
}: {
  projectId: string
  encryptPassword?: string
}) {
  const tarPath = await exportProject(projectId, {
    encryptPassword,
  })
  const stream = streamFile(tarPath)
  const cleanup = () => {
    fsp.rm(tarPath, { force: true }).catch(() => {})
  }

  stream.once("close", cleanup)
  stream.once("error", cleanup)

  return stream
}
