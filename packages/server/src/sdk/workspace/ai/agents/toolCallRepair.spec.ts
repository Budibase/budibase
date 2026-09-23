import { InvalidToolInputError } from "ai"
import { repairToolCall } from "./toolCallRepair"

describe("tool call repair", () => {
  it("repairs markdown-wrapped schema keys", async () => {
    const input = JSON.stringify({
      data: { "`Expense Tags`": ["Other"], Cost: 10 },
    })

    await expect(
      repairToolCall({
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
  })
})
