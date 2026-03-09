import { context, docIds, HTTPError, utils } from "@budibase/backend-core"
import {
  AnyDocument,
  Datasource,
  DocumentType,
  ImportPlaybookResponse,
  Playbook,
  PlaybookImportRequirement,
  PlaybookPackageDependencyIndex,
  PlaybookPackageManifest,
  ResourceType,
  RowActionPermissions,
  TableRowActions,
  SEPARATOR,
  VirtualDocumentType,
  prefixed,
} from "@budibase/types"
import fsp from "fs/promises"
import { join, relative } from "path"
import {
  extractTableIdFromRowActionsID,
  generateAutomationID,
  generateDatasourceID,
  generateQueryID,
  generateRowActionsID,
  generateScreenID,
  generateTableID,
} from "../../../../db/utils"
import { decryptFiles, untarFile } from "../../backups/imports"
import sdk from "../../.."
import {
  PLAYBOOK_DEPENDENCY_INDEX_FILE,
  PLAYBOOK_DOCS_DIRECTORY,
  PLAYBOOK_EXPORT_FORMAT_VERSION,
  PLAYBOOK_FILE,
  PLAYBOOK_MANIFEST_FILE,
} from "./constants"

const IMPORT_ORDER: ResourceType[] = [
  ResourceType.DATASOURCE,
  ResourceType.TABLE,
  ResourceType.QUERY,
  ResourceType.AUTOMATION,
  ResourceType.ROW_ACTION,
  ResourceType.WORKSPACE_APP,
  ResourceType.SCREEN,
]

const PREASSIGNED_IMPORT_TYPES: ResourceType[] = [
  ResourceType.DATASOURCE,
  ResourceType.TABLE,
  ResourceType.AUTOMATION,
  ResourceType.ROW_ACTION,
  ResourceType.WORKSPACE_APP,
  ResourceType.SCREEN,
  ResourceType.QUERY,
]

interface ImportedDoc {
  resourceType: ResourceType
  path: string
  doc: AnyDocument
}

interface ExtractedPlaybookPackage {
  tmpPath: string
  manifest: PlaybookPackageManifest
  playbook: Playbook
  dependencyIndex: PlaybookPackageDependencyIndex
  docs: ImportedDoc[]
}

interface InsertedDocRef {
  _id: string
  _rev: string
}

const readJsonFile = async <T>(filePath: string): Promise<T> => {
  return JSON.parse(await fsp.readFile(filePath, "utf8"))
}

const readDirectoryRecursively = async (dirPath: string): Promise<string[]> => {
  const entries = await fsp.readdir(dirPath, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await readDirectoryRecursively(fullPath)))
    } else {
      files.push(fullPath)
    }
  }

  return files
}

const getResourceTypeForDocPath = (
  tmpPath: string,
  filePath: string
): ResourceType => {
  const relPath = relative(tmpPath, filePath)
  const [, resourceType] = relPath.split("/")
  if (
    !resourceType ||
    !Object.values(ResourceType).includes(resourceType as ResourceType)
  ) {
    throw new HTTPError(`Unsupported Playbook doc path '${relPath}'.`, 400)
  }
  return resourceType as ResourceType
}

const remapObjectKeys = <T>(
  value: Record<string, T>,
  idMap: Map<string, string>
) => {
  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      idMap.get(key) || key,
      nestedValue,
    ])
  )
}

const remapValue = (value: unknown, idMap: Map<string, string>): unknown => {
  if (typeof value === "string") {
    return idMap.get(value) || value
  }
  if (Array.isArray(value)) {
    return value.map(item => remapValue(item, idMap))
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        remapValue(nestedValue, idMap),
      ])
    )
  }
  return value
}

