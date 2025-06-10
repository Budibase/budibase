import * as sessions from "../sessions"
import { generator, DBTestConfiguration } from "../../../tests"

describe("sessions", () => {
  const config = new DBTestConfiguration()

  describe("getSessionsForUser", () => {
    it("returns empty when user is undefined", async () => {
      // @ts-ignore - allow the undefined to be passed
      const results = await sessions.getSessionsForUser(undefined)

      expect(results).toStrictEqual([])
    })
  })

  describe("concurrent sessions", () => {
    it("should allow up to 3 concurrent sessions per user", async () => {
      await config.doInTenant(async () => {
        const userId = generator.guid()
        const email = generator.email({ domain: "example.com" })
        const tenantId = config.getTenantId()

        // Create first session
        const session1 = await sessions.createASession(userId, {
          sessionId: generator.guid(),
          tenantId: tenantId,
          csrfToken: generator.hash(),
          email: email,
        })

        let userSessions = await sessions.getSessionsForUser(userId)
        expect(userSessions).toHaveLength(1)

        // Create second session
        const session2 = await sessions.createASession(userId, {
          sessionId: generator.guid(),
          tenantId: tenantId,
          csrfToken: generator.hash(),
          email: email,
        })

        userSessions = await sessions.getSessionsForUser(userId)
        expect(userSessions).toHaveLength(2)

        // Create third session
        const session3 = await sessions.createASession(userId, {
          sessionId: generator.guid(),
          tenantId: tenantId,
          csrfToken: generator.hash(),
          email: email,
        })

        userSessions = await sessions.getSessionsForUser(userId)
        expect(userSessions).toHaveLength(3)

        // Verify all 3 sessions are active
        const sessionIds = userSessions.map(s => s.sessionId)
        expect(sessionIds).toContain(session1.sessionId)
        expect(sessionIds).toContain(session2.sessionId)
        expect(sessionIds).toContain(session3.sessionId)
      })
    })

    it("should invalidate oldest session when 4th session is created", async () => {
      await config.doInTenant(async () => {
        const userId = generator.guid()
        const email = generator.email({ domain: "example.com" })
        const tenantId = config.getTenantId()

        // Create 3 sessions
        const session1 = await sessions.createASession(userId, {
          sessionId: generator.guid(),
          tenantId: tenantId,
          csrfToken: generator.hash(),
          email: email,
        })

        const session2 = await sessions.createASession(userId, {
          sessionId: generator.guid(),
          tenantId: tenantId,
          csrfToken: generator.hash(),
          email: email,
        })

        const session3 = await sessions.createASession(userId, {
          sessionId: generator.guid(),
          tenantId: tenantId,
          csrfToken: generator.hash(),
          email: email,
        })

        let userSessions = await sessions.getSessionsForUser(userId)
        expect(userSessions).toHaveLength(3)

        // Create 4th session - should invalidate the oldest (session1)
        const session4 = await sessions.createASession(userId, {
          sessionId: generator.guid(),
          tenantId: tenantId,
          csrfToken: generator.hash(),
          email: email,
        })

        userSessions = await sessions.getSessionsForUser(userId)
        expect(userSessions).toHaveLength(3)

        // Verify session1 is gone, but sessions 2, 3, and 4 remain
        const sessionIds = userSessions.map(s => s.sessionId)
        expect(sessionIds).not.toContain(session1.sessionId)
        expect(sessionIds).toContain(session2.sessionId)
        expect(sessionIds).toContain(session3.sessionId)
        expect(sessionIds).toContain(session4.sessionId)
      })
    })
  })
})
