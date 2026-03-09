import { context, encryption } from "@budibase/backend-core"
import {
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
  const [datasources, tables, queries, automations, workspaceApps] =
    await Promise.all([
      sdk.datasources.fetch(),
      sdk.tables.getAllTables(),
      sdk.queries.fetch(),
      sdk.automations.fetch(),
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
  const assignedAgents = agents.filter(agent => agent.playbookId === playbookId)
  if (!assignedAgents.length) {
    return []
  }

  return [
    {
      type: "agent",
      count: assignedAgents.length,
      reason:
        "Agents are not included in the first portable Playbook export format.",
    },
  ]
}

async function sanitizeDocumentForExport(doc: AnyDocument, type: ResourceType) {
  const sanitized = structuredClone(doc)
  delete sanitized._rev

  if (type === ResourceType.DATASOURCE) {
    return await sdk.datasources.removeSecretSingle(sanitized as Datasource)
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
    requiresSecrets: !!resourcesByType[ResourceType.DATASOURCE],
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
