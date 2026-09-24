import { ToolValidationResultStatus } from "@budibase/types"
import { z } from "zod"

const mockCacheGet = jest.fn()
const mockCacheStore = jest.fn()
const mockDoWithLock = jest.fn(
  async (_options: unknown, callback: () => Promise<unknown>) => ({
    result: await callback(),
  })
)

jest.mock("@budibase/backend-core", () => ({
  cache: {
    get: (...args: unknown[]) => mockCacheGet(...args),
    store: (...args: unknown[]) => mockCacheStore(...args),
  },
  locks: {
    doWithLock: (options: unknown, callback: () => Promise<unknown>) =>
      mockDoWithLock(options, callback),
  },
}))

import {
  buildConfirmationMessage,
  createRequesterValidationRuntime,
} from "./requesterValidationGate"

const validationContext = {
  agentId: "agent_1",
  operationId: "operation_1",
  conversationId: "conversation_1",
  requesterId: "user_1",
  requesterRole: "role_1",
}

describe("requester validation gate", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("does not replace an action that is already awaiting confirmation", async () => {
    mockCacheGet.mockResolvedValue({
      status: "awaiting_confirmation",
      toolName: "create_expense",
      validationMessage: "Please confirm the existing expense.",
    })
    const runtime = createRequesterValidationRuntime({
      toolName: "create_expense",
      inputSchema: z.object({ data: z.object({ Cost: z.number() }) }),
      context: validationContext,
    })

    await expect(
      runtime.intercept(
        { data: { Cost: 20 } },
        {
          toolCallId: "call_2",
          messages: [{ role: "user", content: "Add another expense for 20" }],
        }
      )
    ).resolves.toEqual({
      status: ToolValidationResultStatus.PENDING,
      message: "Please confirm the existing expense.",
    })
    expect(mockCacheStore).not.toHaveBeenCalled()
    expect(mockDoWithLock).toHaveBeenCalledWith(
      expect.objectContaining({
        resource: "conversation_1",
      }),
      expect.any(Function)
    )
  })

  it("renders the exact canonical arguments without internal identifiers", () => {
    expect(
      buildConfirmationMessage({
        toolName: "create_row",
        readableName: "add the new expense",
        arguments: {
          data: {
            Cost: 15,
            "Expense Tags": ["Food"],
            Notes: "Breakfast",
          },
        },
      })
    ).toBe(
      [
        "Please confirm that you want me to add the new expense:",
        "",
        "- Cost: 15",
        "- Expense Tags: Food",
        "- Notes: Breakfast",
        "",
        "Should I go ahead?",
      ].join("\n")
    )
  })

  it("asks only for a missing required field", async () => {
    mockCacheGet.mockResolvedValue(undefined)
    const runtime = createRequesterValidationRuntime({
      toolName: "create_expense",
      inputSchema: z.object({
        data: z.object({
          Cost: z.number(),
          Category: z.enum(["Food", "Travel"]),
          Notes: z.string().optional(),
        }),
      }),
      context: validationContext,
    })

    await expect(
      runtime.intercept(
        { data: { Cost: 15 } },
        {
          toolCallId: "call_1",
          messages: [{ role: "user", content: "Add an expense for 15" }],
        }
      )
    ).resolves.toEqual(
      expect.objectContaining({
        status: ToolValidationResultStatus.NEEDS_INPUT,
        message: "What Category should I use?\nChoose one of: Food, Travel.",
      })
    )
    expect(mockCacheStore).toHaveBeenCalledWith(
      "agent:requester-action:conversation_1",
      expect.objectContaining({
        status: "collecting_input",
        partialArguments: { data: { Cost: 15 } },
      })
    )
  })

  it("includes valid options for a missing required multi-select field", async () => {
    mockCacheGet.mockResolvedValue(undefined)
    const runtime = createRequesterValidationRuntime({
      toolName: "create_expense",
      inputSchema: z.object({
        data: z.object({
          Cost: z.number(),
          "Expense Tags": z.array(z.enum(["Food", "Travel", "Other"])),
        }),
      }),
      context: validationContext,
    })

    await expect(
      runtime.intercept(
        { data: { Cost: 50 } },
        {
          toolCallId: "call_1",
          messages: [{ role: "user", content: "Add an expense, 50 euros" }],
        }
      )
    ).resolves.toEqual(
      expect.objectContaining({
        status: ToolValidationResultStatus.NEEDS_INPUT,
        message:
          "What Expense Tags should I use?\nChoose one of: Food, Travel, Other.",
      })
    )
  })

  it("does not expose authoritative schema details for a redacted tool", async () => {
    mockCacheGet.mockResolvedValue(undefined)
    const runtime = createRequesterValidationRuntime({
      toolName: "create_employee",
      inputSchema: z.object({
        data: z.object({
          "Employee Level": z.enum(["Manager", "Apprentice"]),
        }),
      }),
      sanitizeValidationErrors: true,
      context: validationContext,
    })

    const result = await runtime.intercept(
      { data: {} },
      {
        toolCallId: "call_1",
        messages: [{ role: "user", content: "Create an employee" }],
      }
    )

    expect(result).toEqual(
      expect.objectContaining({
        status: ToolValidationResultStatus.NEEDS_INPUT,
        message:
          "I couldn't validate those details. Please check the information and try again.",
      })
    )
    expect(JSON.stringify(result)).not.toContain("Employee Level")
    expect(JSON.stringify(result)).not.toContain("Manager")
    expect(mockCacheStore).toHaveBeenCalledWith(
      "agent:requester-action:conversation_1",
      expect.objectContaining({
        status: "collecting_input",
        partialArguments: { data: {} },
      })
    )
  })

  it("removes a valid enum value that the requester did not supply", async () => {
    mockCacheGet.mockResolvedValue(undefined)
    const runtime = createRequesterValidationRuntime({
      toolName: "create_expense",
      inputSchema: z.object({
        data: z.object({
          Cost: z.number(),
          "Expense Tags": z.enum(["Food", "Other"]),
        }),
      }),
      context: validationContext,
    })

    await expect(
      runtime.intercept(
        { data: { Cost: 10, "Expense Tags": "Other" } },
        {
          toolCallId: "call_1",
          messages: [{ role: "user", content: "Add an expense, 10 euros" }],
        }
      )
    ).resolves.toEqual(
      expect.objectContaining({
        status: ToolValidationResultStatus.NEEDS_INPUT,
        message: "What Expense Tags should I use?\nChoose one of: Food, Other.",
      })
    )
    expect(mockCacheStore).toHaveBeenCalledWith(
      "agent:requester-action:conversation_1",
      expect.objectContaining({
        partialArguments: { data: { Cost: 10 } },
      })
    )
  })

  it("merges a clarification and freezes the validated payload", async () => {
    mockCacheGet.mockResolvedValue({
      status: "collecting_input",
      toolName: "create_expense",
      partialArguments: { data: { Cost: 15 } },
    })
    const runtime = createRequesterValidationRuntime({
      toolName: "create_expense",
      readableName: "add the expense",
      inputSchema: z.object({
        data: z.object({
          Cost: z.number(),
          Category: z.enum(["Food", "Travel"]),
        }),
      }),
      context: validationContext,
    })

    await expect(
      runtime.intercept(
        { data: { Category: "Food" } },
        {
          toolCallId: "call_2",
          messages: [{ role: "user", content: "Food" }],
        }
      )
    ).resolves.toEqual(
      expect.objectContaining({
        status: ToolValidationResultStatus.PENDING,
        arguments: { data: { Cost: 15, Category: "Food" } },
      })
    )
    expect(mockCacheStore).toHaveBeenCalledWith(
      "agent:requester-action:conversation_1",
      expect.objectContaining({
        status: "awaiting_confirmation",
        confirmedArguments: { data: { Cost: 15, Category: "Food" } },
      })
    )
  })

  it("normalizes a requester-supplied enum value to its canonical casing", async () => {
    mockCacheGet.mockResolvedValue({
      status: "collecting_input",
      toolName: "create_expense",
      partialArguments: { data: { Cost: 50 } },
    })
    const runtime = createRequesterValidationRuntime({
      toolName: "create_expense",
      inputSchema: z.object({
        data: z.object({
          Cost: z.number(),
          "Expense Tags": z.array(
            z.enum(["Equipment", "Food", "Other", "Service"])
          ),
        }),
      }),
      context: validationContext,
    })

    await expect(
      runtime.intercept(
        { data: { "Expense Tags": "other" } },
        {
          toolCallId: "call_2",
          messages: [{ role: "user", content: "other" }],
        }
      )
    ).resolves.toEqual(
      expect.objectContaining({
        status: ToolValidationResultStatus.PENDING,
        arguments: { data: { Cost: 50, "Expense Tags": ["Other"] } },
      })
    )
  })
})
