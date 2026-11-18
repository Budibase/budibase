import {
  db as dbCore,
  docIds,
  encryption,
  objectStore,
} from "@budibase/backend-core"
import { ImportWorkspaceFn } from "@budibase/pro"
import { utils } from "@budibase/shared-core"
import {
  Automation,
  AutomationTriggerStepId,
  BUDIBASE_AI_PROVIDER_ID,
  CustomAIProviderConfig,
  Agent,
  Database,
  DocumentType,
  FieldType,
  GeminiKnowledgeBase,
  KnowledgeBaseFile,
  LiteLLMKeyConfig,
  Row,
  RowAttachment,
  RowValue,
  RuntimeDocumentTypes,
  WebhookTriggerInputs,
} from "@budibase/types"
import fs from "fs"
import fsp from "fs/promises"
import { join } from "path"
import * as tar from "tar"
import { v4 as uuid } from "uuid"
import sdk from "../.."
import { ObjectStoreBuckets } from "../../../constants"
import environment from "../../../environment"
import { getAutomationParams } from "../../../db/utils"
import { budibaseTempDir } from "../../../utilities/budibaseDir"
import { downloadTemplate } from "../../../utilities/fileSystem"
import {
  ATTACHMENT_DIRECTORY,
  DB_EXPORT_FILE,
  GLOBAL_DB_EXPORT_FILE,
  IMPORT_PENDING_LITELLM_MODEL_ID,
} from "./constants"

type TemplateType = {
  file?: {
    type?: string
    path: string
    password?: string
  }
  key?: string
}

function rewriteAttachmentUrl(appId: string, attachment: RowAttachment) {
  // URL looks like: /prod-budi-app-assets/appId/attachments/file.csv
  const urlParts = attachment.key?.split("/") || []
  // remove the app ID
  urlParts.shift()
  // add new app ID
  urlParts.unshift(appId)
  const key = urlParts.join("/")
  return {
    ...attachment,
    key,
    url: "", // calculated on retrieval using key
  }
}

export async function updateAttachmentColumns(prodAppId: string, db: Database) {
  // iterate through attachment documents and update them
  const tables = await sdk.tables.getAllInternalTables(db)
  let updatedRows: Row[] = []
  for (let table of tables) {
    const { rows, columns } = await sdk.rows.getRowsWithAttachments(
      db.name,
      table
    )
    updatedRows = updatedRows.concat(
      rows.map(row => {
        for (let column of columns) {
          const columnType = table.schema[column].type
          if (
            columnType === FieldType.ATTACHMENTS &&
            Array.isArray(row[column])
          ) {
            row[column] = row[column].map((attachment: RowAttachment) =>
              rewriteAttachmentUrl(prodAppId, attachment)
            )
          } else if (
            (columnType === FieldType.ATTACHMENT_SINGLE ||
              columnType === FieldType.SIGNATURE_SINGLE) &&
            row[column]
          ) {
            row[column] = rewriteAttachmentUrl(prodAppId, row[column])
          }
        }
        return row
      })
    )
  }
  // write back the updated attachments
  await db.bulkDocs(updatedRows)
}

