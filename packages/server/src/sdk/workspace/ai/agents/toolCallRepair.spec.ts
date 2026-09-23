import { InvalidToolInputError, tool } from "ai"
import { z } from "zod"
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
        tools: {
          create_expense: tool({
            inputSchema: z.object({
              data: z.object({
                "Expense Tags": z.array(z.string()),
                Cost: z.number(),
              }),
            }),
          }),
        },
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

  it("counts repeated malformed JSON write calls", async () => {
    const retryGuard = createToolCallRetryGuard(new Set(["create_expense"]))
    const input = '{"data":'
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
      inputSchema: jest.fn(),
      error: new InvalidToolInputError({
        toolInput: input,
        toolName: "create_expense",
        cause: new Error("invalid JSON"),
      }),
    }

    await retryGuard.repairToolCall(options)
    expect(retryGuard.shouldDisableTools()).toBe(false)
    await retryGuard.repairToolCall(options)
    expect(retryGuard.shouldDisableTools()).toBe(true)
    expect(options.inputSchema).not.toHaveBeenCalled()
  })

  it("counts normalized calls that remain schema-invalid", async () => {
    const retryGuard = createToolCallRetryGuard(new Set(["create_expense"]))
    const input = JSON.stringify({ data: { "`Expense Tags`": ["Food"] } })
    const tools = {
      create_expense: tool({
        inputSchema: z.object({
          data: z.object({
            "Expense Tags": z.array(z.string()),
            Cost: z.number(),
          }),
        }),
      }),
    }
    const options = {
      instructions: undefined,
      system: undefined,
      messages: [],
      tools,
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
              "Expense Tags": { type: "array" as const },
              Cost: { type: "number" as const },
            },
            required: ["Expense Tags", "Cost"],
          },
        },
      }),
      error: new InvalidToolInputError({
        toolInput: input,
        toolName: "create_expense",
        cause: new Error("Cost is required"),
      }),
    }

    await retryGuard.repairToolCall(options)
    expect(retryGuard.shouldDisableTools()).toBe(false)
    await retryGuard.repairToolCall(options)
    expect(retryGuard.shouldDisableTools()).toBe(true)
  })
})
