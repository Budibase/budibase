import {
  AgentKnowledgeSourceType,
  AgentMessageRagSource,
  type Agent,
  type KnowledgeBase,
  type KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  LockName,
  LockType,
  type WithRequired,
} from "@budibase/types"
import { HTTPError, locks, objectStore } from "@budibase/backend-core"
import { agents as agentsSdk, knowledgeBase as knowledgeBaseSdk } from ".."
import { getLiveOperation } from "../agents/utils"
import { RetrievedContextChunk } from "./processors"
import { GeminiRagProcessor } from "./processors/gemini"
import { ObjectStoreBuckets } from "../../../../constants"
import {
  deleteKnowledgeSourceSyncStateForOperation,
  deleteSharePointFilesForOperationSite,
} from "./sources/sharepoint/sharepoint"

const getOperationOrThrow = (agent: Agent, operationId: string) => {
  const operation = agent.operations?.find(
    operation => operation.id === operationId
  )
  if (!operation) {
    throw new HTTPError("Operation not found for this agent", 404)
  }
  return operation
}

const resolveKnowledgeBasesForAgent = async (
  agent: Agent
): Promise<KnowledgeBase[]> => {
  const knowledgeBaseIds = (
    getLiveOperation(agent)?.knowledgeBases || []
  ).filter(Boolean)
  if (knowledgeBaseIds.length === 0) {
    return []
  }

  const knowledgeBases: KnowledgeBase[] = []
  for (const knowledgeBaseId of knowledgeBaseIds) {
    const config = await knowledgeBaseSdk.find(knowledgeBaseId)
    if (config) {
      knowledgeBases.push(config)
    }
  }

  if (knowledgeBases.length === 0) {
    return []
  }

  return knowledgeBases
}

const getAgentKnowledgeBase = async (
  knowledgeBaseIds: string[] | undefined
): Promise<KnowledgeBase | undefined> => {
  const validIds = (knowledgeBaseIds || []).filter(Boolean)
  for (const id of validIds) {
    const knowledgeBase = await knowledgeBaseSdk.find(id)
    if (knowledgeBase) {
      return knowledgeBase
    }
  }
  return undefined
}

const normalizeFilenameLookup = (value?: string) =>
  value?.trim().toLowerCase() || ""

const getReadySourceIdByFilename = (readyFiles: KnowledgeBaseFile[]) => {
  const sourceIdByFilename = new Map<string, string>()
  const ambiguousFilenames = new Set<string>()

  for (const file of readyFiles) {
    if (!file.ragSourceId) {
      continue
    }

    const normalizedFilename = normalizeFilenameLookup(file.filename)
    if (!normalizedFilename || ambiguousFilenames.has(normalizedFilename)) {
      continue
    }

    const existingSourceId = sourceIdByFilename.get(normalizedFilename)
    if (existingSourceId && existingSourceId !== file.ragSourceId) {
      sourceIdByFilename.delete(normalizedFilename)
      ambiguousFilenames.add(normalizedFilename)
      continue
    }

    sourceIdByFilename.set(normalizedFilename, file.ragSourceId)
  }

  return sourceIdByFilename
}

const getOperationKnowledgeBaseName = (agent: Agent, operationId: string) => {
  return `Agent files (${agent._id}:${operationId})`
}

const getKnowledgeBaseIdsForOperation = async (
  agentId: string,
  operationId: string
): Promise<string[]> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  const operation = getOperationOrThrow(agent, operationId)
  return (operation.knowledgeBases || []).filter(Boolean)
}

export const ensureKnowledgeBaseForOperation = async (
  agentId: string,
  operationId: string
): Promise<KnowledgeBase> => {
  const { result } = await locks.doWithLock(
    {
      name: LockName.AGENT_RAG_KNOWLEDGE_BASE,
      type: LockType.AUTO_EXTEND,
      resource: `${agentId}:${operationId}`,
    },
    async () => {
      const agent = await agentsSdk.getOrThrow(agentId)
      const targetOperation = getOperationOrThrow(agent, operationId)
      const existing = await getAgentKnowledgeBase(
        targetOperation.knowledgeBases
      )
      if (existing) {
        return existing
      }

      const created = await knowledgeBaseSdk.create({
        name: getOperationKnowledgeBaseName(agent, operationId),
        type: KnowledgeBaseType.GEMINI,
      })

      await agentsSdk.update({
        ...agent,
        operations: (agent.operations || []).map(operation =>
          operation.id === operationId
            ? {
                ...operation,
                knowledgeBases: created._id ? [created._id] : [],
              }
            : operation
        ),
      })

      return created
    }
  )

  return result
}

