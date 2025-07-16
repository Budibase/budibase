import * as sessions from "../sessions"
import { generator, DBTestConfiguration } from "../../../tests"

async function createSession(userId: string, tenantId: string, email: string) {
  return await sessions.createASession(userId, {
    sessionId: generator.guid(),
    tenantId,
    csrfToken: generator.hash(),
    email,
  })
}

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

        const one = await createSession(userId, tenantId, email)
        const two = await createSession(userId, tenantId, email)
        const three = await createSession(userId, tenantId, email)

        const userSessions = await sessions.getSessionsForUser(userId)
        expect(userSessions).toHaveLength(3)

        const sessionIds = userSessions.map(s => s.sessionId)
        expect(sessionIds).toContain(one.session.sessionId)
        expect(sessionIds).toContain(two.session.sessionId)
        expect(sessionIds).toContain(three.session.sessionId)
      })
    })

    it("should invalidate oldest session when 4th session is created", async () => {
      await config.doInTenant(async () => {
        const userId = generator.guid()
        const email = generator.email({ domain: "example.com" })
        const tenantId = config.getTenantId()

        const one = await createSession(userId, tenantId, email)

        const two = await createSession(userId, tenantId, email)

        const three = await createSession(userId, tenantId, email)

        let userSessions = await sessions.getSessionsForUser(userId)
        expect(userSessions).toHaveLength(3)

        const four = await createSession(userId, tenantId, email)

        userSessions = await sessions.getSessionsForUser(userId)
        expect(userSessions).toHaveLength(3)

        const sessionIds = userSessions.map(s => s.sessionId)
        expect(sessionIds).not.toContain(one.session.sessionId)
        expect(sessionIds).toContain(two.session.sessionId)
        expect(sessionIds).toContain(three.session.sessionId)
        expect(sessionIds).toContain(four.session.sessionId)

        expect(four.invalidatedSessionCount).toBe(1)
      })
    })
  })
})