const sanitizeImportedDoc = (
  doc: AnyDocument,
  resourceType: ResourceType,
  idMap: Map<string, string>,
  workspaceId: string
): AnyDocument => {
  const remapped = remapValue(structuredClone(doc), idMap) as AnyDocument
  delete remapped._rev

  if (resourceType === ResourceType.ROW_ACTION) {
    const rowActions = remapped as TableRowActions
    rowActions.actions = Object.fromEntries(
      Object.entries((doc as TableRowActions).actions).map(
        ([actionId, action]) => {
          const permissions = (action.permissions || {
            table: { runAllowed: true },
            views: {},
          }) as RowActionPermissions
          return [
            idMap.get(actionId) || actionId,
            {
              ...(remapValue(action, idMap) as typeof action),
              permissions: {
                ...permissions,
                views: remapObjectKeys<RowActionPermissions["views"][string]>(
                  permissions.views || {},
                  idMap
                ),
              },
            },
          ]
        }
      )
    )
    return rowActions
  }

  if (resourceType === ResourceType.AUTOMATION) {
    remapped.appId = workspaceId
    remapped.disabled = true
  }

  if (resourceType === ResourceType.WORKSPACE_APP) {
    remapped.disabled = true
    remapped.isDefault = false
  }

  return remapped
}

const generateImportedId = (
  resourceType: ResourceType,
  doc: AnyDocument,
  idMap: Map<string, string>
) => {
  switch (resourceType) {
    case ResourceType.DATASOURCE:
      return generateDatasourceID({
        plus: !!doc._id?.startsWith(prefixed(DocumentType.DATASOURCE_PLUS)),
      })
    case ResourceType.TABLE:
      return generateTableID()
    case ResourceType.QUERY: {
      const datasourceId = doc.datasourceId && idMap.get(doc.datasourceId)
      if (!datasourceId) {
        throw new HTTPError(
          `Playbook import could not remap datasource for query '${doc._id}'.`,
          400
        )
      }
      return generateQueryID(datasourceId)
    }
    case ResourceType.AUTOMATION:
      return generateAutomationID()
    case ResourceType.ROW_ACTION: {
      const tableId = idMap.get(extractTableIdFromRowActionsID(doc._id!))
      if (!tableId) {
        throw new HTTPError(
          `Playbook import could not remap table for row actions '${doc._id}'.`,
          400
        )
      }
      return generateRowActionsID(tableId)
    }
    case ResourceType.WORKSPACE_APP:
      return docIds.generateWorkspaceAppID()
    case ResourceType.SCREEN:
      return generateScreenID()
    default:
      throw new HTTPError(
        `Playbook import does not support resource type '${resourceType}'.`,
        400
      )
  }
}

const validateManifest = (manifest: PlaybookPackageManifest) => {
  if (manifest.artifactType !== "playbook") {
    throw new HTTPError("Supplied file is not a Playbook package.", 400)
  }
  if (manifest.formatVersion !== PLAYBOOK_EXPORT_FORMAT_VERSION) {
    throw new HTTPError(
      `Unsupported Playbook package format version '${manifest.formatVersion}'.`,
      400
    )
  }
  if (!manifest.supportedImportModes.includes("additiveImport")) {
    throw new HTTPError(
      "Playbook package does not support additive import.",
      400
    )
  }
}

const validateDependencyIndex = (
  playbook: Playbook,
  dependencyIndex: PlaybookPackageDependencyIndex,
  docs: ImportedDoc[],
  manifest: PlaybookPackageManifest
) => {
  if (dependencyIndex.rootPlaybookId !== playbook._id) {
    throw new HTTPError(
      "Playbook package dependency index does not match playbook.json.",
      400
    )
  }

  const actualDocIds = new Set(docs.map(doc => doc.doc._id!))

  if (!dependencyIndex.resources[dependencyIndex.rootPlaybookId]) {
    throw new HTTPError(
      "Playbook package docs do not match dependency-index.json.",
      400
    )
  }

  if (
    dependencyIndex.directMembers.some(member => !actualDocIds.has(member.id))
  ) {
    throw new HTTPError(
      "Playbook package docs do not match dependency-index.json.",
      400
    )
  }

  const countedResources = docs.reduce<Partial<Record<ResourceType, number>>>(
    (acc, doc) => {
      acc[doc.resourceType] = (acc[doc.resourceType] || 0) + 1
      return acc
    },
    { [ResourceType.PLAYBOOK]: 1 }
  )

  for (const [resourceType, count] of Object.entries(
    manifest.resourcesByType
  )) {
    if ((countedResources[resourceType as ResourceType] || 0) !== count) {
      throw new HTTPError(
        `Playbook package resource count mismatch for '${resourceType}'.`,
        400
      )
    }
  }
}

