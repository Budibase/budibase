import * as sessions from "../sessions"

describe("sessions", () => {
  describe("getSessionsForUser", () => {
    it("returns empty when user is undefined", async () => {
      // @ts-ignore - allow the undefined to be passed
      const results = await sessions.getSessionsForUser(undefined)

      expect(results).toStrictEqual([])
    })
  })
})
