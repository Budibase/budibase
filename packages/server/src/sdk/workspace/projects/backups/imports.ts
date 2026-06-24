import { context, docIds, HTTPError, utils } from "@budibase/backend-core"
import {
  Agent,
  AnyDocument,
  Datasource,
  DocumentType,
  ImportProjectResponse,
  Project,
  ProjectImportRequirement,
  ProjectPackageDependencyIndex,
  ProjectPackageManifest,
  ResourceType,
  RowActionPermissions,
  TableRowActions,
  SEPARATOR,
  VirtualDocumentType,
  prefixed,
} from "@budibase/types"
import fs from "fs"
import fsp from "fs/promises"
import { basename, join, relative } from "path"
import { Writable } from "stream"
import { pipeline } from "stream/promises"
import * as tar from "tar"
import {
  extractTableIdFromRowActionsID,
  generateAutomationID,
  generateDatasourceID,
  generateQueryID,
  generateRowActionsID,
  generateScreenID,
  generateTableID,
} from "../../../../db/utils"
import { isExternalTableID } from "../../../../integrations/utils"
import { decryptFiles, untarFile } from "../../backups/imports"
import sdk from "../../.."
import {
  PROJECT_DEPENDENCY_INDEX_FILE,
  PROJECT_DOCS_DIRECTORY,
  PROJECT_EXPORT_FORMAT_VERSION,
  PROJECT_FILE,
  PROJECT_MANIFEST_FILE,
} from "./constants"
import { getProjectIds } from "../utils"

const IMPORT_ORDER: ResourceType[] = [
  ResourceType.AGENT,
  ResourceType.DATASOURCE,
  ResourceType.TABLE,
  ResourceType.QUERY,
  ResourceType.AUTOMATION,
  ResourceType.ROW_ACTION,
  ResourceType.WORKSPACE_APP,
  ResourceType.SCREEN,
]

const ALLOWED_IMPORT_TYPES = new Set(IMPORT_ORDER)

const isAllowedImportType = (value: unknown): value is ResourceType =>
  typeof value === "string" && IMPORT_ORDER.some(type => type === value)

const MAX_ARCHIVE_SIZE_BYTES = 50 * 1024 * 1024
const MAX_EXTRACTED_SIZE_BYTES = 100 * 1024 * 1024
const MAX_PACKAGE_FILES = 2000
const MAX_PACKAGE_DOCS = 1000
const MAX_PATH_SEGMENTS = 4
const MAX_ENCRYPT_PASSWORD_LENGTH = 1024

