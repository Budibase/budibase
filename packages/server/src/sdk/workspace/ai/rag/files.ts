import {
  type AgentMessageRagSource,
  type Agent,
  type KnowledgeBase,
  type KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  LockName,
  LockType,
} from "@budibase/types"
import { HTTPError, locks } from "@budibase/backend-core"
import { agents as agentsSdk, knowledgeBase as knowledgeBaseSdk } from ".."
import type { RetrievedContextChunk } from "./processors"
import { GeminiRagProcessor } from "./processors/gemini"

const getKnowledgeBaseFileSourceIds = (file: KnowledgeBaseFile) =>
  Array.from(
    new Set([file.ragSourceId, ...(file.ragSourceIds || [])].filter(Boolean))
  )

const getPrimaryKnowledgeBaseFileSourceId = (file: KnowledgeBaseFile) =>
  getKnowledgeBaseFileSourceIds(file)[0]

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

const getReadySourceIdByFilename = (readyFiles: KnowledgeBaseFile[]) => {
  const sourceIdByFilename = new Map<string, string>()
  const ambiguousFilenames = new Set<string>()

  for (const file of readyFiles) {
    const primarySourceId = getPrimaryKnowledgeBaseFileSourceId(file)
    if (!primarySourceId) {
      continue
    }

    const normalizedFilename = normalizeFilenameLookup(file.filename)
    if (!normalizedFilename || ambiguousFilenames.has(normalizedFilename)) {
      continue
    }

    const existingSourceId = sourceIdByFilename.get(normalizedFilename)
    if (existingSourceId && existingSourceId !== primarySourceId) {
      sourceIdByFilename.delete(normalizedFilename)
      ambiguousFilenames.add(normalizedFilename)
      continue
    }

    sourceIdByFilename.set(normalizedFilename, primarySourceId)
  }

  return sourceIdByFilename
}

const getCanonicalSourceIdByKnownSourceId = (
  readyFiles: KnowledgeBaseFile[]
) => {
  const canonicalSourceIdByKnownSourceId = new Map<string, string>()

  for (const file of readyFiles) {
    const primarySourceId = getPrimaryKnowledgeBaseFileSourceId(file)
    if (!primarySourceId) {
      continue
    }

    for (const sourceId of getKnowledgeBaseFileSourceIds(file)) {
      canonicalSourceIdByKnownSourceId.set(sourceId, primarySourceId)
    }
  }

  return canonicalSourceIdByKnownSourceId
}

const dedupeRetrievedChunks = (chunks: RetrievedContextChunk[]) => {
  const seen = new Set<string>()
  const deduped: RetrievedContextChunk[] = []

  for (const chunk of chunks) {
    const normalizedText = chunk.chunkText.trim().replace(/\s+/g, " ")
    if (!normalizedText) {
      continue
    }

    const key = `${chunk.source || ""}::${normalizedText}`
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    deduped.push({
      ...chunk,
      chunkText: chunk.chunkText.trim(),
    })
  }

  return deduped
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

function getProcessor(kb: KnowledgeBase) {
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
  const knowledgeBaseId = knowledgeBase._id
  if (!knowledgeBaseId) {
    throw new Error("Knowledge base id not set")
  }

  const processor = getProcessor(knowledgeBase)
  await processor.ingestKnowledgeBaseFile(knowledgeBaseFile, fileBuffer)
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

    if (readyFiles.length === 0) {
      continue
    }

    const canonicalSourceIdByKnownSourceId =
      getCanonicalSourceIdByKnownSourceId(readyFiles)
    const readySourceIdByFilename = getReadySourceIdByFilename(readyFiles)
    const processor = getProcessor(knowledgeBase)
    const returned = await processor.search(question)

    for (const chunk of returned) {
      if (!chunk.source) {
        chunks.push(chunk)
        continue
      }

      const canonicalSourceId = canonicalSourceIdByKnownSourceId.get(
        chunk.source
      )
      if (canonicalSourceId) {
        chunks.push({
          ...chunk,
          source: canonicalSourceId,
        })
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

  const dedupedChunks = dedupeRetrievedChunks(chunks)
  if (dedupedChunks.length === 0) {
    return { text: "", chunks: [], sources: [] }
  }

  return {
    text: dedupedChunks.map(chunk => chunk.chunkText).join("\n\n"),
    chunks: dedupedChunks,
    sources: toSourceMetadata(dedupedChunks, files),
  }
}

const toSourceMetadata = (
  chunks: RetrievedContextChunk[],
  files: KnowledgeBaseFile[]
): AgentMessageRagSource[] => {
  const readyFiles = files.filter(
    file => file.status === KnowledgeBaseFileStatus.READY
  )
  const fileBySourceId = new Map<string, KnowledgeBaseFile>()
  for (const file of readyFiles) {
    for (const sourceId of getKnowledgeBaseFileSourceIds(file)) {
      fileBySourceId.set(sourceId, file)
    }
  }
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

  const processor = getProcessor(knowledgeBase)
  await processor.deleteFiles(sourceIds)
}
