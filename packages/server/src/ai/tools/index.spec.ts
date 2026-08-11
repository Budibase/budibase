import {
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
  ToolType,
} from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import { toToolSet, type AiToolDefinition } from "."
import { filterAgentToolCollectionResult } from "./authorization"

const definition = (execute: jest.Mock): AiToolDefinition => ({
  name: "secured_tool",
  description: "A secured tool",
  sourceType: ToolType.INTERNAL_TABLE,
  authorization: {
    permissionType: PermissionType.TABLE,
    permissionLevel: PermissionLevel.READ,
    resourceId: "ta_1",
  },
  tool: tool({
    description: "A secured tool",
    inputSchema: z.object({ value: z.string() }),
    execute,
  }),
})

const executionContext = {
  tenantId: "tenant_1",
  workspaceId: "app_1",
  agentId: "agent_1",
  operationId: "operation_1",
  conversationId: "conversation_1",
  requester: {
    userId: "user_1",
    authorization: { mode: "current" as const },
  },
}

describe("secured AI tool execution", () => {
  it("authorizes immediately before executing the tool", async () => {
    const execute = jest.fn().mockResolvedValue({ success: true })
    const authorize = jest.fn().mockResolvedValue(undefined)
    const tools = toToolSet(
      [definition(execute)],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await tools.secured_tool.execute?.(
      { value: "hello" },
      { toolCallId: "call_1", messages: [] }
    )

    expect(authorize).toHaveBeenCalledWith(
      expect.objectContaining({
        input: { value: "hello" },
        executionContext,
        principal: ToolExecutionPrincipal.REQUESTER,
      })
    )
    expect(execute).toHaveBeenCalledTimes(1)
  })

  it("does not execute after an authorization denial", async () => {
    const execute = jest.fn()
    const authorize = jest.fn().mockRejectedValue(new Error("denied"))
    const tools = toToolSet(
      [definition(execute)],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [] }
      )
    ).rejects.toThrow("denied")
    expect(execute).not.toHaveBeenCalled()
  })

  it("does not execute a tool without authorization metadata", async () => {
    const execute = jest.fn()
    const authorize = jest.fn()
    const toolDefinition = definition(execute)
    toolDefinition.authorization = undefined
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [] }
      )
    ).rejects.toThrow("Tool is not available in this security context")
    expect(authorize).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })

  it("filters collection results using resource permissions", async () => {
    const execute = jest.fn().mockResolvedValue({
      tables: [
        { id: "ta_allowed", name: "Allowed" },
        { id: "ta_denied", name: "Denied" },
      ],
    })
    const authorize = jest.fn().mockImplementation(({ authorization }) => {
      if (authorization.resourceId === "ta_denied") {
        throw new Error("denied")
      }
    })
    const toolDefinition = definition(execute)
    toolDefinition.filterResult = (result, runtime) =>
      filterAgentToolCollectionResult({
        result,
        collectionKey: "tables",
        permissionType: PermissionType.TABLE,
        permissionLevel: PermissionLevel.READ,
        resolveResourceId: item =>
          typeof item === "object" && item && "id" in item
            ? String(item.id)
            : undefined,
        runtime,
      })
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [] }
      )
    ).resolves.toEqual({
      tables: [{ id: "ta_allowed", name: "Allowed" }],
    })
    expect(authorize).toHaveBeenCalledWith(
      expect.objectContaining({
        authorization: expect.objectContaining({ resourceId: "ta_denied" }),
      })
    )
  })
})
