import { AgentChannelProvider } from "@budibase/types"
import { getTransientChatUserOrigin, getUserOrigin } from "./metadata"

describe("getUserOrigin", () => {
  it("prefers the user's name over their email", () => {
    expect(
      getUserOrigin({
        _id: "user-1",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
      })
    ).toEqual({ type: "user", id: "user-1", label: "Jane Doe" })
  })

  it("uses a partial name when available", () => {
    expect(
      getUserOrigin({
        _id: "user-1",
        firstName: "Jane",
        email: "jane@example.com",
      })
    ).toEqual({ type: "user", id: "user-1", label: "Jane" })
  })

  it.each([undefined, "", "   "])(
    "falls back to email for an empty name (%s)",
    firstName => {
      expect(
        getUserOrigin({
          _id: "user-1",
          firstName,
          lastName: firstName,
          email: "jane@example.com",
        })
      ).toEqual({ type: "user", id: "user-1", label: "jane@example.com" })
    }
  )

  it("omits the label when neither name nor email is available", () => {
    expect(getUserOrigin({ _id: "user-1" })).toEqual({
      type: "user",
      id: "user-1",
    })
  })

  it("preserves the global user identity", () => {
    expect(
      getUserOrigin({
        _id: "workspace-user-1",
        globalId: "user-1",
        email: "jane@example.com",
      })
    ).toEqual({ type: "user", id: "user-1", label: "jane@example.com" })
  })
})

describe("getTransientChatUserOrigin", () => {
  describe.each([
    { provider: AgentChannelProvider.SLACK, label: "Slack" },
    { provider: AgentChannelProvider.MSTEAMS, label: "Microsoft Teams" },
  ])("$provider", ({ provider, label }) => {
    it.each([undefined, "", "   "])(
      "retains the provider when the display name is %p",
      displayName => {
        expect(getTransientChatUserOrigin({ provider, displayName })).toEqual({
          type: "user",
          label,
        })
      }
    )

    it.each(["John Doe", "  John Doe  "])(
      "includes the trimmed display name and provider for %p",
      displayName => {
        expect(getTransientChatUserOrigin({ provider, displayName })).toEqual({
          type: "user",
          label: `John Doe (${label})`,
        })
      }
    )
  })
})
