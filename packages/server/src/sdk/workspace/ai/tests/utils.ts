import { ToolExecutionPrincipal } from "@budibase/types"

export const requesterTools = (...toolNames: string[]) =>
  toolNames.map(toolName => ({
    toolName,
    executionPrincipal: ToolExecutionPrincipal.REQUESTER,
  }))
