import {
  type AgentMessageRagSource,
  type Agent,
  KnowledgeBaseFileStatus,
  ToolType,
  FeatureFlag,
  type KnowledgeBaseFile,
} from "@budibase/types"
import { features, objectStore } from "@budibase/backend-core"
import { generateText, type ModelMessage, tool } from "ai"
import { buffer } from "stream/consumers"
import { z } from "zod"
import sdk from "../../../sdk"
import type { BudibaseToolDefinition } from "."

type FilenameMatchMode = "smart" | "exact" | "contains"

interface KnowledgeFileMetadata {
  fileId?: string
  filename: string
  status: KnowledgeBaseFileStatus
  sizeBytes?: number
  mimeType?: string
  uploadedAt?: string
  processedAt?: string
  errorMessage?: string
  matchedBy?: string
}

interface RankedMatch {
  score: number
  matchedBy: string
  file: KnowledgeBaseFile
}

const GEMINI_RETRIEVAL_UNAVAILABLE_MESSAGE =
  "Gemini knowledge retrieval is temporarily unavailable (upstream 503). Budibase is operating normally; please retry shortly."
const GEMINI_UPSTREAM_EVENT = "ai.gemini.upstream_unavailable"
const MAX_IMAGE_FILES_FOR_HYBRID_SEARCH = 2
const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024
const IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
])

interface SearchKnowledgeChunk {
  source?: string
  chunkText?: string
}

const isSupportedImageKnowledgeFile = (file: KnowledgeBaseFile) => {
  if (file.status !== KnowledgeBaseFileStatus.READY) {
    return false
  }
  if (!file.objectStoreKey) {
    return false
  }
  const normalizedMimetype = (file.mimetype || "").trim().toLowerCase()
  return IMAGE_MIME_TYPES.has(normalizedMimetype)
}

const toImageDataUrl = (input: { data: Buffer; mimetype?: string }) => {
  const contentType = (input.mimetype || "application/octet-stream").trim()
  return `data:${contentType};base64,${input.data.toString("base64")}`
}

const createImageSearchPrompt = ({
  question,
  filename,
}: {
  question: string
  filename: string
}) => {
  return [
    "You are extracting evidence from an image file for a knowledge search.",
    `Image filename: ${filename}`,
    `User question: ${question}`,
    "Return only concise factual evidence relevant to the user question.",
    "If the image does not contain relevant information, return: NO_RELEVANT_EVIDENCE",
  ].join("\n\n")
}

const searchImageKnowledgeForAgent = async ({
  agent,
  agentId,
  question,
}: {
  agent: Agent
  agentId: string
  question: string
}): Promise<{
  text: string
  chunks: SearchKnowledgeChunk[]
  sources: AgentMessageRagSource[]
}> => {
  if (!agent.aiconfig) {
    return { text: "", chunks: [], sources: [] }
  }

  const files = await sdk.ai.rag.listFilesForAgent(agentId)
  const candidateImages = files
    .filter(isSupportedImageKnowledgeFile)
    .sort((a, b) => toEpochMillis(b.createdAt) - toEpochMillis(a.createdAt))
    .slice(0, MAX_IMAGE_FILES_FOR_HYBRID_SEARCH)

  if (candidateImages.length === 0) {
    return { text: "", chunks: [], sources: [] }
  }

  const llm = await sdk.ai.llm.createLLM(agent.aiconfig)
  const textSegments: string[] = []
  const chunks: SearchKnowledgeChunk[] = []
  const sources: AgentMessageRagSource[] = []

  for (const file of candidateImages) {
    try {
      const sourceId = file.ragSourceId || file._id || file.filename
      if (!sourceId) {
        continue
      }
      const size = file.size || 0
      if (size > MAX_IMAGE_FILE_SIZE_BYTES) {
        continue
      }

      const { stream } = await objectStore.getReadStream(
        objectStore.ObjectStoreBuckets.APPS,
        file.objectStoreKey
      )
      const imageBuffer = await buffer(stream)
      const dataUrl = toImageDataUrl({
        data: imageBuffer,
        mimetype: file.mimetype,
      })
      const messages: ModelMessage[] = [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: new URL(dataUrl),
            },
            {
              type: "text",
              text: createImageSearchPrompt({
                question,
                filename: file.filename,
              }),
            },
          ],
        },
      ]
      const response = await generateText({
        model: llm.chat,
        messages,
        providerOptions: llm.providerOptions?.(false),
      })
      const content = response.text.trim()
      if (!content || content === "NO_RELEVANT_EVIDENCE") {
        continue
      }

      sources.push({
        sourceId,
        fileId: file._id,
        filename: file.filename,
      })
      chunks.push({
        source: sourceId,
        chunkText: content,
      })
      textSegments.push(`Image ${file.filename}: ${content}`)
    } catch (error: any) {
      console.error("Failed to analyze knowledge image", {
        agentId,
        fileId: file._id,
        filename: file.filename,
        status: error?.status,
        message: error?.message,
      })
    }
  }

  return {
    text: textSegments.join("\n\n"),
    chunks,
    sources,
  }
}

