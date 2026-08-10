import {
  PermissionLevel,
  PermissionType,
  ToolExecutionPrincipal,
  ToolType,
} from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import { getToolFailure, toToolSet, type AiToolDefinition } from "."

const definition = (execute: jest.Mock): AiToolDefinition => ({
  name: "secured_tool",
  description: "A secured tool",
  sourceType: ToolType.INTERNAL_TABLE,
  authorization: {
    supportedPrincipals: [ToolExecutionPrincipal.REQUESTER],
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
  requestingUserId: "user_1",
}

describe("secured AI tool execution", () => {
  it("preserves structured tool errors", () => {
    expect(
      getToolFailure({
        error: {
          message: "The row does not match the table schema",
          status: 400,
        },
      })
    ).toBe('{"message":"The row does not match the table schema","status":400}')
  })

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

  it("applies tool-owned trusted bindings before authorization and execution", async () => {
    const execute = jest.fn().mockResolvedValue({ success: true })
    const authorize = jest.fn().mockResolvedValue(undefined)
    const toolDefinition = definition(execute)
    toolDefinition.authorization!.prepareInput = (input, context) => ({
      ...(input as { value: string; userId?: string }),
      userId: context.requestingUserId,
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

    await tools.secured_tool.execute?.(
      { value: "hello", userId: "attacker_selected_user" },
      { toolCallId: "call_1", messages: [] }
    )

    const trustedInput = { value: "hello", userId: "user_1" }
    expect(authorize).toHaveBeenCalledWith(
      expect.objectContaining({ input: trustedInput })
    )
    expect(execute).toHaveBeenCalledWith(
      trustedInput,
      expect.objectContaining({ toolCallId: "call_1" })
    )
  })

  it("creates an approval request with the prepared input without executing", async () => {
    const execute = jest.fn()
    const authorize = jest.fn().mockResolvedValue(undefined)
    const request = jest.fn().mockResolvedValue({ escalationId: "esc_1" })
    const toolDefinition = definition(execute)
    toolDefinition.authorization!.prepareInput = (input, context) => ({
      ...(input as { value: string; userId?: string }),
      userId: context.requestingUserId,
    })
    toolDefinition.approval = {
      summarize: () => ({
        title: "Approve secured tool",
        summary: "Run the secured tool",
      }),
    }
    const tools = toToolSet(
      [toolDefinition],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize,
            escalation: {
              request,
            },
          },
        ],
      ])
    )

    const result = await tools.secured_tool.execute?.(
      { value: "hello", userId: "attacker_selected_user" },
      { toolCallId: "call_1", messages: [] }
    )

    expect(request).toHaveBeenCalledWith({
      input: { value: "hello", userId: "user_1" },
      summary: {
        title: "Approve secured tool",
        summary: "Run the secured tool",
      },
      toolCallId: "call_1",
      messages: [],
    })
    expect(execute).not.toHaveBeenCalled()
    expect(result).toEqual({
      status: "pending_approval",
      escalationId: "esc_1",
      title: "Approve secured tool",
      summary: "Run the secured tool",
      note: "This tool call is waiting for human approval.",
    })
  })

  it("fails closed when a configured gate lacks approval metadata", async () => {
    const execute = jest.fn()
    const tools = toToolSet(
      [definition(execute)],
      new Map([
        [
          "secured_tool",
          {
            executionContext,
            principal: ToolExecutionPrincipal.REQUESTER,
            authorize: jest.fn().mockResolvedValue(undefined),
            escalation: {
              request: jest.fn(),
            },
          },
        ],
      ])
    )

    await expect(
      tools.secured_tool.execute?.(
        { value: "hello" },
        { toolCallId: "call_1", messages: [] }
      )
    ).rejects.toThrow("Tool does not support approval gates")
    expect(execute).not.toHaveBeenCalled()
  })
})