export const ensureKnowledgeBaseForAgent = async (
  agentId: string
): Promise<KnowledgeBase> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  const operationId = agent.operations?.[0]?.id
  if (!operationId) {
    throw new HTTPError("Agent has no operations configured", 422)
  }
  return await ensureKnowledgeBaseForOperation(agentId, operationId)
}

export const listFilesForOperation = async (
  agentId: string,
  operationId: string
): Promise<KnowledgeBaseFile[]> => {
  const knowledgeBaseIds = await getKnowledgeBaseIdsForOperation(
    agentId,
    operationId
  )
  if (knowledgeBaseIds.length === 0) {
    return []
  }

  return (
    await Promise.all(
      knowledgeBaseIds.map(id => knowledgeBaseSdk.listKnowledgeBaseFiles(id))
    )
  ).flat()
}

export const uploadFileForOperation = async (
  agentId: string,
  operationId: string,
  input: UploadFileForAgentInput
): Promise<KnowledgeBaseFile> => {
  const knowledgeBase = await ensureKnowledgeBaseForOperation(
    agentId,
    operationId
  )
  const knowledgeBaseId = knowledgeBase._id
  if (!knowledgeBaseId) {
    throw new HTTPError("Failed to create operation file storage", 500)
  }

  return await knowledgeBaseSdk.uploadKnowledgeBaseFile({
    knowledgeBaseId,
    filename: input.filename,
    mimetype: input.mimetype,
    size: input.size ?? input.buffer.byteLength,
    buffer: input.buffer,
    uploadedBy: input.uploadedBy,
  })
}

export const deleteFileForOperation = async (
  agentId: string,
  operationId: string,
  fileId: string
): Promise<void> => {
  const file = await knowledgeBaseSdk.getKnowledgeBaseFileOrThrow(fileId)
  const fileKnowledgeBaseId = file.knowledgeBaseId
  if (!fileKnowledgeBaseId) {
    throw new HTTPError("Invalid knowledge base file id", 400)
  }
  const knowledgeBaseIds = await getKnowledgeBaseIdsForOperation(
    agentId,
    operationId
  )
  if (!knowledgeBaseIds.includes(fileKnowledgeBaseId)) {
    throw new HTTPError("File does not belong to this operation", 404)
  }

  const knowledgeBase = await knowledgeBaseSdk.find(fileKnowledgeBaseId)
  if (!knowledgeBase) {
    throw new HTTPError("Operation file storage not found", 404)
  }
  await knowledgeBaseSdk.removeKnowledgeBaseFile(knowledgeBase, file)
}

const removeKnowledgeBaseWithFiles = async (
  knowledgeBaseId: string,
  contextLabel: string
) => {
  const knowledgeBase = await knowledgeBaseSdk.find(knowledgeBaseId)
  if (!knowledgeBase) {
    return
  }

  const files = await knowledgeBaseSdk.listKnowledgeBaseFiles(knowledgeBaseId)
  for (const file of files) {
    try {
      await knowledgeBaseSdk.removeKnowledgeBaseFile(knowledgeBase, file)
    } catch (error) {
      console.log(`Failed to remove knowledge base file for ${contextLabel}`, {
        knowledgeBaseId,
        fileId: file._id,
        error,
      })
    }
  }

  try {
    await knowledgeBaseSdk.remove(knowledgeBaseId)
  } catch (error) {
    console.log(`Failed to remove knowledge base for ${contextLabel}`, {
      knowledgeBaseId,
      error,
    })
  }
}

export const cleanupKnowledgeForOperation = async (
  agentId: string,
  operationId: string
): Promise<void> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  const operation = getOperationOrThrow(agent, operationId)

  const sharePointSources = (operation.knowledgeSources || []).filter(
    source => source.type === AgentKnowledgeSourceType.SHAREPOINT
  )

  for (const source of sharePointSources) {
    const siteId = source.config.site.id
    if (!siteId) {
      continue
    }
    await deleteSharePointFilesForOperationSite(agentId, operationId, siteId)
  }

  await deleteKnowledgeSourceSyncStateForOperation(agentId, operationId)

  const knowledgeBaseIds = (operation.knowledgeBases || []).filter(Boolean)
  for (const knowledgeBaseId of knowledgeBaseIds) {
    await removeKnowledgeBaseWithFiles(knowledgeBaseId, "operation deletion")
  }
}

