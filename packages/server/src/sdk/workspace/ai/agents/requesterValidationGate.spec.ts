import { ToolValidationResultStatus } from "@budibase/types"
import { z } from "zod"

const mockCacheGet = jest.fn()
const mockCacheStore = jest.fn()

jest.mock("@budibase/backend-core", () => ({
  cache: {
    get: (...args: unknown[]) => mockCacheGet(...args),
    store: (...args: unknown[]) => mockCacheStore(...args),
  },
  locks: {
    doWithLock: jest.fn(),
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
        message:
          "What Category should I use?\nChoose one of: Food, Travel.",
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
        message:
          "What Expense Tags should I use?\nChoose one of: Food, Other.",
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
})
