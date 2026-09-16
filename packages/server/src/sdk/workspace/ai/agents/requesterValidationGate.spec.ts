import { ToolValidationResultStatus } from "@budibase/types"
import {
  createRequesterValidationContext,
  createRequesterValidationRuntime,
  getRequesterConfirmedToolCalls,
} from "./requesterValidationGate"

const createRuntime = (
  confirmedCalls: Parameters<typeof createRequesterValidationContext>[0] = []
) =>
  createRequesterValidationRuntime({
    toolName: "create_row",
    readableName: "Create row",
    sourceId: "table_1",
    validationContext: createRequesterValidationContext(confirmedCalls),
  })

describe("requester validation gate", () => {
  it("pauses an unconfirmed write and returns all proposed arguments", async () => {
    const args = { name: "Ada", active: true }

    await expect(
      createRuntime().intercept(args, { toolCallId: "call_1" })
    ).resolves.toEqual(
      expect.objectContaining({
        status: ToolValidationResultStatus.PENDING,
        toolName: "create_row",
        arguments: args,
      })
    )
  })

  it("reads naturally confirmed calls from the previous assistant turn", () => {
    const args = { name: "Ada", active: true }

    expect(
      getRequesterConfirmedToolCalls({
        latestQuestion: "Yes, please!",
        chat: {
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
              parts: [{ type: "text", text: "Yes, please!" }],
            },
          ],
        },
      })
    ).toEqual([{ toolName: "create_row", sourceId: "table_1", args }])
  })

  it("does not treat a changed request as confirmation", () => {
    expect(
      getRequesterConfirmedToolCalls({
        latestQuestion: "Yes, but use Grace instead",
        chat: {
          _id: "chat_1",
          agentId: "agent_1",
          messages: [],
        },
      })
    ).toEqual([])
  })

  it("allows the exact call after the requester confirms it", async () => {
    const args = { name: "Ada", active: true }
    const runtime = createRuntime([
      { toolName: "create_row", sourceId: "table_1", args },
    ])

    await expect(
      runtime.intercept(args, { toolCallId: "call_1" })
    ).resolves.toBeUndefined()
  })

  it("pauses again when the arguments change", async () => {
    const runtime = createRuntime([
      {
        toolName: "create_row",
        sourceId: "table_1",
        args: { name: "Ada" },
      },
    ])

    await expect(
      runtime.intercept({ name: "Grace" }, { toolCallId: "call_1" })
    ).resolves.toEqual(
      expect.objectContaining({ status: ToolValidationResultStatus.PENDING })
    )
  })

  it("consumes each confirmation only once", async () => {
    const args = { name: "Ada" }
    const runtime = createRuntime([
      { toolName: "create_row", sourceId: "table_1", args },
    ])

    await expect(
      runtime.intercept(args, { toolCallId: "call_1" })
    ).resolves.toBeUndefined()
    await expect(
      runtime.intercept(args, { toolCallId: "call_2" })
    ).resolves.toEqual(
      expect.objectContaining({ status: ToolValidationResultStatus.PENDING })
    )
  })
})
