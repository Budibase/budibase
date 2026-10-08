import { getUserOrigin } from "./metadata"

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
