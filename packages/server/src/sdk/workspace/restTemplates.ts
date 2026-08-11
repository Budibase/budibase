import kebabCase from "lodash/kebabCase"
import {
  context,
  db as dbCore,
  HTTPError,
  locks,
  objectStore,
} from "@budibase/backend-core"
import type {
  CustomRestTemplateDocument,
  CustomRestTemplateFileExtension,
  CustomRestTemplateId,
  Datasource,
  RestTemplate,
} from "@budibase/types"
import { DocumentType, LockName, LockType, SourceName } from "@budibase/types"
import { getDatasourceParams } from "../../db/utils"

const CUSTOM_TEMPLATE_VERSION = "custom"

interface CreateCustomRestTemplateParams {
  name: string
  description: string
  data: string
  fileExtension: CustomRestTemplateFileExtension
  operationsCount: number
}

const getObjectStoreFolder = (restTemplateId: CustomRestTemplateId) => {
  return `${context.getOrThrowWorkspaceId()}/${restTemplateId}`
}

const getLockResource = (resource: string) =>
  [context.getWorkspaceId(), resource].filter(Boolean).join(":")

export const withCustomRestTemplateLock = async <T>({
  resource,
  task,
}: {
  resource: string
  task: () => Promise<T>
}): Promise<T> => {
  const { result } = await locks.doWithLock(
    {
      name: LockName.CUSTOM_REST_TEMPLATES,
      resource: getLockResource(resource),
      type: LockType.AUTO_EXTEND,
    },
    task
  )
  return result
}

const toRestTemplate = (
  document: CustomRestTemplateDocument
): RestTemplate => ({
  id: document.restTemplateId,
  name: document.name,
  description: document.description,
  operationsCount: document.operationsCount,
  custom: true,
  specs: [
    {
      version: CUSTOM_TEMPLATE_VERSION,
    },
  ],
})

export const fetch = async (): Promise<RestTemplate[]> => {
  const db = context.getWorkspaceDB()
  const response = await db.allDocs(
    dbCore.getDocParams(DocumentType.REST_TEMPLATE, null, {
      include_docs: true,
    })
  )

  return response.rows
    .map(row => row.doc as CustomRestTemplateDocument | undefined)
    .filter(
      (document): document is CustomRestTemplateDocument => document != null
    )
    .map(toRestTemplate)
}

const createWithoutLock = async ({
  name,
  description,
  data,
  fileExtension,
  operationsCount,
}: CreateCustomRestTemplateParams): Promise<RestTemplate> => {
  const db = context.getWorkspaceDB()
  const normalizedName = kebabCase(name)
  if (!normalizedName) {
    throw new HTTPError("Template name must contain letters or numbers", 400)
  }

  const existingTemplate = (await fetch()).find(
    template => kebabCase(template.name) === normalizedName
  )
  if (existingTemplate) {
    throw new HTTPError(
      `A custom REST template named "${name.trim()}" already exists`,
      409
    )
  }

  const restTemplateId = dbCore.generateRestTemplateID()
  const existing = await db.tryGet<CustomRestTemplateDocument>(restTemplateId)
  if (existing) {
    throw new HTTPError(
      `A custom REST template named "${name.trim()}" already exists`,
      409
    )
  }

  const folder = getObjectStoreFolder(restTemplateId)
  const objectStoreKey = `${folder}/openapi.${fileExtension}`
  const document: CustomRestTemplateDocument = {
    _id: restTemplateId,
    restTemplateId,
    name: name.trim(),
    description: description.trim(),
    objectStoreKey,
    fileExtension,
    operationsCount,
    createdAt: new Date().toISOString(),
  }

  let revision: string
  try {
    const response = await db.put(document)
    revision = response.rev
    document._rev = revision
  } catch (error) {
    if (dbCore.isDocumentConflictError(error)) {
      throw new HTTPError(
        `A custom REST template named "${name.trim()}" already exists`,
        409
      )
    }
    throw error
  }

  try {
    await objectStore.upload({
      bucket: objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
      filename: objectStoreKey,
      body: Buffer.from(data),
      type: fileExtension === "json" ? "application/json" : "text/yaml",
    })
  } catch (error) {
    await Promise.allSettled([
      db.remove(document._id, revision),
      objectStore.deleteFolder(
        objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
        folder
      ),
    ])
    throw error
  }

  return toRestTemplate(document)
}

export const create = async (params: CreateCustomRestTemplateParams) =>
  withCustomRestTemplateLock({
    resource: "workspace",
    task: () => createWithoutLock(params),
  })

