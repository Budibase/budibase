import { context, encryption } from "@budibase/backend-core"
import {
  Agent,
  AnyDocument,
  Datasource,
  Playbook,
  PlaybookPackageDependencyIndex,
  PlaybookPackageManifest,
  PlaybookPackageUnsupportedContent,
  ResourceType,
  UsedResource,
} from "@budibase/types"
import fsp from "fs/promises"
import { dirname, join } from "path"
import * as tar from "tar"
import { v4 as uuid } from "uuid"
import sdk from "../../.."
import { budibaseTempDir } from "../../../../utilities/budibaseDir"
import { streamFile } from "../../../../utilities/fileSystem"
import {
  PLAYBOOK_ATTACHMENTS_DIRECTORY,
  PLAYBOOK_DEPENDENCY_INDEX_FILE,
  PLAYBOOK_DOCS_DIRECTORY,
  PLAYBOOK_EXPORT_FORMAT_VERSION,
  PLAYBOOK_FILE,
  PLAYBOOK_MANIFEST_FILE,
} from "./constants"

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

async function getDirectMembers(playbookId: string): Promise<UsedResource[]> {
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

  return [
    ...datasources
      .filter(datasource => datasource.playbookId === playbookId)
      .map(datasource => asUsedResource(datasource, ResourceType.DATASOURCE)),
    ...tables
      .filter(table => table.playbookId === playbookId)
      .map(table => asUsedResource(table, ResourceType.TABLE)),
    ...queries
      .filter(query => query.playbookId === playbookId)
      .map(query => asUsedResource(query, ResourceType.QUERY)),
    ...automations
      .filter(automation => automation.playbookId === playbookId)
      .map(automation => asUsedResource(automation, ResourceType.AUTOMATION)),
    ...agents
      .filter(agent => agent.playbookId === playbookId)
      .map(agent => asUsedResource(agent, ResourceType.AGENT)),
    ...workspaceApps
      .filter(workspaceApp => workspaceApp.playbookId === playbookId)
      .map(workspaceApp =>
        asUsedResource(workspaceApp, ResourceType.WORKSPACE_APP)
      ),
  ]
}

async function getUnsupportedContent(
  playbookId: string
): Promise<PlaybookPackageUnsupportedContent[]> {
  const agents = await sdk.ai.agents.fetch()
  const workspaceApps = await sdk.workspaceApps.fetch()
  const assignedAgents = agents.filter(agent => agent.playbookId === playbookId)
  const assignedWorkspaceApps = workspaceApps.filter(
    workspaceApp => workspaceApp.playbookId === playbookId
  )
  const [assignedAgentFiles, orphanScreens] = await Promise.all([
    Promise.all(
      assignedAgents.map(agent => sdk.ai.agents.listAgentFiles(agent._id!))
    ).then(files => files.flat()),
    sdk.screens
      .fetch(undefined, {
        repairMissingWorkspaceAppId: false,
      })
      .then(screens => screens.filter(screen => !screen.workspaceAppId)),
  ])

  const unsupported: PlaybookPackageUnsupportedContent[] = []

  if (assignedAgentFiles.length) {
    unsupported.push({
      type: "agent_file",
      count: assignedAgentFiles.length,
      reason:
        "Agent files and related RAG data are excluded from Playbook exports.",
    })
  }

  if (assignedAgents.length) {
    unsupported.push({
      type: "agent_linked_content",
      count: assignedAgents.length,
      reason:
        "Agent chats, deployments, and other linked AI content are excluded from Playbook exports.",
    })
  }

  if (assignedWorkspaceApps.length && orphanScreens.length) {
    unsupported.push({
      type: "screen",
      count: orphanScreens.length,
      reason:
        "Screens without a workspace app link are excluded from deterministic Playbook export packaging.",
    })
  }

  return unsupported
}

async function sanitizeDocumentForExport(doc: AnyDocument, type: ResourceType) {
  const sanitized = structuredClone(doc)
  delete sanitized._rev

  if (type === ResourceType.DATASOURCE) {
    return await sdk.datasources.removeSecretSingle(sanitized as Datasource)
  }

  if (type === ResourceType.AGENT) {
    return sdk.ai.agents.sanitiseAgentForExport(sanitized as Agent)
  }

  return sanitized
}