async function updateAutomations(prodAppId: string, db: Database) {
  const automations = (
    await db.allDocs(
      getAutomationParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc) as Automation[]
  const devId = dbCore.getDevWorkspaceID(prodAppId)
  let toSave: Automation[] = []
  for (let automation of automations) {
    const oldDevAppId = automation.appId,
      oldProdAppId = dbCore.getProdWorkspaceID(automation.appId)
    if (
      automation.definition.trigger?.stepId === AutomationTriggerStepId.WEBHOOK
    ) {
      const old = automation.definition.trigger.inputs as WebhookTriggerInputs
      automation.definition.trigger.inputs = {
        schemaUrl: old.schemaUrl.replace(oldDevAppId, devId),
        triggerUrl: old.triggerUrl.replace(oldProdAppId, prodAppId),
      }
    }
    automation.appId = devId
    toSave.push(automation)
  }
  await db.bulkDocs(toSave)
}

/**
 * This function manages temporary template files which are stored by Koa.
 * @param template The template object retrieved from the Koa context object.
 * @returns Returns a fs read stream which can be loaded into the database.
 */
async function getTemplateStream(template: TemplateType) {
  if (template.file && template.file.type !== "text/plain") {
    throw new Error("Cannot import a non-text based file.")
  }
  if (template.file) {
    return fs.createReadStream(template.file.path)
  } else if (template.key) {
    const [type, name] = template.key.split("/")
    const tmpPath = await downloadTemplate(type, name)
    return fs.createReadStream(join(tmpPath, name, "db", "dump.txt"))
  } else {
    throw new Error("Either file or key is required.")
  }
}

export async function untarFile(file: { path: string }) {
  const tmpPath = join(budibaseTempDir(), uuid())
  await fsp.mkdir(tmpPath)
  // extract the tarball
  await tar.extract({
    cwd: tmpPath,
    file: file.path,
  })
  return tmpPath
}

export async function decryptFiles(
  path: string,
  password: string,
  { maxOutputBytes = Infinity }: { maxOutputBytes?: number } = {}
) {
  try {
    const processDirectory = async (dirPath: string) => {
      for (let file of await fsp.readdir(dirPath)) {
        const inputPath = join(dirPath, file)
        if (!inputPath.endsWith(ATTACHMENT_DIRECTORY)) {
          const stats = await fsp.lstat(inputPath)
          if (stats.isFile() && inputPath.endsWith(".enc")) {
            const outputPath = inputPath.replace(/\.enc$/, "")
            await encryption.decryptFile(inputPath, outputPath, password, {
              maxOutputBytes,
            })
            maxOutputBytes -= (await fsp.stat(outputPath)).size
            await fsp.rm(inputPath)
          } else if (stats.isDirectory()) {
            await processDirectory(inputPath)
          }
        }
      }
    }

    await processDirectory(path)
  } catch (err: any) {
    if (err.message === "incorrect header check") {
      throw new Error("File cannot be imported")
    }
    throw err
  }
}

export function getGlobalDBFile(tmpPath: string) {
  return fs.readFileSync(join(tmpPath, GLOBAL_DB_EXPORT_FILE), "utf8")
}

export function getListOfAppsInMulti(tmpPath: string) {
  return fs.readdirSync(tmpPath).filter(dir => dir !== GLOBAL_DB_EXPORT_FILE)
}

export interface ImportAppOpts {
  updateAttachmentColumns?: boolean
  importObjStoreContents?: boolean
  objectStoreAppId?: string
  preserveLiteLLMConfig?: boolean
  restoreKnowledgeBases?: boolean
  cleanupObjectStoreContents?: boolean
}

async function sanitizeLiteLLMImportData(db: Database) {
  console.log("Starting LiteLLM import sanitization", {
    dbName: db.name,
  })
  const keyDocId = docIds.getLiteLLMKeyID()
  const keyDoc = await db.tryGet<LiteLLMKeyConfig>(keyDocId)
  if (keyDoc) {
    await db.remove(keyDoc)
    console.log("Removed LiteLLM key config from imported data", {
      dbName: db.name,
      keyDocId,
    })
  }

  const aiConfigs = await db.allDocs<CustomAIProviderConfig>(
    docIds.getDocParams(DocumentType.AI_CONFIG, undefined, {
      include_docs: true,
    })
  )

  const updatedAIConfigs = aiConfigs.rows
    .map(row => row.doc)
    .filter((doc): doc is CustomAIProviderConfig => !!doc)
    .map(doc => ({
      ...doc,
      liteLLMModelId:
        doc.provider === BUDIBASE_AI_PROVIDER_ID && !environment.SELF_HOSTED
          ? doc.liteLLMModelId
          : IMPORT_PENDING_LITELLM_MODEL_ID,
    }))

  if (updatedAIConfigs.length) {
    await db.bulkDocs(updatedAIConfigs)
  }

  console.log("Finished LiteLLM import sanitization", {
    dbName: db.name,
    aiConfigCount: updatedAIConfigs.length,
    preservedBudibaseAIConfigCount: updatedAIConfigs.filter(
      c =>
        c.provider === BUDIBASE_AI_PROVIDER_ID &&
        c.liteLLMModelId !== IMPORT_PENDING_LITELLM_MODEL_ID
    ).length,
  })
}

// exports made before these were filtered out can still contain them
async function removeRuntimeDocuments(db: Database) {
  const responses = await Promise.all(
    RuntimeDocumentTypes.map(type => db.allDocs(docIds.getDocParams(type)))
  )
  const refs = responses.flatMap(response =>
    response.rows.map(row => ({
      _id: row.id,
      _rev: (row.value as RowValue).rev,
    }))
  )
  if (refs.length) {
    await db.bulkRemove(refs)
  }
}

export async function restoreImportedKnowledgeBases(
  appId: string,
  db: Database
) {
  const filesResponse = await db.allDocs<KnowledgeBaseFile>(
    docIds.getDocParams(DocumentType.KNOWLEDGE_BASE_FILE, undefined, {
      include_docs: true,
    })
  )
  const files = filesResponse.rows
    .map(row => row.doc)
    .filter((file): file is KnowledgeBaseFile => !!file)
    .map(file => {
      if (!file.objectStoreKey) {
        return file
      }
      const marker = "/ai/knowledge-bases/"
      const markerIndex = file.objectStoreKey.indexOf(marker)
      if (markerIndex < 0) {
        return file
      }
      return {
        ...file,
        objectStoreKey: `${appId}${file.objectStoreKey.slice(markerIndex)}`,
      }
    })
  if (files.length) {
    await db.bulkDocs(files)
  }

  const knowledgeBasesResponse = await db.allDocs<GeminiKnowledgeBase>(
    docIds.getDocParams(DocumentType.KNOWLEDGE_BASE, undefined, {
      include_docs: true,
    })
  )
  const knowledgeBases = knowledgeBasesResponse.rows
    .map(row => row.doc)
    .filter(
      (knowledgeBase): knowledgeBase is GeminiKnowledgeBase => !!knowledgeBase
    )
  for (const knowledgeBase of knowledgeBases) {
    await sdk.ai.knowledgeBase.resetKnowledgeBaseStore(knowledgeBase, {
      deleteExistingStore: false,
    })
  }
}

async function removeMissingKnowledgeBaseReferences(db: Database) {
  const [agentsResponse, knowledgeBasesResponse] = await Promise.all([
    db.allDocs<Agent>(
      docIds.getDocParams(DocumentType.AGENT, undefined, {
        include_docs: true,
      })
    ),
    db.allDocs(docIds.getDocParams(DocumentType.KNOWLEDGE_BASE)),
  ])
  const knowledgeBaseIds = new Set(
    knowledgeBasesResponse.rows.map(row => row.id)
  )
  const agents = agentsResponse.rows
    .map(row => row.doc)
    .filter((agent): agent is Agent => !!agent)
    .map(agent => ({
      ...agent,
      operations: agent.operations?.map(operation => ({
        ...operation,
        knowledgeBases: operation.knowledgeBases?.filter(knowledgeBaseId =>
          knowledgeBaseIds.has(knowledgeBaseId)
        ),
      })),
    }))
  if (agents.length) {
    await db.bulkDocs(agents)
  }
}

export async function cleanupUnusedKnowledgeBaseObjects(
  appId: string,
  db: Database
) {
  const filesResponse = await db.allDocs<KnowledgeBaseFile>(
    docIds.getDocParams(DocumentType.KNOWLEDGE_BASE_FILE, undefined, {
      include_docs: true,
    })
  )
  const referencedKeys = new Set(
    filesResponse.rows
      .map(row => row.doc?.objectStoreKey)
      .filter((key): key is string => !!key)
      .map(key => objectStore.sanitizeKey(key))
  )
  const prefix = `${appId}/ai/knowledge-bases`
  const filesToDelete: string[] = []
  await utils.parallelForeach(
    objectStore.listAllObjects(ObjectStoreBuckets.APPS, prefix),
    async file => {
      if (file.Key && !referencedKeys.has(file.Key)) {
        filesToDelete.push(file.Key)
      }
    },
    5
  )
  if (filesToDelete.length) {
    await objectStore.deleteFiles(ObjectStoreBuckets.APPS, filesToDelete)
  }
}

export const importApp: ImportWorkspaceFn = async (
  appId,
  db,
  template,
  opts = {}
) => {
  const importOpts: ImportAppOpts = {
    updateAttachmentColumns: true,
    importObjStoreContents: true,
    preserveLiteLLMConfig: false,
    restoreKnowledgeBases: true,
    cleanupObjectStoreContents: true,
    ...opts,
  }
  const prodAppId = dbCore.getProdWorkspaceID(appId)
  const objectStoreWorkspaceId = importOpts.objectStoreAppId ?? appId
  const objectStoreProdAppId = dbCore.getProdWorkspaceID(objectStoreWorkspaceId)
  let dbStream: fs.ReadStream
  let shouldRestoreKnowledge = false
  const isTar = template.file && template?.file?.type?.endsWith("gzip")
  const isDirectory =
    template.file && (await fsp.lstat(template.file.path)).isDirectory()
  let tmpPath: string | undefined = undefined
  if (template.file && (isTar || isDirectory)) {
    tmpPath = isTar ? await untarFile(template.file) : template.file.path
    if (isTar && template.file.password) {
      await decryptFiles(tmpPath, template.file.password)
    }
    const contents = await fsp.readdir(tmpPath)
    shouldRestoreKnowledge = contents.includes("ai")
    const stillEncrypted = !!contents.find(name => name.endsWith(".enc"))
    if (stillEncrypted) {
      throw new Error("Files are encrypted but no password has been supplied.")
    }
    const isPlugin = !!contents.find(name => name === "plugin.min.js")
    if (isPlugin) {
      throw new Error("Supplied file is a plugin - cannot import as app.")
    }
    const isInvalid = !contents.find(name => name === DB_EXPORT_FILE)
    if (isInvalid) {
      throw new Error(
        "App export does not appear to be valid - no DB file found."
      )
    }
    // have to handle object import
    if (importOpts.importObjStoreContents) {
      const promises = []
      const excludedFiles = [GLOBAL_DB_EXPORT_FILE, DB_EXPORT_FILE]

      for (let filename of contents) {
        const path = join(tmpPath, filename)
        if (excludedFiles.includes(filename)) {
          continue
        }
        const objectStoreWorkspacePrefix =
          filename === "ai" ? objectStoreWorkspaceId : objectStoreProdAppId
        filename = join(objectStoreWorkspacePrefix, filename)
        if ((await fsp.lstat(path)).isDirectory()) {
          promises.push(
            objectStore.uploadDirectory(ObjectStoreBuckets.APPS, path, filename)
          )
        } else {
          promises.push(
            objectStore.upload({
              bucket: ObjectStoreBuckets.APPS,
              path,
              filename,
            })
          )
        }
      }
      await Promise.all(promises)
      const uploadedFiles = await fsp.readdir(tmpPath, { recursive: true })

      const filesToDelete: string[] = []
      const collectFilesToDelete = async ({
        prefix,
        toExportPath,
      }: {
        prefix: string
        toExportPath: (relativePath: string) => string
      }) => {
        await utils.parallelForeach(
          objectStore.listAllObjects(
            objectStore.ObjectStoreBuckets.APPS,
            prefix
          ),
          async file => {
            if (!file.Key || !file.Key.startsWith(`${prefix}/`)) {
              return
            }
            const relativePath = file.Key.slice(prefix.length + 1)
            // never delete attachment files - they are referenced by prod rows
            // which are not included in the export and cannot be re-uploaded
            if (
              !relativePath.startsWith(`${ATTACHMENT_DIRECTORY}/`) &&
              !relativePath.startsWith("ai/knowledge-bases/") &&
              !uploadedFiles.includes(toExportPath(relativePath))
            ) {
              filesToDelete.push(file.Key)
            }
          },
          5
        )
      }
      if (importOpts.cleanupObjectStoreContents && shouldRestoreKnowledge) {
        await collectFilesToDelete({
          prefix: objectStoreProdAppId,
          toExportPath: relativePath => relativePath,
        })
        await collectFilesToDelete({
          prefix: `${objectStoreWorkspaceId}/ai/knowledge-bases`,
          toExportPath: relativePath => `ai/knowledge-bases/${relativePath}`,
        })
      }

      if (filesToDelete.length) {
        await objectStore.deleteFiles(
          objectStore.ObjectStoreBuckets.APPS,
          filesToDelete
        )
      }
    }
    dbStream = fs.createReadStream(join(tmpPath, DB_EXPORT_FILE))
  } else {
    dbStream = await getTemplateStream(template)
  }
  const { ok } = await db.load(dbStream)
  if (!ok) {
    throw "Error loading database dump from template."
  }
  await removeRuntimeDocuments(db)
  await removeMissingKnowledgeBaseReferences(db)
  if (shouldRestoreKnowledge && importOpts.restoreKnowledgeBases) {
    await restoreImportedKnowledgeBases(objectStoreWorkspaceId, db)
  }
  if (importOpts.updateAttachmentColumns) {
    await updateAttachmentColumns(prodAppId, db)
  }
  await updateAutomations(prodAppId, db)
  if (!importOpts.preserveLiteLLMConfig) {
    await sanitizeLiteLLMImportData(db)
  }

  await sdk.ai.configs.reconcileLiteLLMModels()

  // clear up afterward
  if (tmpPath) {
    await fsp.rm(tmpPath, { recursive: true, force: true })
  }
  return ok
}