export const getFileUrlForOperation = async (
  agentId: string,
  operationId: string,
  fileId: string
): Promise<string> => {
  const file = await knowledgeBaseSdk.getKnowledgeBaseFileOrThrow(fileId)
  const fileKnowledgeBaseId = file.knowledgeBaseId
  if (!fileKnowledgeBaseId) {
    throw new HTTPError("Invalid knowledge base file id", 400)
  }

  const knowledgeBaseIds = await getKnowledgeBaseIdsForOperation(
    agentId,
    operationId
  )
  if (!knowledgeBaseIds.includes(fileKnowledgeBaseId)) {
    throw new HTTPError("File does not belong to this operation", 404)
  }

  if (!file.objectStoreKey) {
    throw new HTTPError("Knowledge base file is missing object key", 400)
  }

  return await objectStore.getPresignedUrl(
    ObjectStoreBuckets.APPS,
    file.objectStoreKey
  )
}

const getKnowledgeBaseIdsForAgent = async (
  agentId: string,
  options: { liveOperationOnly?: boolean } = {}
): Promise<string[]> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  if (options.liveOperationOnly) {
    return (getLiveOperation(agent)?.knowledgeBases || []).filter(Boolean)
  }
  return (
    agent.operations?.flatMap(operation => operation.knowledgeBases || []) || []
  ).filter(Boolean)
}

export const listFilesForAgent = async (
  agentId: string,
  options: { liveOperationOnly?: boolean } = {}
): Promise<KnowledgeBaseFile[]> => {
  const knowledgeBaseIds = await getKnowledgeBaseIdsForAgent(agentId, options)
  if (knowledgeBaseIds.length === 0) {
    return []
  }

  return (
    await Promise.all(
      knowledgeBaseIds.map(id => knowledgeBaseSdk.listKnowledgeBaseFiles(id))
    )
  ).flat()
}

interface UploadFileForAgentInput {
  filename: string
  mimetype?: string
  size?: number
  buffer: Buffer
  uploadedBy: string
}

export const uploadFileForAgent = async (
  agentId: string,
  input: UploadFileForAgentInput
): Promise<KnowledgeBaseFile> => {
  const knowledgeBase = await ensureKnowledgeBaseForAgent(agentId)
  const knowledgeBaseId = knowledgeBase._id
  if (!knowledgeBaseId) {
    throw new HTTPError("Failed to create agent file storage", 500)
  }

  return await knowledgeBaseSdk.uploadKnowledgeBaseFile({
    knowledgeBaseId,
    filename: input.filename,
    mimetype: input.mimetype,
    size: input.size ?? input.buffer.byteLength,
    buffer: input.buffer,
    uploadedBy: input.uploadedBy,
  })
}

export const deleteFileForAgent = async (
  agentId: string,
  fileId: string
): Promise<void> => {
  const file = await knowledgeBaseSdk.getKnowledgeBaseFileOrThrow(fileId)
  const fileKnowledgeBaseId = file.knowledgeBaseId
  if (!fileKnowledgeBaseId) {
    throw new HTTPError("Invalid knowledge base file id", 400)
  }
  const knowledgeBaseIds = await getKnowledgeBaseIdsForAgent(agentId)
  if (!knowledgeBaseIds.includes(fileKnowledgeBaseId)) {
    throw new HTTPError("File does not belong to this agent", 404)
  }

  const knowledgeBase = await knowledgeBaseSdk.find(fileKnowledgeBaseId)
  if (!knowledgeBase) {
    throw new HTTPError("Agent file storage not found", 404)
  }
  await knowledgeBaseSdk.removeKnowledgeBaseFile(knowledgeBase, file)
}

export const getFileUrlForAgent = async (
  agentId: string,
  fileId: string
): Promise<string> => {
  const file = await knowledgeBaseSdk.getKnowledgeBaseFileOrThrow(fileId)
  const fileKnowledgeBaseId = file.knowledgeBaseId
  if (!fileKnowledgeBaseId) {
    throw new HTTPError("Invalid knowledge base file id", 400)
  }

  const knowledgeBaseIds = await getKnowledgeBaseIdsForAgent(agentId)
  if (!knowledgeBaseIds.includes(fileKnowledgeBaseId)) {
    throw new HTTPError("File does not belong to this agent", 404)
  }

  if (!file.objectStoreKey) {
    throw new HTTPError("Knowledge base file is missing object key", 400)
  }

  return await objectStore.getPresignedUrl(
    ObjectStoreBuckets.APPS,
    file.objectStoreKey
  )
}

const assertKnowledgeBaseHasId: (
  knowledgeBase: KnowledgeBase
) => asserts knowledgeBase is WithRequired<KnowledgeBase, "_id"> = (
  knowledgeBase: KnowledgeBase
) => {
  if (!knowledgeBase._id) {
    throw new Error("Knowledge base id not set")
  }
}

