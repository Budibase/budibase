import type { Agent } from "@budibase/types"
import type {
  Tool,
  ToolSet,
  TypedToolCall,
  TypedToolResult,
  UIMessage,
} from "ai"
import { ToolType } from "@budibase/types"
import {
  findIncompleteToolCalls,
  formatIncompleteToolCallError,
  getLiveOperation,
  getLiveOperations,
  getToolDisplayNames,
  IncompleteToolCall,
  groupToolResultsByOutcome,
  updatePendingToolCalls,
  updateUnrecoveredToolFailures,
} from "./utils"

type MessagePart = NonNullable<UIMessage["parts"]>[number]

const toolPart = (part: Record<string, unknown>): MessagePart =>
  part as MessagePart

describe("getToolDisplayNames", () => {
  it("returns readable names keyed by raw tool name", () => {
    expect(
      getToolDisplayNames([
        {
          name: "ta_123_list_rows",
          readableName: "Research Notes.list_rows",
          description: "List rows",
          sourceType: ToolType.INTERNAL_TABLE,
          tool: {} as Tool,
        },
        {
          name: "list_tables",
          description: "List tables",
          sourceType: ToolType.INTERNAL_TABLE,
          tool: {} as Tool,
        },
      ])
    ).toEqual({
      ta_123_list_rows: "Research Notes.list_rows",
    })
  })
})

describe("getLiveOperations", () => {
  it("returns all live operations", () => {
    const operation = {
      id: "operation_2",
      name: "Main operation",
      live: true,
      promptInstructions: "Live instructions",
    }
    const agent = {
      _id: "agent_1",
      name: "Support Agent",
      live: false,
      operations: [
        {
          id: "operation_1",
          name: "Draft operation",
          live: false,
        },
        operation,
      ],
    } as Agent

    expect(getLiveOperations(agent)).toEqual([operation])
  })

  it("returns an empty array when there are no live operations", () => {
    const agent = {
      _id: "agent_1",
      name: "Support Agent",
      live: true,
      operations: [
        {
          id: "operation_1",
          name: "Main operation",
          live: false,
          promptInstructions: "Draft instructions",
        },
      ],
    } as Agent

    expect(getLiveOperations(agent)).toEqual([])
  })
})

describe("getLiveOperation", () => {
  it("returns the first live operation", () => {
    const firstLiveOperation = {
      id: "operation_2",
      name: "Main operation",
      live: true,
    }
    const agent = {
      _id: "agent_1",
      name: "Support Agent",
      live: true,
      operations: [
        {
          id: "operation_1",
          name: "Draft operation",
          live: false,
        },
        firstLiveOperation,
        {
          id: "operation_3",
          name: "Secondary operation",
          live: true,
        },
      ],
    } as Agent

    expect(getLiveOperation(agent)).toEqual(firstLiveOperation)
  })
})

