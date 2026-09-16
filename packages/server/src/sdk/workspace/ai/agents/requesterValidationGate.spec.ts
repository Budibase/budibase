import { ToolValidationResultStatus } from "@budibase/types"
import { tool } from "ai"
import { z } from "zod"
import {
  createRequesterValidationResolutionTool,
  createRequesterValidationRuntime,
  getPendingRequesterToolCalls,
} from "./requesterValidationGate"

const createRuntime = () =>
  createRequesterValidationRuntime({
    toolName: "create_row",
    readableName: "Create row",
    sourceId: "table_1",
  })

describe("requester validation gate", () => {
  it("pauses a write and returns all frozen arguments", async () => {
    const args = { name: "Ada", active: true }

    await expect(
      createRuntime().intercept(args, { toolCallId: "call_1" })
    ).resolves.toEqual(
      expect.objectContaining({
        status: ToolValidationResultStatus.PENDING,
        toolName: "create_row",
        sourceId: "table_1",
        arguments: args,
        validationToolCallId: "call_1",
      })
    )
  })

  it("reads frozen calls from the previous assistant turn", () => {
    const args = { name: "Ada", active: true }

    expect(
      getPendingRequesterToolCalls({
        _id: "chat_1",
        agentId: "agent_1",
        messages: [
          {
            id: "assistant_1",
            role: "assistant",
            parts: [
              {
                type: "tool-create_row",
                toolCallId: "call_1",
                state: "output-available",
                input: args,
                output: {
                  status: ToolValidationResultStatus.PENDING,
                  sourceId: "table_1",
                },
              },
            ],
          },
          {
            id: "user_1",
            role: "user",
            parts: [{ type: "text", text: "Please proceed with that" }],
          },
        ],
      })
    ).toEqual([
      {
        toolCallId: "call_1",
        toolName: "create_row",
        sourceId: "table_1",
        args,
      },
    ])
  })

  it("does not offer calls that are not from the preceding assistant turn", () => {
    expect(
      getPendingRequesterToolCalls({
        _id: "chat_1",
        agentId: "agent_1",
        messages: [
          {
            id: "assistant_1",
            role: "assistant",
            parts: [{ type: "text", text: "Anything else?" }],
          },
          {
            id: "user_1",
            role: "user",
            parts: [{ type: "text", text: "Yes" }],
          },
        ],
      })
    ).toEqual([])
  })

  it("executes the frozen call directly and only once", async () => {
    const execute = jest.fn().mockResolvedValue({ success: true })
    const resolver = createRequesterValidationResolutionTool({
      pendingCalls: [
        {
          toolCallId: "call_1",
          toolName: "create_row",
          sourceId: "table_1",
          args: { name: "Ada" },
        },
      ],
      executableTools: {
        create_row: tool({
          description: "Create row",
          inputSchema: z.object({ name: z.string() }),
          execute,
        }),
      },
    })

    await expect(
      resolver.execute?.(
        { actionId: "call_1" },
        { toolCallId: "confirmation_1", messages: [], context: {} }
      )
    ).resolves.toEqual({ success: true })
    expect(execute).toHaveBeenCalledWith(
      { name: "Ada" },
      expect.objectContaining({ toolCallId: "call_1" })
    )
    await expect(
      resolver.execute?.(
        { actionId: "call_1" },
        { toolCallId: "confirmation_2", messages: [], context: {} }
      )
    ).resolves.toEqual({
      error: "That proposed action is no longer available",
    })
    expect(execute).toHaveBeenCalledTimes(1)
  })
})
