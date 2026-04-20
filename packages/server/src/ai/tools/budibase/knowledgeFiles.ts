import {
  KnowledgeBaseFileStatus,
  ToolType,
  type KnowledgeBaseFile,
} from "@budibase/types"
import { tool } from "ai"
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
        total: metadata.length,
        ambiguous: isAmbiguous,
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