describe("incomplete tool call detection", () => {
  describe("findIncompleteToolCalls", () => {
    it("returns empty array for messages with no tool parts", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text", text: "Hello" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [{ type: "text", text: "Hi there!" }],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([])
    })

    it("returns empty array for completed tool calls (output-available)", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "assistant",
          parts: [
            toolPart({
              type: "tool-list_automations",
              toolName: "list_automations",
              toolCallId: "call-1",
              state: "output-available",
              input: {},
              output: { automations: [] },
            }),
          ],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([])
    })

    it("returns empty array for tool calls with output-error state", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "assistant",
          parts: [
            toolPart({
              type: "tool-list_automations",
              toolName: "list_automations",
              toolCallId: "call-1",
              state: "output-error",
              input: {},
              errorText: "Something went wrong",
            }),
          ],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([])
    })

    it("returns empty array for tool calls with output-denied state", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "assistant",
          parts: [
            toolPart({
              type: "tool-list_automations",
              toolName: "list_automations",
              toolCallId: "call-1",
              state: "output-denied",
              input: {},
            }),
          ],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([])
    })

    it("detects tool call stuck in input-streaming state", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "assistant",
          parts: [
            toolPart({
              type: "tool-list_automations",
              toolName: "list_automations",
              toolCallId: "call-1",
              state: "input-streaming",
              input: undefined,
            }),
          ],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([
        {
          toolName: "list_automations",
          toolCallId: "call-1",
          state: "input-streaming",
        },
      ])
    })

    it("detects tool call stuck in input-available state", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "assistant",
          parts: [
            toolPart({
              type: "tool-get_automation",
              toolName: "get_automation",
              toolCallId: "call-2",
              state: "input-available",
              input: { automationId: "au_123" },
            }),
          ],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([
        {
          toolName: "get_automation",
          toolCallId: "call-2",
          state: "input-available",
        },
      ])
    })

    it("detects multiple incomplete tool calls across messages", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "assistant",
          parts: [
            toolPart({
              type: "tool-list_automations",
              toolName: "list_automations",
              toolCallId: "call-1",
              state: "output-available",
              input: {},
              output: { automations: [] },
            }),
          ],
        },
        {
          id: "msg-2",
          role: "assistant",
          parts: [
            toolPart({
              type: "tool-tool_a",
              toolName: "tool_a",
              toolCallId: "call-2",
              state: "input-available",
              input: {},
            }),
            toolPart({
              type: "tool-tool_b",
              toolName: "tool_b",
              toolCallId: "call-3",
              state: "input-streaming",
              input: undefined,
            }),
          ],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toHaveLength(2)
      expect(result).toContainEqual({
        toolName: "tool_a",
        toolCallId: "call-2",
        state: "input-available",
      })
      expect(result).toContainEqual({
        toolName: "tool_b",
        toolCallId: "call-3",
        state: "input-streaming",
      })
    })

    it("ignores user messages", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "user",
          parts: [
            toolPart({
              type: "tool-fake",
              toolName: "fake",
              toolCallId: "call-1",
              state: "input-available",
              input: {},
            }),
          ],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([])
    })

    it("handles messages without parts", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "assistant",
        } as UIMessage,
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([])
    })

    it("detects dynamic tool calls stuck in incomplete state", () => {
      const messages: UIMessage[] = [
        {
          id: "msg-1",
          role: "assistant",
          parts: [
            toolPart({
              type: "dynamic-tool",
              toolName: "custom_query",
              toolCallId: "call-dyn-1",
              state: "input-available",
              input: { query: "SELECT * FROM users" },
            }),
          ],
        },
      ]

      const result = findIncompleteToolCalls(messages)
      expect(result).toEqual([
        {
          toolName: "custom_query",
          toolCallId: "call-dyn-1",
          state: "input-available",
        },
      ])
    })
  })

  describe("updatePendingToolCalls", () => {
    it("adds tool calls to pending set", () => {
      const pending = new Set<string>()
      const toolCalls: TypedToolCall<ToolSet>[] = [
        {
          type: "tool-call",
          toolCallId: "call-1",
          toolName: "list_automations",
          input: {},
          dynamic: true,
        },
      ]
      const toolResults: TypedToolResult<ToolSet>[] = []

      updatePendingToolCalls(pending, toolCalls, toolResults)
      expect(pending.has("call-1")).toBe(true)
    })

    it("removes tool calls when results arrive", () => {
      const pending = new Set<string>(["call-1"])
      const toolCalls: TypedToolCall<ToolSet>[] = []
      const toolResults: TypedToolResult<ToolSet>[] = [
        {
          type: "tool-result",
          toolCallId: "call-1",
          toolName: "list_automations",
          input: {},
          output: {},
        },
      ]

      updatePendingToolCalls(pending, toolCalls, toolResults)
      expect(pending.has("call-1")).toBe(false)
    })

    it("handles mixed tool calls and results", () => {
      const pending = new Set<string>(["call-1"])
      const toolCalls: TypedToolCall<ToolSet>[] = [
        {
          type: "tool-call",
          toolCallId: "call-2",
          toolName: "tool_b",
          input: {},
          dynamic: true,
        },
      ]
      const toolResults: TypedToolResult<ToolSet>[] = [
        {
          type: "tool-result",
          toolCallId: "call-1",
          toolName: "tool_a",
          input: {},
          output: {},
        },
      ]

      updatePendingToolCalls(pending, toolCalls, toolResults)
      expect(pending.has("call-1")).toBe(false)
      expect(pending.has("call-2")).toBe(true)
    })
  })

  describe("updateUnrecoveredToolFailures", () => {
    it("flags a tool that ends in tool-error", () => {
      const unrecovered = new Set<string>()

      updateUnrecoveredToolFailures(unrecovered, [], ["send_email"])

      expect(unrecovered.has("send_email")).toBe(true)
    })

    it("clears the flag once the same tool later succeeds", () => {
      const unrecovered = new Set<string>(["send_email"])
      const toolResults: TypedToolResult<ToolSet>[] = [
        {
          type: "tool-result",
          toolCallId: "call-2",
          toolName: "send_email",
          input: {},
          output: {},
        },
      ]

      updateUnrecoveredToolFailures(unrecovered, toolResults, [])

      expect(unrecovered.has("send_email")).toBe(false)
    })

    it("leaves other tools' failure state untouched", () => {
      const unrecovered = new Set<string>(["send_email"])

      updateUnrecoveredToolFailures(unrecovered, [], ["escalate"])

      expect(unrecovered.has("send_email")).toBe(true)
      expect(unrecovered.has("escalate")).toBe(true)
    })
  })

  describe("groupToolResultsByOutcome", () => {
    const escalateResult = (status: string): TypedToolResult<ToolSet> => ({
      type: "tool-result",
      toolCallId: "call-1",
      toolName: "escalate",
      input: {},
      output: { status },
    })

    it("treats a real escalation (pending_approval) as a success", () => {
      const { successResults, successNames, semanticFailureNames } =
        groupToolResultsByOutcome([escalateResult("pending_approval")])

      expect(successResults).toHaveLength(1)
      expect(successNames).toEqual(["escalate"])
      expect(semanticFailureNames).toEqual([])
    })

    it("treats an unavailable escalation as a semantic failure, not a success", () => {
      const { successResults, successNames, semanticFailureNames } =
        groupToolResultsByOutcome([escalateResult("unavailable")])

      expect(successResults).toEqual([])
      expect(successNames).toEqual([])
      expect(semanticFailureNames).toEqual(["escalate"])
    })

    it("treats an already_approved resume result as harmless, not needs_input", () => {
      const { successResults, successNames, semanticFailureNames } =
        groupToolResultsByOutcome([escalateResult("already_approved")])

      expect(successResults).toHaveLength(1)
      expect(successNames).toEqual([])
      expect(semanticFailureNames).toEqual([])
    })

    it("leaves non-escalate tool results untouched", () => {
      const toolResult: TypedToolResult<ToolSet> = {
        type: "tool-result",
        toolCallId: "call-2",
        toolName: "send_email",
        input: {},
        output: {},
      }

      const { successResults, successNames, semanticFailureNames } =
        groupToolResultsByOutcome([toolResult])

      expect(successResults).toEqual([toolResult])
      expect(successNames).toEqual(["send_email"])
      expect(semanticFailureNames).toEqual([])
    })
  })

  describe("formatIncompleteToolCallError", () => {
    it("formats error with no tool names", () => {
      const result = formatIncompleteToolCallError([])
      expect(result).toBe(
        "The AI model failed to complete tool execution. This may be due to a compatibility issue with the selected model. Please try a different model or try again."
      )
    })

    it("formats error with single tool name", () => {
      const incompleteTools: IncompleteToolCall[] = [
        {
          toolName: "list_automations",
          toolCallId: "call-1",
          state: "input-available",
        },
      ]

      const result = formatIncompleteToolCallError(incompleteTools)
      expect(result).toBe(
        "The AI model failed to complete tool execution for: list_automations. This may be due to a compatibility issue with the selected model. Please try a different model or try again."
      )
    })

    it("formats error with multiple tool names", () => {
      const incompleteTools: IncompleteToolCall[] = [
        {
          toolName: "list_automations",
          toolCallId: "call-1",
          state: "input-available",
        },
        {
          toolName: "get_automation",
          toolCallId: "call-2",
          state: "input-streaming",
        },
      ]

      const result = formatIncompleteToolCallError(incompleteTools)
      expect(result).toBe(
        "The AI model failed to complete tool execution for: list_automations, get_automation. This may be due to a compatibility issue with the selected model. Please try a different model or try again."
      )
    })
  })
})