const isGeminiRetrievalUnavailable = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false
  }

  const maybeStatus = (error as { status?: unknown }).status
  if (maybeStatus === 503) {
    return true
  }

  const maybeMessage = String((error as { message?: unknown }).message || "")
    .toLowerCase()
    .trim()
  if (!maybeMessage) {
    return false
  }

  return (
    maybeMessage.includes("upstream unavailable") ||
    maybeMessage.includes("service unavailable")
  )
}

const toEpochMillis = (value?: string | number) => {
  if (value == null) {
    return 0
  }

  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

const toISOString = (value?: string | number) => {
  if (value == null) {
    return undefined
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed.toISOString()
}

const stripExtension = (value: string) => value.replace(/\.[^/.\s]+$/, "")

const normalizeFilenamePart = (value: string, caseSensitive: boolean) => {
  const resolved = caseSensitive ? value : value.toLowerCase()
  return resolved
    .replace(/[._-]+/g, " ")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const buildMetadata = (
  file: KnowledgeBaseFile,
  matchedBy?: string
): KnowledgeFileMetadata => ({
  fileId: file._id,
  filename: file.filename,
  status: file.status,
  sizeBytes: file.size,
  mimeType: file.mimetype,
  uploadedAt: toISOString(file.createdAt),
  processedAt: file.processedAt,
  errorMessage: file.errorMessage,
  matchedBy,
})

const rankSmartFilenameMatch = (
  actualName: string,
  inputName: string,
  caseSensitive: boolean
): { score: number; matchedBy: string } | null => {
  const actualFilename = normalizeFilenamePart(actualName, caseSensitive)
  const queryFilename = normalizeFilenamePart(inputName, caseSensitive)

  if (!actualFilename || !queryFilename) {
    return null
  }

  if (actualFilename === queryFilename) {
    return { score: 100, matchedBy: "filename-exact" }
  }

  const actualBase = normalizeFilenamePart(
    stripExtension(actualName),
    caseSensitive
  )
  const queryBase = normalizeFilenamePart(
    stripExtension(inputName),
    caseSensitive
  )

  if (actualBase && queryBase && actualBase === queryBase) {
    return { score: 90, matchedBy: "basename-exact" }
  }

  if (actualBase && queryBase && actualBase.startsWith(queryBase)) {
    return { score: 80, matchedBy: "basename-prefix" }
  }

  if (actualBase && queryBase && actualBase.includes(queryBase)) {
    return { score: 70, matchedBy: "basename-contains" }
  }

  if (actualFilename.includes(queryFilename)) {
    return { score: 60, matchedBy: "filename-contains" }
  }

  return null
}

const getRankedMatches = (
  files: KnowledgeBaseFile[],
  inputName: string,
  mode: FilenameMatchMode,
  caseSensitive: boolean
) => {
  if (mode === "smart") {
    return files
      .map(file => {
        const ranked = rankSmartFilenameMatch(
          file.filename || "",
          inputName,
          caseSensitive
        )
        if (!ranked) {
          return null
        }
        return { ...ranked, file } satisfies RankedMatch
      })
      .filter((value): value is RankedMatch => Boolean(value))
      .sort((a, b) => b.score - a.score)
  }

  const query = caseSensitive ? inputName : inputName.toLowerCase()

  return files
    .filter(file => {
      const candidate = caseSensitive
        ? file.filename || ""
        : (file.filename || "").toLowerCase()
      if (mode === "contains") {
        return candidate.includes(query)
      }
      return candidate === query
    })
    .map(file => ({
      score: mode === "exact" ? 100 : 60,
      matchedBy: mode === "exact" ? "filename-exact" : "filename-contains",
      file,
    }))
}

export const createKnowledgeFilesTool = (
  agentId: string
): BudibaseToolDefinition => ({
  name: "list_knowledge_files",
  sourceType: ToolType.INTERNAL_TABLE,
  sourceLabel: "Budibase",
  description:
    "List knowledge files attached to this agent, including metadata like size, status, and upload time",
  tool: tool({
    description:
      "List knowledge files attached to this agent. Use filename to answer questions like 'what size is policy' even without file extensions.",
    inputSchema: z.object({
      filename: z
        .string()
        .trim()
        .min(1)
        .optional()
        .describe(
          "Optional filename or basename filter, e.g. policy or policy.pdf"
        ),
      matchMode: z
        .enum(["smart", "exact", "contains"])
        .default("smart")
        .describe("How filename matching should work"),
      caseSensitive: z
        .boolean()
        .default(false)
        .describe("Whether filename matching should be case-sensitive"),
    }),
    execute: async ({ filename, matchMode, caseSensitive }) => {
      const resolvedMatchMode = matchMode || "smart"
      const resolvedCaseSensitive = caseSensitive ?? false

      const files = await sdk.ai.rag.listFilesForAgent(agentId)
      const sortedFiles = [...files].sort(
        (a, b) => toEpochMillis(b.createdAt) - toEpochMillis(a.createdAt)
      )
      const totalFiles = sortedFiles.length
      const hasFilenameFilter = Boolean(filename)

      const rankedMatches = hasFilenameFilter
        ? getRankedMatches(
            sortedFiles,
            filename!,
            resolvedMatchMode,
            resolvedCaseSensitive
          )
        : sortedFiles.map(file => ({
            score: 0,
            matchedBy: "unfiltered",
            file,
          }))

      const metadata = rankedMatches.map(match =>
        buildMetadata(
          match.file,
          hasFilenameFilter ? match.matchedBy : undefined
        )
      )
      const bestMatch = hasFilenameFilter ? metadata[0] : undefined
      const candidates = hasFilenameFilter ? metadata.slice(0, 5) : []

      const isAmbiguous =
        hasFilenameFilter &&
        rankedMatches.length > 1 &&
        rankedMatches[0].score === rankedMatches[1].score

      return {
        matchedCount: metadata.length,
        totalFiles,
        total: metadata.length,
        ambiguous: isAmbiguous,
        needsClarification: isAmbiguous,
        bestMatch,
        candidates,
        readyCount: metadata.filter(
          file => file.status === KnowledgeBaseFileStatus.READY
        ).length,
        processingCount: metadata.filter(
          file => file.status === KnowledgeBaseFileStatus.PROCESSING
        ).length,
        failedCount: metadata.filter(
          file => file.status === KnowledgeBaseFileStatus.FAILED
        ).length,
        files: metadata,
      }
    },
  }),
})

export const createKnowledgeSearchTool = (
  agentId: string
): BudibaseToolDefinition => ({
  name: "search_knowledge",
  sourceType: ToolType.INTERNAL_TABLE,
  sourceLabel: "Budibase",
  description:
    "Search the agent knowledge files and return relevant context snippets with source metadata",
  tool: tool({
    description:
      "Search attached knowledge files for answer context. Use for factual questions grounded in uploaded docs.",
    inputSchema: z.object({
      question: z.string().trim().min(1),
    }),
    execute: async ({ question }) => {
      if (!(await features.isEnabled(FeatureFlag.AI_RAG))) {
        return { context: "", sources: [], chunks: [] }
      }

      const agent = await sdk.ai.agents.getOrThrow(agentId)
      let ragText = ""
      let ragSources: AgentMessageRagSource[] = []
      let ragChunks: SearchKnowledgeChunk[] = []
      let ragUnavailable = false

      try {
        const result = await sdk.ai.rag.retrieveContextForAgent(agent, question)
        ragText = result.text
        ragSources = result.sources
        ragChunks = result.chunks
      } catch (error: any) {
        if (isGeminiRetrievalUnavailable(error)) {
          console.error("[AI_UPSTREAM] Gemini unavailable", {
            event: GEMINI_UPSTREAM_EVENT,
            provider: "gemini",
            path: "knowledge_retrieval",
            upstreamStatus: error?.status,
            agentId,
            errorMessage: error?.message,
          })
          ragUnavailable = true
        } else {
          console.error("Failed to retrieve agent knowledge context", {
            agentId,
            status: error?.status,
            message: error?.message,
          })
          throw error
        }
      }

      const imageResult = await searchImageKnowledgeForAgent({
        agent,
        agentId,
        question,
      })
      const allSources = [...ragSources, ...imageResult.sources]
      const allChunks = [...ragChunks, ...imageResult.chunks]
      const context = [ragText, imageResult.text].filter(Boolean).join("\n\n")

      if (ragUnavailable && allSources.length === 0) {
        throw new Error(GEMINI_RETRIEVAL_UNAVAILABLE_MESSAGE)
      }

      return {
        context,
        sources: allSources,
        chunks: allChunks,
      }
    },
  }),
})