const PREASSIGNED_IMPORT_TYPES: ResourceType[] = [
  ResourceType.AGENT,
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

interface ExtractedProjectPackage {
  tmpPath: string
  manifest: ProjectPackageManifest
  project: Project
  dependencyIndex: ProjectPackageDependencyIndex
  docs: ImportedDoc[]
}

interface InsertedDocRef {
  _id: string
  _rev: string
}

interface ProjectPackageTarEntry {
  path: string
  type?: string
  size?: number
  resume?: () => void
}

const readJsonFile = async <T>(filePath: string): Promise<T> => {
  try {
    return JSON.parse(await fsp.readFile(filePath, "utf8"))
  } catch {
    throw new HTTPError(
      `Project package contains invalid JSON in '${basename(filePath)}'.`,
      400
    )
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const isSafeArchivePath = (path: string) => {
  const segments = path.split(/[\\/]/)
  return (
    !path.startsWith("/") &&
    !path.startsWith("\\") &&
    !/^[A-Za-z]:/.test(path) &&
    segments.every(segment => segment !== ".." && segment !== ".")
  )
}

const readDirectoryRecursively = async (
  dirPath: string,
  rootPath = dirPath,
  totals = { files: 0, bytes: 0 }
): Promise<string[]> => {
  const entries = await fsp.readdir(dirPath, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    const relPath = relative(rootPath, fullPath)
    if (!isSafeArchivePath(relPath)) {
      throw new HTTPError("Project package contains unsafe paths.", 400)
    }
    if (relPath.split(/[\\/]/).length > MAX_PATH_SEGMENTS) {
      throw new HTTPError(
        "Project package contains paths that are too deep.",
        400
      )
    }
    if (entry.isSymbolicLink()) {
      throw new HTTPError("Project package contains unsupported links.", 400)
    }
    if (entry.isDirectory()) {
      files.push(
        ...(await readDirectoryRecursively(fullPath, rootPath, totals))
      )
    } else {
      const stats = await fsp.stat(fullPath)
      totals.files += 1
      totals.bytes += stats.size
      if (totals.files > MAX_PACKAGE_FILES) {
        throw new HTTPError("Project package contains too many files.", 400)
      }
      if (totals.bytes > MAX_EXTRACTED_SIZE_BYTES) {
        throw new HTTPError("Project package is too large.", 400)
      }
      files.push(fullPath)
    }
  }

  return files
}

const validateProjectPackageBeforeExtraction = async (file: {
  path: string
}) => {
  const totals = { files: 0, bytes: 0 }
  const fileTypes = new Set(["File", "OldFile", "ContiguousFile"])
  const directoryTypes = new Set(["Directory", "GNUDumpDir"])
  const linkTypes = new Set(["Link", "SymbolicLink"])
  const stream = fs.createReadStream(file.path)
  let validationError: HTTPError | undefined

  const fail = (error: HTTPError) => {
    validationError = error
    stream.destroy(error)
  }

  const parser = new tar.Parser({
    onReadEntry: (entry: ProjectPackageTarEntry) => {
      if (validationError) {
        return
      }
      if (!isSafeArchivePath(entry.path)) {
        fail(new HTTPError("Project package contains unsafe paths.", 400))
        return
      }
      if (
        entry.path.split(/[\\/]/).filter(Boolean).length > MAX_PATH_SEGMENTS
      ) {
        fail(
          new HTTPError(
            "Project package contains paths that are too deep.",
            400
          )
        )
        return
      }
      if (entry.type && linkTypes.has(entry.type)) {
        fail(new HTTPError("Project package contains unsupported links.", 400))
        return
      }
      if (
        entry.type &&
        !fileTypes.has(entry.type) &&
        !directoryTypes.has(entry.type)
      ) {
        fail(
          new HTTPError("Project package contains unsupported entries.", 400)
        )
        return
      }
      if (!entry.type || fileTypes.has(entry.type)) {
        totals.files += 1
        totals.bytes += entry.size || 0
        if (totals.files > MAX_PACKAGE_FILES) {
          fail(new HTTPError("Project package contains too many files.", 400))
          return
        }
        if (totals.bytes > MAX_EXTRACTED_SIZE_BYTES) {
          fail(new HTTPError("Project package is too large.", 400))
          return
        }
      }
      entry.resume?.()
    },
  })

  try {
    await pipeline(stream, parser as unknown as Writable)
  } catch (err) {
    throw validationError || err
  }
}

const getResourceTypeForDocPath = (
  tmpPath: string,
  filePath: string
): ResourceType => {
  const relPath = relative(tmpPath, filePath)
  const pathParts = relPath.split(/[\\/]/)
  const [docsDirectory, resourceType] = pathParts
  if (
    docsDirectory !== PROJECT_DOCS_DIRECTORY ||
    pathParts.length !== 3 ||
    !relPath.endsWith(".json")
  ) {
    throw new HTTPError(`Unsupported Project doc path '${relPath}'.`, 400)
  }
  if (
    !resourceType ||
    !ALLOWED_IMPORT_TYPES.has(resourceType as ResourceType)
  ) {
    throw new HTTPError(`Unsupported Project doc path '${relPath}'.`, 400)
  }
  return resourceType as ResourceType
}

const RESOURCE_ID_PREFIXES: Record<ResourceType, string[]> = {
  [ResourceType.PROJECT]: [prefixed(DocumentType.PROJECT)],
  [ResourceType.AGENT]: [prefixed(DocumentType.AGENT)],
  [ResourceType.DATASOURCE]: [
    prefixed(DocumentType.DATASOURCE),
    prefixed(DocumentType.DATASOURCE_PLUS),
  ],
  [ResourceType.TABLE]: [prefixed(DocumentType.TABLE)],
  [ResourceType.ROW_ACTION]: [prefixed(DocumentType.ROW_ACTIONS)],
  [ResourceType.QUERY]: [prefixed(DocumentType.QUERY)],
  [ResourceType.AUTOMATION]: [prefixed(DocumentType.AUTOMATION)],
  [ResourceType.WORKSPACE_APP]: [prefixed(DocumentType.WORKSPACE_APP)],
  [ResourceType.SCREEN]: [prefixed(DocumentType.SCREEN)],
}

const validateDocMatchesPath = (importedDoc: ImportedDoc) => {
  const id = importedDoc.doc._id
  if (!id) {
    throw new HTTPError("Project package contains a doc without an id.", 400)
  }

  const expectedFileName = `${id}.json`
  if (basename(importedDoc.path) !== expectedFileName) {
    throw new HTTPError(`Project package doc path does not match '${id}'.`, 400)
  }

  const validPrefixes = RESOURCE_ID_PREFIXES[importedDoc.resourceType]
  if (!validPrefixes.some(prefix => id.startsWith(prefix))) {
    throw new HTTPError(
      `Project package doc '${id}' does not match resource type '${importedDoc.resourceType}'.`,
      400
    )
  }
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

type IdMapping = [string, string]

const remapValue = (
  value: unknown,
  idMap: Map<string, string>,
  mappings: IdMapping[] = [...idMap.entries()].sort(
    ([a], [b]) => b.length - a.length
  )
): unknown => {
  if (typeof value === "string") {
    const exact = idMap.get(value)
    if (exact) {
      return exact
    }
    return mappings.reduce(
      (remapped, [sourceId, destinationId]) =>
        remapped.split(sourceId).join(destinationId),
      value
    )
  }
  if (Array.isArray(value)) {
    return value.map(item => remapValue(item, idMap, mappings))
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        remapValue(nestedValue, idMap, mappings),
      ])
    )
  }
  return value
}

const sanitizeImportedProjectAssignments = (
  doc: AnyDocument,
  resourceType: ResourceType,
  importedProjectId: string
) => {
  if (getProjectIds(doc).includes(importedProjectId)) {
    doc.projectIds = [importedProjectId]
  } else {
    delete doc.projectIds
  }

  if (resourceType !== ResourceType.DATASOURCE) {
    return
  }

  const datasource = doc as Datasource
  if (!datasource.entities) {
    return
  }

  datasource.entities = Object.fromEntries(
    Object.entries(datasource.entities).map(([key, entity]) => {
      const sanitizedEntity = { ...entity }
      if (getProjectIds(sanitizedEntity).includes(importedProjectId)) {
        sanitizedEntity.projectIds = [importedProjectId]
      } else {
        delete sanitizedEntity.projectIds
      }
      return [key, sanitizedEntity]
    })
  )
}

const sanitizeImportedDoc = (
  doc: AnyDocument,
  resourceType: ResourceType,
  idMap: Map<string, string>,
  workspaceId: string,
  importedProjectId: string
): AnyDocument => {
  const remapped = remapValue(structuredClone(doc), idMap) as AnyDocument
  delete remapped._rev

  if (resourceType === ResourceType.ROW_ACTION) {
    const rowActions = remapped as TableRowActions
    rowActions.actions = Object.fromEntries(
      Object.entries((doc as TableRowActions).actions || {}).map(
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
    sanitizeImportedProjectAssignments(
      rowActions,
      resourceType,
      importedProjectId
    )
    return rowActions
  }

  if (resourceType === ResourceType.AUTOMATION) {
    remapped.appId = workspaceId
    remapped.disabled = true
  }

  if (resourceType === ResourceType.AGENT) {
    remapped.live = false
  }

  if (resourceType === ResourceType.WORKSPACE_APP) {
    remapped.disabled = true
    remapped.isDefault = false
  }

  sanitizeImportedProjectAssignments(remapped, resourceType, importedProjectId)
  return remapped
}

const generateImportedId = (
  resourceType: ResourceType,
  doc: AnyDocument,
  idMap: Map<string, string>
) => {
  switch (resourceType) {
    case ResourceType.AGENT:
      return docIds.generateAgentID()
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
          `Project import could not remap datasource for query '${doc._id}'.`,
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
          `Project import could not remap table for row actions '${doc._id}'.`,
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
        `Project import does not support resource type '${resourceType}'.`,
        400
      )
  }
}

const validateManifest = (manifest: ProjectPackageManifest) => {
  if (!isRecord(manifest)) {
    throw new HTTPError("Project package manifest is invalid.", 400)
  }
  if (manifest.artifactType !== "project") {
    throw new HTTPError("Supplied file is not a Project package.", 400)
  }
  if (manifest.formatVersion !== PROJECT_EXPORT_FORMAT_VERSION) {
    throw new HTTPError(
      `Unsupported Project package format version '${manifest.formatVersion}'.`,
      400
    )
  }
  if (
    !Array.isArray(manifest.supportedImportModes) ||
    !manifest.supportedImportModes.includes("additiveImport")
  ) {
    throw new HTTPError(
      "Project package does not support additive import.",
      400
    )
  }
  if (
    !isRecord(manifest.sourceWorkspace) ||
    typeof manifest.sourceWorkspace.id !== "string" ||
    !isRecord(manifest.resourcesByType) ||
    !Array.isArray(manifest.unsupportedContent)
  ) {
    throw new HTTPError("Project package manifest is invalid.", 400)
  }
  for (const count of Object.values(manifest.resourcesByType)) {
    if (!Number.isInteger(count) || Number(count) < 0) {
      throw new HTTPError("Project package manifest is invalid.", 400)
    }
  }
  for (const unsupported of manifest.unsupportedContent) {
    if (
      !isRecord(unsupported) ||
      typeof unsupported.type !== "string" ||
      !Number.isInteger(unsupported.count) ||
      Number(unsupported.count) < 0 ||
      typeof unsupported.reason !== "string"
    ) {
      throw new HTTPError("Project package manifest is invalid.", 400)
    }
  }
}

const validateProject = (project: Project) => {
  if (
    !isRecord(project) ||
    typeof project._id !== "string" ||
    typeof project.name !== "string"
  ) {
    throw new HTTPError("Project package project.json is invalid.", 400)
  }
}

const validateUsedResource = (value: unknown) => {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isAllowedImportType(value.type) &&
    ALLOWED_IMPORT_TYPES.has(value.type)
  )
}

const validateDependencyIndexShape = (
  dependencyIndex: ProjectPackageDependencyIndex
) => {
  if (
    !isRecord(dependencyIndex) ||
    typeof dependencyIndex.rootProjectId !== "string" ||
    !Array.isArray(dependencyIndex.directMembers) ||
    !dependencyIndex.directMembers.every(validateUsedResource) ||
    !isRecord(dependencyIndex.resources)
  ) {
    throw new HTTPError("Project package dependency index is invalid.", 400)
  }

  for (const resource of Object.values(dependencyIndex.resources)) {
    if (
      !isRecord(resource) ||
      !Array.isArray(resource.dependencies) ||
      !resource.dependencies.every(validateUsedResource)
    ) {
      throw new HTTPError("Project package dependency index is invalid.", 400)
    }
  }
}

const validateDependencyIndex = (
  project: Project,
  dependencyIndex: ProjectPackageDependencyIndex,
  docs: ImportedDoc[],
  manifest: ProjectPackageManifest
) => {
  if (dependencyIndex.rootProjectId !== project._id) {
    throw new HTTPError(
      "Project package dependency index does not match project.json.",
      400
    )
  }

  const actualDocIds = new Set(docs.map(doc => doc.doc._id!))
  const expectedDocIds = new Set(
    Object.keys(dependencyIndex.resources).filter(
      id => id !== dependencyIndex.rootProjectId
    )
  )

  if (!dependencyIndex.resources[dependencyIndex.rootProjectId]) {
    throw new HTTPError(
      "Project package docs do not match dependency-index.json.",
      400
    )
  }

  for (const doc of docs) {
    validateDocMatchesPath(doc)
    if (!expectedDocIds.has(doc.doc._id!)) {
      throw new HTTPError(
        "Project package contains docs not listed in dependency-index.json.",
        400
      )
    }
  }

  for (const expectedDocId of expectedDocIds) {
    if (!actualDocIds.has(expectedDocId)) {
      throw new HTTPError(
        "Project package dependency index references missing docs.",
        400
      )
    }
  }

  const reachable = new Set<string>()
  const visit = (id: string) => {
    if (reachable.has(id)) {
      return
    }
    reachable.add(id)
    for (const dependency of dependencyIndex.resources[id]?.dependencies ||
      []) {
      if (dependencyIndex.resources[dependency.id]) {
        visit(dependency.id)
      }
    }
  }
  visit(dependencyIndex.rootProjectId)

  for (const docId of actualDocIds) {
    if (!reachable.has(docId)) {
      throw new HTTPError(
        "Project package contains docs that are not reachable from the root project.",
        400
      )
    }
  }

  if (
    dependencyIndex.directMembers.some(member => !actualDocIds.has(member.id))
  ) {
    throw new HTTPError(
      "Project package docs do not match dependency-index.json.",
      400
    )
  }

  const countedResources = docs.reduce<Partial<Record<ResourceType, number>>>(
    (acc, doc) => {
      acc[doc.resourceType] = (acc[doc.resourceType] || 0) + 1
      return acc
    },
    { [ResourceType.PROJECT]: 1 }
  )

  const resourceTypes = new Set([
    ...Object.keys(countedResources),
    ...Object.keys(manifest.resourcesByType),
  ])

  for (const resourceType of resourceTypes) {
    const actualCount = countedResources[resourceType as ResourceType] || 0
    const expectedCount =
      manifest.resourcesByType[resourceType as ResourceType] || 0
    if (actualCount !== expectedCount) {
      throw new HTTPError(
        `Project package resource count mismatch for '${resourceType}'.`,
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

      if (resourceType === ResourceType.DATASOURCE) {
        const sourceDatasourceId = importedDoc.doc._id!
        const destinationDatasourceId = idMap.get(sourceDatasourceId)!
        const datasource = importedDoc.doc as Datasource
        for (const entity of Object.values(datasource.entities || {})) {
          if (!entity._id || !isExternalTableID(entity._id)) {
            continue
          }
          const externalTablePrefix = `${sourceDatasourceId}__`
          if (!entity._id.startsWith(externalTablePrefix)) {
            throw new HTTPError(
              `Project import could not remap external table '${entity._id}'.`,
              400
            )
          }
          idMap.set(
            entity._id,
            `${destinationDatasourceId}${entity._id.slice(sourceDatasourceId.length)}`
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

  let failedId: string | undefined

  response.forEach((result, index) => {
    if (result.id && result.rev) {
      insertedDocs.push({
        _id: result.id,
        _rev: result.rev,
      })
    }

    if (!failedId && (result.error || !result.id || !result.rev)) {
      failedId = docs[index]._id
    }
  })

  if (failedId) {
    throw new HTTPError(
      `Project import failed while saving '${failedId}'.`,
      400
    )
  }
}

async function extractProjectPackage(
  file: { path: string },
  encryptPassword?: string
): Promise<ExtractedProjectPackage> {
  const fileStats = await fsp.stat(file.path)
  if (fileStats.size > MAX_ARCHIVE_SIZE_BYTES) {
    throw new HTTPError("Project package is too large.", 400)
  }
  if (encryptPassword && encryptPassword.length > MAX_ENCRYPT_PASSWORD_LENGTH) {
    throw new HTTPError("Project package password is too long.", 400)
  }

  await validateProjectPackageBeforeExtraction(file)
  const tmpPath = await untarFile(file)
  try {
    if (encryptPassword) {
      try {
        await decryptFiles(tmpPath, encryptPassword)
      } catch {
        throw new HTTPError("Project package could not be decrypted.", 400)
      }
    }

    const packageFiles = await readDirectoryRecursively(tmpPath)
    const rootEntries = await fsp.readdir(tmpPath)
    if (rootEntries.some(entry => entry.endsWith(".enc")) && !encryptPassword) {
      throw new HTTPError(
        "Files are encrypted but no password has been supplied.",
        400
      )
    }
    if (rootEntries.includes("db.txt")) {
      throw new HTTPError(
        "Workspace exports cannot be imported as Project packages.",
        400
      )
    }
    if (
      rootEntries.some(
        entry =>
          ![
            PROJECT_MANIFEST_FILE,
            PROJECT_FILE,
            PROJECT_DEPENDENCY_INDEX_FILE,
            PROJECT_DOCS_DIRECTORY,
          ].includes(entry)
      )
    ) {
      throw new HTTPError("Project package contains unsupported files.", 400)
    }

    const manifestPath = join(tmpPath, PROJECT_MANIFEST_FILE)
    const projectPath = join(tmpPath, PROJECT_FILE)
    const dependencyIndexPath = join(tmpPath, PROJECT_DEPENDENCY_INDEX_FILE)
    const docsPath = join(tmpPath, PROJECT_DOCS_DIRECTORY)

    await Promise.all([
      fsp.access(manifestPath).catch(() => {
        throw new HTTPError("Project package is missing manifest.json.", 400)
      }),
      fsp.access(projectPath).catch(() => {
        throw new HTTPError("Project package is missing project.json.", 400)
      }),
      fsp.access(dependencyIndexPath).catch(() => {
        throw new HTTPError(
          "Project package is missing dependency-index.json.",
          400
        )
      }),
    ])

    const [manifest, project, dependencyIndex] = await Promise.all([
      readJsonFile<ProjectPackageManifest>(manifestPath),
      readJsonFile<Project>(projectPath),
      readJsonFile<ProjectPackageDependencyIndex>(dependencyIndexPath),
    ])

    validateManifest(manifest)
    validateProject(project)
    validateDependencyIndexShape(dependencyIndex)

    const docFiles = await fsp
      .access(docsPath)
      .then(() =>
        packageFiles.filter(filePath => filePath.startsWith(docsPath))
      )
      .catch(() => [])

    if (docFiles.length > MAX_PACKAGE_DOCS) {
      throw new HTTPError("Project package contains too many docs.", 400)
    }
    if (docFiles.some(filePath => !filePath.endsWith(".json"))) {
      throw new HTTPError(
        "Project package contains unsupported doc files.",
        400
      )
    }

    const docs = await Promise.all(
      docFiles
        .filter(filePath => filePath.endsWith(".json"))
        .map(async filePath => {
          const doc = await readJsonFile<AnyDocument>(filePath)
          if (!isRecord(doc) || typeof doc._id !== "string") {
            throw new HTTPError(
              `Project package contains an invalid doc in '${basename(filePath)}'.`,
              400
            )
          }
          return {
            path: filePath,
            resourceType: getResourceTypeForDocPath(tmpPath, filePath),
            doc,
          }
        })
    )

    validateDependencyIndex(project, dependencyIndex, docs, manifest)

    return {
      tmpPath,
      manifest,
      project,
      dependencyIndex,
      docs,
    }
  } catch (err) {
    await fsp.rm(tmpPath, { recursive: true, force: true })
    throw err
  }
}

const buildRequirements = (docs: ImportedDoc[]): ProjectImportRequirement[] => {
  return docs.flatMap<ProjectImportRequirement>(importedDoc => {
    if (importedDoc.resourceType === ResourceType.DATASOURCE) {
      const doc = importedDoc.doc as Datasource
      return [
        {
          type: "datasource_secrets" as const,
          resourceId: doc._id!,
          name: doc.name || "Unknown",
          reason:
            "Datasource credentials are excluded from Project exports and must be reconfigured after import.",
        },
      ]
    }

    if (importedDoc.resourceType === ResourceType.AGENT) {
      const doc = importedDoc.doc as Agent
      if (
        doc.discordIntegration ||
        doc.slackIntegration ||
        doc.MSTeamsIntegration ||
        doc.telegramIntegration
      ) {
        return [
          {
            type: "agent_secrets" as const,
            resourceId: doc._id!,
            name: doc.name || "Unknown",
            reason:
              "Agent integration secrets are excluded from Project exports and must be reconfigured after import.",
          },
        ]
      }
    }

    return []
  })
}

export async function importProject(
  file: { path: string },
  opts?: { encryptPassword?: string }
): Promise<ImportProjectResponse> {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    throw new Error("Could not determine workspace for Project import")
  }

  const extracted = await extractProjectPackage(file, opts?.encryptPassword)
  const insertedDocs: InsertedDocRef[] = []
  let importedProject: Project | undefined
  try {
    importedProject = await sdk.projects.create({
      name: extracted.project.name,
      description: extracted.project.description,
      color: extracted.project.color,
    })
    const importedProjectId = importedProject._id!

    const idMap = new Map<string, string>([
      [extracted.project._id!, importedProjectId],
      [extracted.manifest.sourceWorkspace.id, workspaceId],
    ])

    assignImportedIds(extracted.docs, idMap)

    const resources: Partial<Record<ResourceType, string[]>> = {
      [ResourceType.PROJECT]: [importedProject._id!],
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
            workspaceId,
            importedProjectId
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
      project: {
        _id: importedProject._id!,
        _rev: importedProject._rev!,
        name: importedProject.name,
        description: importedProject.description,
        color: importedProject.color,
        createdAt: String(importedProject.createdAt),
        updatedAt: importedProject.updatedAt,
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
    if (importedProject?._id && importedProject._rev) {
      await context
        .getWorkspaceDB()
        .remove(importedProject._id, importedProject._rev)
        .catch(() => {})
    }
    throw err
  } finally {
    await fsp.rm(extracted.tmpPath, { recursive: true, force: true })
  }
}
