import { context, encryption, HTTPError } from "@budibase/backend-core"
import {
  Agent,
  AnyDocument,
  Automation,
  Datasource,
  ExportProjectRequest,
  Table,
  isEmailTrigger,
  KnowledgeBaseFile,
  Project,
  ProjectPackageDependencyIndex,
  ProjectPackageManifest,
  ProjectPackageUnsupportedContent,
  ResourceType,
  Screen,
  UsedResource,
  WorkspaceApp,
} from "@budibase/types"
import fsp from "fs/promises"
import { dirname, join } from "path"
import * as tar from "tar"
import { v4 as uuid } from "uuid"
import sdk from "../../.."
import { budibaseTempDir } from "../../../../utilities/budibaseDir"
import { streamFile } from "../../../../utilities/fileSystem"
import { collectTransitiveResourceDependencies } from "../../resources"
import {
  compareResourceIds,
  getResourceType,
  isAllowedProjectAssignmentResourceId,
} from "../../resources/utils"
import {
  MAX_PROJECT_ARCHIVE_SIZE_BYTES,
  PROJECT_DATA_FILE,
  PROJECT_ATTACHMENTS_DIRECTORY,
  PROJECT_DEPENDENCY_INDEX_FILE,
  PROJECT_DOCS_DIRECTORY,
  PROJECT_EXPORT_FORMAT_VERSION,
  PROJECT_FILE,
  PROJECT_MANIFEST_FILE,
  PROJECT_PERMISSIONS_FILE,
} from "./constants"
import { exportProjectData } from "./data"
import { readProjectPackageFiles } from "./files"
import { exportProjectPermissions } from "./permissions"
import { doWithProjectAssignmentsLock } from "../lock"
import {
  fetchAssignedProjectDocs,
  hasProject,
  isProjectAssignableResourceType,
} from "../utils"

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

const sortResources = (resources: UsedResource[]) =>
  [...resources].sort(
    (a, b) =>
      compareResourceIds(a.type, b.type) || compareResourceIds(a.id, b.id)
  )

