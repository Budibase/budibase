import { AgentMessageMetadata } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"

interface CreateReportUsedSourcesToolParams {
  getSourceById: (
    sourceId: string
  ) => NonNullable<AgentMessageMetadata["ragSources"]>[number] | undefined
  onAcceptedSources: (accepted: AgentMessageMetadata["ragSources"]) => void
}

export const createReportUsedSourcesTool = ({
  getSourceById,
  onAcceptedSources,
}: CreateReportUsedSourcesToolParams) =>
  tool({
    description:
      "Report the specific knowledge sources that were actually used in the final answer. Only sourceIds returned by search_knowledge in this run are valid.",
    inputSchema: z.object({
      sourceIds: z.array(z.string().trim().min(1)).default([]),
    }),
    execute: async ({ sourceIds }) => {
      const accepted: NonNullable<AgentMessageMetadata["ragSources"]> = []
      const ignored: string[] = []

      for (const sourceId of sourceIds || []) {
        const source = getSourceById(sourceId)
        if (!source) {
          ignored.push(sourceId)
          continue
        }
        accepted.push(source)
      }

      onAcceptedSources(accepted)

      return {
        accepted,
        acceptedCount: accepted.length,
        ignored,
        ignoredCount: ignored.length,
      }
    },
  })
