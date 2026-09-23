import { InvalidToolInputError } from "ai"
import { createToolCallRetryGuard } from "./toolCallRepair"

describe("tool call repair", () => {
  it("repairs markdown-wrapped schema keys", async () => {
    const retryGuard = createToolCallRetryGuard(new Set(["create_expense"]))
    const input = JSON.stringify({
      data: { "`Expense Tags`": ["Other"], Cost: 10 },
    })

    await expect(
      retryGuard.repairToolCall({
        instructions: undefined,
        system: undefined,
        messages: [],
        tools: {},
        toolCall: {
          type: "tool-call",
          toolCallId: "call_1",
          toolName: "create_expense",
          input,
        },
        inputSchema: async () => ({
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                "Expense Tags": {
                  type: "array",
                  items: { type: "string" },
                },
                Cost: { type: "number" },
              },
              required: ["Expense Tags", "Cost"],
              additionalProperties: false,
            },
          },
          required: ["data"],
          additionalProperties: false,
        }),
        error: new InvalidToolInputError({
          toolInput: input,
          toolName: "create_expense",
          cause: new Error("invalid input"),
        }),
      })
    ).resolves.toEqual({
      type: "tool-call",
      toolCallId: "call_1",
      toolName: "create_expense",
      input: JSON.stringify({
        data: { "Expense Tags": ["Other"], Cost: 10 },
      }),
    })
    expect(retryGuard.shouldDisableTools()).toBe(false)
  })

  it("disables tools after the same invalid call fails twice", async () => {
    const retryGuard = createToolCallRetryGuard(new Set(["create_expense"]))
    const input = JSON.stringify({ data: { Cost: 10, Notes: "Breakfast" } })
    const error = new InvalidToolInputError({
      toolInput: input,
      toolName: "create_expense",
      cause: new Error("Expense Tags is required"),
    })
    const options = {
      instructions: undefined,
      system: undefined,
      messages: [],
      tools: {},
      toolCall: {
        type: "tool-call" as const,
        toolCallId: "call_1",
        toolName: "create_expense",
        input,
      },
      inputSchema: async () => ({
        type: "object" as const,
        properties: {
          data: {
            type: "object" as const,
            properties: {
              Cost: { type: "number" as const },
              Notes: { type: "string" as const },
              "Expense Tags": { type: "array" as const },
            },
            required: ["Cost", "Expense Tags"],
          },
        },
      }),
      error,
    }

    await retryGuard.repairToolCall({
      ...options,
      toolCall: {
        ...options.toolCall,
        input: JSON.stringify({ data: { Notes: "Breakfast", Cost: 10 } }),
      },
    })
    expect(retryGuard.shouldDisableTools()).toBe(false)

    await retryGuard.repairToolCall(options)
    expect(retryGuard.shouldDisableTools()).toBe(true)
  })

  it("does not repair or count read tool failures", async () => {
    const retryGuard = createToolCallRetryGuard(new Set())
    const input = JSON.stringify({ "`query`": "expenses" })

    await expect(
      retryGuard.repairToolCall({
        instructions: undefined,
        system: undefined,
        messages: [],
        tools: {},
        toolCall: {
          type: "tool-call",
          toolCallId: "call_1",
          toolName: "search_expenses",
          input,
        },
        inputSchema: async () => ({
          type: "object",
          properties: { query: { type: "string" } },
        }),
        error: new InvalidToolInputError({
          toolInput: input,
          toolName: "search_expenses",
          cause: new Error("invalid input"),
        }),
      })
    ).resolves.toBeNull()
    expect(retryGuard.shouldDisableTools()).toBe(false)
  })
})