const toTimestamp = (timestamp?: string | number) => {
  if (timestamp == null) {
    return undefined
  }
  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const getProjectCreatedAt = (project: Project) =>
  toTimestamp(project.createdAt) ??
  toTimestamp(project.updatedAt) ??
  new Date().toISOString()

export async function listAssignedAgentFiles(
  assignedAgents: Agent[],
  listFilesForAgent = sdk.ai.rag.listFilesForAgent
): Promise<KnowledgeBaseFile[]> {
  return (
    await Promise.all(
      assignedAgents.map(agent => listFilesForAgent(agent._id!))
    )
  ).flat()
}

async function getDirectMembers(projectId: string): Promise<UsedResource[]> {
  const assignedDocs = await fetchAssignedProjectDocs(projectId)

  return sortResources(
    assignedDocs.flatMap(doc => {
      if (
        !doc._id ||
        !hasProject(doc, projectId) ||
        !isAllowedProjectAssignmentResourceId(doc._id)
      ) {
        return []
      }

      const type = getResourceType(doc._id)
      if (
        !type ||
        !isProjectAssignableResourceType(type) ||
        (type === ResourceType.DATASOURCE && typeof doc.source !== "string")
      ) {
        return []
      }

      return [{ id: doc._id, name: doc.name || "Unknown", type }]
    })
  )
}

async function getUnsupportedContent(
  projectId: string,
  agents: Agent[],
  workspaceApps: WorkspaceApp[],
  exportedAgentIds: Set<string>
): Promise<ProjectPackageUnsupportedContent[]> {
  const exportedAgents = agents.filter(
    agent => !!agent._id && exportedAgentIds.has(agent._id)
  )
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
    listAssignedAgentFiles(exportedAgents),
    defaultWorkspaceApp && assignedWorkspaceAppIds.has(defaultWorkspaceApp._id)
      ? sdk.screens
          .fetch()
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

  if (exportedAgents.length) {
    unsupported.push({
      type: "agent_linked_content",
      count: exportedAgents.length,
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

async function sanitiseDocumentForExport(
  doc: AnyDocument,
  type: ResourceType,
  screenWorkspaceAppIdByScreenId?: Map<string, string>
) {
  const sanitised = structuredClone(doc)
  delete sanitised._rev

  if (type === ResourceType.DATASOURCE) {
    const datasource = sanitised as Datasource
    if (datasource.entities) {
      datasource.entities = Object.fromEntries(
        Object.entries(datasource.entities).map(([name, entity]) => {
          const next = { ...entity }
          delete next.projectIds
          return [name, next]
        })
      )
    }
    return await sdk.datasources.removeSecretSingle(datasource)
  }

  if (type === ResourceType.AGENT) {
    return {
      ...sdk.ai.agents.sanitiseAgentForExport(sanitised as Agent),
      aiconfig: "",
    }
  }

  if (type === ResourceType.AUTOMATION) {
    return sdk.automations.utils.sanitiseAutomationForExport(
      sanitised as Automation
    )
  }

  if (!isProjectAssignableResourceType(type)) {
    delete sanitised.projectIds
  }

  if (type === ResourceType.SCREEN && !sanitised.workspaceAppId) {
    const workspaceAppId = screenWorkspaceAppIdByScreenId?.get(doc._id!)
    if (workspaceAppId) {
      ;(sanitised as Screen).workspaceAppId = workspaceAppId
    }
  }

  return sanitised
}

function sanitiseProjectForExport(project: Project) {
  const sanitised = structuredClone(project)
  const createdAt = getProjectCreatedAt(project)
  delete sanitised._rev
  delete sanitised.importSetup
  sanitised.createdAt = createdAt
  sanitised.updatedAt = toTimestamp(project.updatedAt) ?? createdAt
  return sanitised
}

function countManifestResourcesByType(dependencies: UsedResource[]) {
  const resourcesByType: Partial<Record<ResourceType, number>> = {
    // The project document is exported separately from its dependency docs.
    [ResourceType.PROJECT]: 1,
  }
  for (const dependency of dependencies) {
    resourcesByType[dependency.type] =
      (resourcesByType[dependency.type] || 0) + 1
  }
  return resourcesByType
}

function buildManifest({
  project,
  workspaceId,
  dependencies,
  unsupportedContent,
  requiresEmailCredentials,
}: {
  project: Project
  workspaceId: string
  dependencies: UsedResource[]
  unsupportedContent: ProjectPackageUnsupportedContent[]
  requiresEmailCredentials: boolean
}): ProjectPackageManifest {
  const createdAt = getProjectCreatedAt(project)
  const resourcesByType = countManifestResourcesByType(dependencies)

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
      createdAt,
      updatedAt: toTimestamp(project.updatedAt) ?? createdAt,
    },
    sourceWorkspace: {
      id: workspaceId,
    },
    resourcesByType,
    containsRows: false,
    containsAttachments: false,
    containsPermissions: true,
    requiresSecrets:
      !!resourcesByType[ResourceType.DATASOURCE] ||
      !!resourcesByType[ResourceType.AGENT] ||
      requiresEmailCredentials,
    unsupportedContent,
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
  opts?: ExportProjectRequest
) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Could not determine workspace for Project export")
  }

  const snapshot = await doWithProjectAssignmentsLock(async () => {
    const project = await sdk.projects.get(projectId)
    if (!project) {
      throw new Error(`Project '${projectId}' not found`)
    }

    const [agents, workspaceApps, directMembers] = await Promise.all([
      sdk.ai.agents.fetch(),
      sdk.workspaceApps.fetch(),
      getDirectMembers(projectId),
    ])
    const directDatasourceIds = directMembers
      .filter(resource => resource.type === ResourceType.DATASOURCE)
      .map(resource => resource.id)
    const graph = await sdk.resources.getResourcesInfo({
      includeProjects: false,
      includeDatasourceQueries: true,
      datasourceIdsForQueries: directDatasourceIds,
    })
    graph[projectId] = { dependencies: directMembers }
    const projectDependencies = sortResources(
      collectTransitiveResourceDependencies(graph, projectId)
    )
    graph[projectId].dependencies = projectDependencies
    const typeByResourceId = new Map(
      projectDependencies.map(resource => [resource.id, resource.type])
    )
    const docsToExport = projectDependencies.map(resource => resource.id)
    const exportedDocs = docsToExport.length
      ? await context.getWorkspaceDB().getMultiple<AnyDocument>(docsToExport, {
          allowMissing: false,
        })
      : []
    const permissions = await exportProjectPermissions({
      resources: exportedDocs.map(doc => ({
        resourceType: typeByResourceId.get(doc._id!)!,
        doc,
      })),
    })

    return {
      agents,
      directMembers,
      docsToExport,
      exportedDocs,
      graph,
      project,
      permissions,
      projectDependencies,
      typeByResourceId,
      workspaceApps,
    }
  })
  const {
    agents,
    directMembers,
    docsToExport,
    exportedDocs,
    graph,
    project,
    permissions,
    projectDependencies,
    typeByResourceId,
    workspaceApps,
  } = snapshot
  const exportedAgentIds = new Set(
    projectDependencies
      .filter(resource => resource.type === ResourceType.AGENT)
      .map(resource => resource.id)
  )
  const unsupportedContent = await getUnsupportedContent(
    projectId,
    agents,
    workspaceApps,
    exportedAgentIds
  )
  const exportedResourceIds = new Set(docsToExport)
  const getExportedDependencies = (resourceId: string) =>
    sortResources(
      (graph[resourceId]?.dependencies || []).filter(dependency =>
        exportedResourceIds.has(dependency.id)
      )
    )
  const dependencyIndex: ProjectPackageDependencyIndex = {
    rootProjectId: projectId,
    directMembers,
    resources: {
      [projectId]: {
        dependencies: getExportedDependencies(projectId),
      },
      ...Object.fromEntries(
        docsToExport.map(id => [
          id,
          { dependencies: getExportedDependencies(id) },
        ])
      ),
    },
  }

  const manifest = buildManifest({
    project,
    workspaceId,
    dependencies: projectDependencies,
    unsupportedContent,
    requiresEmailCredentials: exportedDocs.some(
      doc =>
        typeByResourceId.get(doc._id!) === ResourceType.AUTOMATION &&
        isEmailTrigger((doc as Automation).definition?.trigger)
    ),
  })
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
    if (opts?.includeRows) {
      const { data, unsupportedContent: omittedData } = await exportProjectData(
        {
          workspaceId,
          tables: exportedDocs.filter(
            doc =>
              typeByResourceId.get(doc._id!) === ResourceType.TABLE &&
              hasProject(doc, projectId)
          ) as Table[],
          dirPath: tmpPath,
        }
      )
      manifest.containsRows = data.rows.length > 0
      manifest.containsAttachments = data.attachments.length > 0
      manifest.unsupportedContent.push(...omittedData)
      await writeJsonFile(join(tmpPath, PROJECT_DATA_FILE), data)
    }
    await writeJsonFile(join(tmpPath, PROJECT_MANIFEST_FILE), manifest)
    await writeJsonFile(join(tmpPath, PROJECT_PERMISSIONS_FILE), permissions)
    await writeJsonFile(
      join(tmpPath, PROJECT_FILE),
      sanitiseProjectForExport(project)
    )
    await writeJsonFile(
      join(tmpPath, PROJECT_DEPENDENCY_INDEX_FILE),
      dependencyIndex
    )
    await fsp.mkdir(join(tmpPath, PROJECT_DOCS_DIRECTORY), { recursive: true })

    const writeResults = await Promise.allSettled(
      exportedDocs.map(async doc => {
        const type = typeByResourceId.get(doc._id!)
        if (!type) {
          return
        }

        const sanitised = await sanitiseDocumentForExport(
          doc,
          type,
          screenWorkspaceAppIdByScreenId
        )
        await writeJsonFile(
          join(tmpPath, PROJECT_DOCS_DIRECTORY, type, `${doc._id}.json`),
          sanitised
        )
      })
    )
    const writeFailure = writeResults.find(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    )
    if (writeFailure) {
      throw writeFailure.reason
    }

    await readProjectPackageFiles({ dirPath: tmpPath })

    if (opts?.encryptPassword) {
      await encryptDirectory(tmpPath, opts.encryptPassword)
    }

    const tarPath = await tarFilesToTmp(tmpPath, await fsp.readdir(tmpPath))
    if ((await fsp.stat(tarPath)).size > MAX_PROJECT_ARCHIVE_SIZE_BYTES) {
      await fsp.rm(tarPath, { force: true })
      throw new HTTPError("Project package is too large.", 400)
    }
    return tarPath
  } finally {
    await fsp.rm(tmpPath, { recursive: true, force: true })
  }
}

export async function streamExportProject({
  projectId,
  encryptPassword,
  includeRows,
}: ExportProjectRequest & {
  projectId: string
}) {
  const tarPath = await exportProject(projectId, {
    encryptPassword,
    includeRows,
  })
  const stream = streamFile(tarPath)
  const cleanup = () => {
    fsp.rm(tarPath, { force: true }).catch(() => {})
  }

  stream.once("close", cleanup)
  stream.once("error", cleanup)

  return stream
}
