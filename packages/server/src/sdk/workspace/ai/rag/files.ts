import {
  AgentMessageRagSource,
  type Agent,
  type KnowledgeBase,
  type KnowledgeBaseFile,
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
} from "@budibase/types"
import { knowledgeBase as knowledgeBaseSdk } from ".."
import { RetrievedContextChunk } from "./processors"
import { GeminiRagProcessor } from "./processors/gemini"

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

    const readyFileSources = knowledgeBaseFiles
      .filter(
        file =>
          file.status === KnowledgeBaseFileStatus.READY && file.ragSourceId
      )
      .map(file => file.ragSourceId)

    if (readyFileSources.length === 0) {
      continue
    }

    const processor = getProcessor(knowledgeBase)
    const returned = await processor.search(question)
    chunks.push(...returned)
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
  const fileBySourceId = new Map(files.map(file => [file.ragSourceId, file]))
  const summary = new Map<string, AgentMessageRagSource>()

  for (const chunk of chunks) {
    if (!chunk.source) {
      continue
    }
    const file = fileBySourceId.get(chunk.source)
    if (!summary.has(chunk.source)) {
      summary.set(chunk.source, {
        sourceId: chunk.source,
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
