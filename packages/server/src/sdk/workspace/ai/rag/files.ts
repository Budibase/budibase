import {
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
import { RetrievedContextChunk } from "./processors"
import { GeminiRagProcessor } from "./processors/gemini"
import {
  isTabularKnowledgeFile,
  searchTabularRowsForExactMatches,
} from "./processors/tabularText"
import { ObjectStoreBuckets } from "../../../../constants"

const resolveKnowledgeBasesForAgent = async (
  agent: Agent
): Promise<KnowledgeBase[]> => {
  const knowledgeBaseIds = (agent.knowledgeBases || []).filter(Boolean)
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

const loadFileBuffer = async (objectKey: string): Promise<Buffer> => {
  const { stream } = await objectStore.getReadStream(
    ObjectStoreBuckets.APPS,
    objectKey
  )

  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(new Uint8Array(chunk))
  }
  return Buffer.concat(chunks)
}

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

const retrieveExactTabularMatches = async (
  readyFiles: KnowledgeBaseFile[],
  question: string
): Promise<RetrievedContextChunk[]> => {
  const chunks: RetrievedContextChunk[] = []

  for (const file of readyFiles) {
    if (
      !file.ragSourceId ||
      !file.objectStoreKey ||
      !isTabularKnowledgeFile({
        filename: file.filename,
        mimetype: file.mimetype,
      })
    ) {
      continue
    }

    try {
      const buffer = await loadFileBuffer(file.objectStoreKey)
      const matches = searchTabularRowsForExactMatches({
        filename: file.filename,
        mimetype: file.mimetype,
        buffer,
        query: question,
      })

      chunks.push(
        ...matches.map(match => ({
          source: file.ragSourceId,
          chunkText: match.chunkText,
        }))
      )
    } catch (error) {
      console.error("Failed to run exact tabular knowledge lookup", {
        fileId: file._id,
        filename: file.filename,
        error,
      })
    }
  }

  return chunks
}

export const ensureKnowledgeBaseForAgent = async (
  agentId: string
): Promise<KnowledgeBase> => {
  const { result } = await locks.doWithLock(
    {
      name: LockName.AGENT_RAG_KNOWLEDGE_BASE,
      type: LockType.AUTO_EXTEND,
      resource: agentId,
    },
    async () => {
      const agent = await agentsSdk.getOrThrow(agentId)
      const existing = await getAgentKnowledgeBase(agent.knowledgeBases)
      if (existing) {
        return existing
      }

      const created = await knowledgeBaseSdk.create({
        name: `Agent files (${agent._id})`,
        type: KnowledgeBaseType.GEMINI,
      })

      await agentsSdk.update({
        ...agent,
        knowledgeBases: created._id ? [created._id] : [],
      })

      return created
    }
  )

  return result
}

const getKnowledgeBaseIdsForAgent = async (
  agentId: string
): Promise<string[]> => {
  const agent = await agentsSdk.getOrThrow(agentId)
  return (agent.knowledgeBases || []).filter(Boolean)
}

export const listFilesForAgent = async (
  agentId: string
): Promise<KnowledgeBaseFile[]> => {
  const knowledgeBaseIds = await getKnowledgeBaseIdsForAgent(agentId)
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

    const exactTabularChunks = await retrieveExactTabularMatches(
      readyFiles,
      question
    )
    if (exactTabularChunks.length) {
      chunks.push(...exactTabularChunks)
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
