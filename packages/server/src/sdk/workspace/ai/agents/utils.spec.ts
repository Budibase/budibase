import type { UIMessage, ToolSet, TypedToolCall, TypedToolResult } from "ai"
import {
  findIncompleteToolCalls,
  formatIncompleteToolCallError,
  IncompleteToolCall,
  updatePendingToolCalls,
} from "./utils"

type MessagePart = NonNullable<UIMessage["parts"]>[number]

const toolPart = (part: Record<string, unknown>): MessagePart =>
  part as MessagePart


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