function sanitizePlaybookForExport(playbook: Playbook) {
  const sanitized = structuredClone(playbook)
  delete sanitized._rev
  return sanitized
}

function buildManifest(
  playbook: Playbook,
  workspaceId: string,
  dependencies: UsedResource[],
  unsupportedContent: PlaybookPackageUnsupportedContent[]
): PlaybookPackageManifest {
  const resourcesByType = dependencies.reduce<
    Partial<Record<ResourceType, number>>
  >(
    (acc, dependency) => {
      acc[dependency.type] = (acc[dependency.type] || 0) + 1
      return acc
    },
    { [ResourceType.PLAYBOOK]: 1 }
  )

  return {
    formatVersion: PLAYBOOK_EXPORT_FORMAT_VERSION,
    artifactType: "playbook",
    budibaseVersion: process.env.BUDIBASE_VERSION || "unknown",
    exportedAt: new Date().toISOString(),
    playbook: {
      _id: playbook._id!,
      name: playbook.name,
      description: playbook.description,
      color: playbook.color,
      createdAt: String(playbook.createdAt),
      updatedAt: playbook.updatedAt,
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
    if (file === PLAYBOOK_ATTACHMENTS_DIRECTORY) {
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

export async function exportPlaybook(
  playbookId: string,
  opts?: {
    encryptPassword?: string
  }
) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Could not determine workspace for Playbook export")
  }

  const playbook = await sdk.playbooks.get(playbookId)
  if (!playbook) {
    throw new Error(`Playbook '${playbookId}' not found`)
  }

  const graph = await sdk.resources.getResourcesInfo()
  const playbookDependencies = Array.from(
    new Map(
      (graph[playbookId]?.dependencies || []).map(resource => [
        resource.id,
        resource,
      ])
    ).values()
  )
  const directMembers = await getDirectMembers(playbookId)
  const unsupportedContent = await getUnsupportedContent(playbookId)

  const typeByResourceId = new Map(
    playbookDependencies.map(resource => [resource.id, resource.type])
  )
  const docsToExport = playbookDependencies.map(resource => resource.id)
  const exportedDocs = docsToExport.length
    ? await context.getWorkspaceDB().getMultiple<AnyDocument>(docsToExport, {
        allowMissing: false,
      })
    : []

  const dependencyIndex: PlaybookPackageDependencyIndex = {
    rootPlaybookId: playbookId,
    directMembers,
    resources: {
      [playbookId]: graph[playbookId] || { dependencies: [] },
      ...Object.fromEntries(
        docsToExport.filter(id => !!graph[id]).map(id => [id, graph[id]])
      ),
    },
  }

  const manifest = buildManifest(
    playbook,
    workspaceId,
    playbookDependencies,
    unsupportedContent
  )

  const tmpPath = await fsp.mkdtemp(join(budibaseTempDir(), "playbook-export-"))
  await writeJsonFile(join(tmpPath, PLAYBOOK_MANIFEST_FILE), manifest)
  await writeJsonFile(
    join(tmpPath, PLAYBOOK_FILE),
    sanitizePlaybookForExport(playbook)
  )
  await writeJsonFile(
    join(tmpPath, PLAYBOOK_DEPENDENCY_INDEX_FILE),
    dependencyIndex
  )
  await fsp.mkdir(join(tmpPath, PLAYBOOK_DOCS_DIRECTORY), { recursive: true })

  for (const doc of exportedDocs) {
    const type = typeByResourceId.get(doc._id!)
    if (!type) {
      continue
    }

    const sanitized = await sanitizeDocumentForExport(doc, type)
    await writeJsonFile(
      join(
        tmpPath,
        PLAYBOOK_DOCS_DIRECTORY,
        getExportDirectoryName(type),
        `${doc._id}.json`
      ),
      sanitized
    )
  }

  if (opts?.encryptPassword) {
    await encryptDirectory(tmpPath, opts.encryptPassword)
  }

  const tarPath = await tarFilesToTmp(tmpPath, await fsp.readdir(tmpPath))
  await fsp.rm(tmpPath, { recursive: true, force: true })
  return tarPath
}

export async function streamExportPlaybook({
  playbookId,
  encryptPassword,
}: {
  playbookId: string
  encryptPassword?: string
}) {
  const tmpPath = await exportPlaybook(playbookId, {
    encryptPassword,
  })
  return streamFile(tmpPath)
}