const assignImportedIds = (docs: ImportedDoc[], idMap: Map<string, string>) => {
  for (const resourceType of PREASSIGNED_IMPORT_TYPES) {
    for (const importedDoc of docs.filter(
      doc => doc.resourceType === resourceType
    )) {
      idMap.set(
        importedDoc.doc._id!,
        generateImportedId(resourceType, importedDoc.doc, idMap)
      )

      if (resourceType === ResourceType.ROW_ACTION) {
        for (const actionId of Object.keys(
          (importedDoc.doc as TableRowActions).actions || {}
        )) {
          idMap.set(
            actionId,
            `${VirtualDocumentType.ROW_ACTION}${SEPARATOR}${utils.newid()}`
          )
        }
      }
    }
  }
}

const bulkInsertDocs = async (
  docs: AnyDocument[],
  insertedDocs: InsertedDocRef[]
) => {
  const response = (await context.getWorkspaceDB().bulkDocs(docs)) as Array<{
    id?: string
    rev?: string
    error?: string
  }>

  response.forEach((result, index) => {
    if (result.error || !result.id || !result.rev) {
      throw new HTTPError(
        `Playbook import failed while saving '${docs[index]._id}'.`,
        400
      )
    }
    insertedDocs.push({
      _id: result.id,
      _rev: result.rev,
    })
  })
}

async function extractPlaybookPackage(
  file: { path: string },
  encryptPassword?: string
): Promise<ExtractedPlaybookPackage> {
  const tmpPath = await untarFile(file)
  try {
    if (encryptPassword) {
      await decryptFiles(tmpPath, encryptPassword)
    }

    const rootEntries = await fsp.readdir(tmpPath)
    if (rootEntries.some(entry => entry.endsWith(".enc")) && !encryptPassword) {
      throw new HTTPError(
        "Files are encrypted but no password has been supplied.",
        400
      )
    }
    if (rootEntries.includes("db.txt")) {
      throw new HTTPError(
        "Workspace exports cannot be imported as Playbook packages.",
        400
      )
    }

    const manifestPath = join(tmpPath, PLAYBOOK_MANIFEST_FILE)
    const playbookPath = join(tmpPath, PLAYBOOK_FILE)
    const dependencyIndexPath = join(tmpPath, PLAYBOOK_DEPENDENCY_INDEX_FILE)
    const docsPath = join(tmpPath, PLAYBOOK_DOCS_DIRECTORY)

    await Promise.all([
      fsp.access(manifestPath).catch(() => {
        throw new HTTPError("Playbook package is missing manifest.json.", 400)
      }),
      fsp.access(playbookPath).catch(() => {
        throw new HTTPError("Playbook package is missing playbook.json.", 400)
      }),
      fsp.access(dependencyIndexPath).catch(() => {
        throw new HTTPError(
          "Playbook package is missing dependency-index.json.",
          400
        )
      }),
    ])

    const [manifest, playbook, dependencyIndex] = await Promise.all([
      readJsonFile<PlaybookPackageManifest>(manifestPath),
      readJsonFile<Playbook>(playbookPath),
      readJsonFile<PlaybookPackageDependencyIndex>(dependencyIndexPath),
    ])

    const docFiles = await fsp
      .access(docsPath)
      .then(() => readDirectoryRecursively(docsPath))
      .catch(() => [])

    validateManifest(manifest)

    const docs = await Promise.all(
      docFiles
        .filter(filePath => filePath.endsWith(".json"))
        .map(async filePath => ({
          path: filePath,
          resourceType: getResourceTypeForDocPath(tmpPath, filePath),
          doc: await readJsonFile<AnyDocument>(filePath),
        }))
    )

    validateDependencyIndex(playbook, dependencyIndex, docs, manifest)

    return {
      tmpPath,
      manifest,
      playbook,
      dependencyIndex,
      docs,
    }
  } catch (err) {
    await fsp.rm(tmpPath, { recursive: true, force: true })
    throw err
  }
}