function getProcessor(kb: WithRequired<KnowledgeBase, "_id">) {
  const ProcessorClassByType = {
    [KnowledgeBaseType.GEMINI]: GeminiRagProcessor,
  }

  const ProcessorClass = ProcessorClassByType[kb.type]
  if (!ProcessorClass) {
    throw new Error(`RAG processor is not configured for ${kb.type}`)
  }

  return new ProcessorClass(kb)
}

export const ingestKnowledgeBaseFile = async (
  knowledgeBase: KnowledgeBase,
  knowledgeBaseFile: KnowledgeBaseFile,
  fileBuffer: Buffer
): Promise<void> => {
  assertKnowledgeBaseHasId(knowledgeBase)
  const knowledgeBaseFileId = knowledgeBaseFile._id
  if (!knowledgeBaseFileId) {
    throw new Error("Knowledge base file id not set")
  }

  const processor = getProcessor(knowledgeBase)
  await processor.ingestKnowledgeBaseFile(
    { ...knowledgeBaseFile, _id: knowledgeBaseFileId },
    fileBuffer
  )
}

interface RetrievedContextResult {
  text: string
  chunks: RetrievedContextChunk[]
  sources: AgentMessageRagSource[]
}

export const retrieveContextForAgent = async (
  agent: Agent,
  question: string
): Promise<RetrievedContextResult> => {
  if (!question || question.trim().length === 0) {
    return { text: "", chunks: [], sources: [] }
  }

  const knowledgeBases = await resolveKnowledgeBasesForAgent(agent)
  const chunks: Array<RetrievedContextChunk> = []
  const files: KnowledgeBaseFile[] = []

  for (const knowledgeBase of knowledgeBases) {
    const knowledgeBaseId = knowledgeBase._id
    if (!knowledgeBaseId) {
      continue
    }

    const knowledgeBaseFiles =
      await knowledgeBaseSdk.listKnowledgeBaseFiles(knowledgeBaseId)
    files.push(...knowledgeBaseFiles)

    const readyFiles = knowledgeBaseFiles.filter(
      file => file.status === KnowledgeBaseFileStatus.READY
    )
    const readyFileSources = readyFiles
      .map(file => file.ragSourceId)
      .filter((id): id is string => !!id)

    if (readyFiles.length === 0) {
      continue
    }

    const readyFileSourceIds = new Set(readyFileSources)
    const readySourceIdByFilename = getReadySourceIdByFilename(readyFiles)
    assertKnowledgeBaseHasId(knowledgeBase)
    const processor = getProcessor(knowledgeBase)
    const returned = await processor.search(question)

    for (const chunk of returned) {
      if (!chunk.source) {
        chunks.push(chunk)
        continue
      }

      if (readyFileSourceIds.has(chunk.source)) {
        chunks.push(chunk)
        continue
      }

      const sourceIdFromFilename = readySourceIdByFilename.get(
        normalizeFilenameLookup(chunk.source)
      )
      if (!sourceIdFromFilename) {
        continue
      }

      chunks.push({
        ...chunk,
        source: sourceIdFromFilename,
      })
    }
  }

  if (chunks.length === 0) {
    return { text: "", chunks: [], sources: [] }
  }

  return {
    text: chunks.map(chunk => chunk.chunkText).join("\n\n"),
    chunks,
    sources: toSourceMetadata(chunks, files),
  }
}

const toSourceMetadata = (
  chunks: RetrievedContextChunk[],
  files: KnowledgeBaseFile[]
): AgentMessageRagSource[] => {
  const readyFiles = files.filter(
    file => file.status === KnowledgeBaseFileStatus.READY
  )
  const fileBySourceId = new Map(
    readyFiles.map(file => [file.ragSourceId, file])
  )
  const summary = new Map<string, AgentMessageRagSource>()

  for (const chunk of chunks) {
    if (!chunk.source) {
      continue
    }
    const file = fileBySourceId.get(chunk.source)
    const sourceId = chunk.source
    if (!summary.has(sourceId)) {
      summary.set(sourceId, {
        sourceId,
        fileId: file?._id,
        filename: file?.filename ?? chunk.source,
      })
    }
  }
  return Array.from(summary.values())
}

export const deleteKnowledgeBaseFileChunks = async (
  knowledgeBase: KnowledgeBase,
  sourceIds: string[]
) => {
  if (!sourceIds || sourceIds.length === 0) {
    return
  }
  assertKnowledgeBaseHasId(knowledgeBase)

  const processor = getProcessor(knowledgeBase)
  await processor.deleteFiles(sourceIds)
}