const updateWithoutLock = async ({
  restTemplateId,
  name,
  description,
  data,
  fileExtension,
  operationsCount,
}: CreateCustomRestTemplateParams & {
  restTemplateId: CustomRestTemplateId
}): Promise<RestTemplate> => {
  const db = context.getWorkspaceDB()
  const document = await db.tryGet<CustomRestTemplateDocument>(restTemplateId)
  if (!document?._rev) {
    throw new HTTPError("Custom REST template not found", 404)
  }

  const normalizedName = kebabCase(name)
  if (!normalizedName) {
    throw new HTTPError("Template name must contain letters or numbers", 400)
  }
  const duplicate = (await fetch()).find(
    template =>
      template.id !== restTemplateId &&
      kebabCase(template.name) === normalizedName
  )
  if (duplicate) {
    throw new HTTPError(
      `A custom REST template named "${name.trim()}" already exists`,
      409
    )
  }

  const objectStoreKey = `${getObjectStoreFolder(
    restTemplateId
  )}/openapi.${fileExtension}`
  await objectStore.upload({
    bucket: objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
    filename: objectStoreKey,
    body: Buffer.from(data),
    type: fileExtension === "json" ? "application/json" : "text/yaml",
  })

  const updatedDocument: CustomRestTemplateDocument = {
    ...document,
    name: name.trim(),
    description: description.trim(),
    objectStoreKey,
    fileExtension,
    operationsCount,
  }

  try {
    await db.put(updatedDocument)
  } catch (error) {
    if (objectStoreKey !== document.objectStoreKey) {
      await objectStore.deleteFile(
        objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
        objectStoreKey
      )
    }
    throw error
  }

  if (objectStoreKey !== document.objectStoreKey) {
    await objectStore.deleteFile(
      objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
      document.objectStoreKey
    )
  }

  return toRestTemplate(updatedDocument)
}

export const update = async (
  params: CreateCustomRestTemplateParams & {
    restTemplateId: CustomRestTemplateId
  }
) =>
  withCustomRestTemplateLock({
    resource: params.restTemplateId,
    task: () => updateWithoutLock(params),
  })

export const getSpec = async (
  restTemplateId: CustomRestTemplateId
): Promise<string> => {
  const db = context.getWorkspaceDB()
  const document = await db.tryGet<CustomRestTemplateDocument>(restTemplateId)
  if (!document) {
    throw new HTTPError("Custom REST template not found", 404)
  }

  const content = await objectStore.retrieve(
    objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
    document.objectStoreKey
  )
  if (typeof content === "string") {
    return content
  }

  const chunks: Uint8Array[] = []
  for await (const chunk of content) {
    chunks.push(new Uint8Array(chunk))
  }
  return Buffer.concat(chunks).toString("utf8")
}

const removeWithoutLock = async (restTemplateId: CustomRestTemplateId) => {
  const db = context.getWorkspaceDB()
  const document = await db.tryGet<CustomRestTemplateDocument>(restTemplateId)
  if (!document?._rev) {
    throw new HTTPError("Custom REST template not found", 404)
  }

  await objectStore.deleteFolder(
    objectStore.ObjectStoreBuckets.CUSTOM_OPENAPI_TEMPLATES,
    getObjectStoreFolder(restTemplateId)
  )
  await db.remove(document._id, document._rev)
}

const removeIfUnusedWithoutLock = async (
  restTemplateId: CustomRestTemplateId
): Promise<"removed" | "in_use" | "missing"> => {
  const db = context.getWorkspaceDB()
  const document = await db.tryGet<CustomRestTemplateDocument>(restTemplateId)
  if (!document?._rev) {
    return "missing"
  }

  const response = await db.allDocs<Datasource>(
    getDatasourceParams(null, {
      include_docs: true,
    })
  )
  const isUsed = response.rows.some(row => {
    const datasource = row.doc
    return (
      datasource?.source === SourceName.REST &&
      datasource.restTemplateId === restTemplateId
    )
  })

  if (isUsed) {
    return "in_use"
  }

  await removeWithoutLock(restTemplateId)
  return "removed"
}

export const removeIfUnused = async (
  restTemplateId: CustomRestTemplateId
): Promise<"removed" | "in_use" | "missing"> =>
  withCustomRestTemplateLock({
    resource: restTemplateId,
    task: () => removeIfUnusedWithoutLock(restTemplateId),
  })

export const exists = async (restTemplateId: CustomRestTemplateId) => {
  const db = context.getWorkspaceDB()
  return Boolean(await db.tryGet<CustomRestTemplateDocument>(restTemplateId))
}