const buildRequirements = (
  docs: ImportedDoc[]
): PlaybookImportRequirement[] => {
  return docs
    .filter(
      (doc): doc is ImportedDoc & { doc: Datasource } =>
        doc.resourceType === ResourceType.DATASOURCE
    )
    .map(({ doc }) => ({
      type: "datasource_secrets",
      resourceId: doc._id!,
      name: doc.name || "Unknown",
      reason:
        "Datasource credentials are excluded from Playbook exports and must be reconfigured after import.",
    }))
}

export async function importPlaybook(
  file: { path: string },
  opts?: { encryptPassword?: string }
): Promise<ImportPlaybookResponse> {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Could not determine workspace for Playbook import")
  }

  const extracted = await extractPlaybookPackage(file, opts?.encryptPassword)
  const insertedDocs: InsertedDocRef[] = []
  let importedPlaybook: Playbook | undefined
  try {
    importedPlaybook = await sdk.playbooks.create({
      name: extracted.playbook.name,
      description: extracted.playbook.description,
      color: extracted.playbook.color,
    })

    const idMap = new Map<string, string>([
      [extracted.playbook._id!, importedPlaybook._id!],
    ])

    assignImportedIds(extracted.docs, idMap)

    const resources: Partial<Record<ResourceType, string[]>> = {
      [ResourceType.PLAYBOOK]: [importedPlaybook._id!],
    }

    for (const resourceType of IMPORT_ORDER) {
      const docsToInsert = extracted.docs
        .filter(doc => doc.resourceType === resourceType)
        .map(({ doc }) => {
          const newId = idMap.get(doc._id!)
          const remappedDoc = sanitizeImportedDoc(
            { ...doc, _id: newId },
            resourceType,
            idMap,
            workspaceId
          )
          return remappedDoc
        })

      if (!docsToInsert.length) {
        continue
      }

      await bulkInsertDocs(docsToInsert, insertedDocs)
      resources[resourceType] = docsToInsert.map(doc => doc._id!)
    }

    const requirements = buildRequirements(extracted.docs).map(requirement => ({
      ...requirement,
      resourceId: idMap.get(requirement.resourceId) || requirement.resourceId,
    }))

    return {
      playbook: {
        _id: importedPlaybook._id!,
        _rev: importedPlaybook._rev!,
        name: importedPlaybook.name,
        description: importedPlaybook.description,
        color: importedPlaybook.color,
        createdAt: String(importedPlaybook.createdAt),
        updatedAt: importedPlaybook.updatedAt,
      },
      resources,
      unsupportedContent: extracted.manifest.unsupportedContent,
      requirements,
    }
  } catch (err) {
    if (insertedDocs.length) {
      await context.getWorkspaceDB().bulkRemove(insertedDocs, {
        silenceErrors: true,
      })
    }
    if (importedPlaybook?._id && importedPlaybook._rev) {
      await context
        .getWorkspaceDB()
        .remove(importedPlaybook._id, importedPlaybook._rev)
        .catch(() => {})
    }
    throw err
  } finally {
    await fsp.rm(extracted.tmpPath, { recursive: true, force: true })
  }
}
