import { DocumentType, SEPARATOR } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import { listContextDocsBySession } from "../../../sdk/workspace/escalations"

export const LIST_SESSION_ESCALATIONS_TOOL_NAME = "list_session_escalations"

interface CreateListSessionEscalationsToolParams {
  sessionId: string
}

// A read-only system tool exposed alongside escalate. Lets the model see the
// escalations already raised in this conversation - and their current state
export const createListSessionEscalationsTool = ({
  sessionId,
}: CreateListSessionEscalationsToolParams) =>
  tool({
    description:
      "List the human-approval escalations already raised in this " +
      "conversation, with their current status (pending, resolved, expired) " +
      "and whether each was accepted. Call this before escalating to check " +
      "whether the same request is already awaiting approval or has already " +
      "been approved - do not escalate the same request twice.",
    inputSchema: z.object({}),
    execute: async () => {
      const docs = await listContextDocsBySession(sessionId)
      const prefix = `${DocumentType.ESCALATION_CONTEXT}${SEPARATOR}`
      return {
        escalations: docs.map(doc => ({
          escalationId: doc._id?.slice(prefix.length),
          title: doc.title,
          summary: doc.summary,
          status: doc.resolution,
          accepted: doc.response?.accepted,
        })),
      }
    },
  })
