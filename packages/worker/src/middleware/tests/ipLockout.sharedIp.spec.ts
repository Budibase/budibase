import { cache } from "@budibase/backend-core"
import env from "../../environment"
import ipLockout from "../ipLockout"
import { recordFailedAttemptForIp } from "../../utilities/loginAttempts"

/**
 * Regression test for budibase/budibase#19525. Drives the real client IP
 * resolution and a real counting cache, rather than stubbing them out, because
 * the original bug lived entirely in the bit that was stubbed.
 */

jest.mock("@budibase/backend-core", () => ({
  ...jest.requireActual("@budibase/backend-core"),
  cache: {
    get: jest.fn(),
    increment: jest.fn(),
  },
}))

const buckets = new Map<string, number>()

// nginx forwards X-Real-IP from $remote_addr after real_ip resolution, and
// appends its own peer to X-Forwarded-For
const ctxFor = (clientIp: string, email: string) => ({
  request: {
    headers: {
      "x-real-ip": clientIp,
      "x-forwarded-for": `${clientIp}, 172.16.0.9, 10.0.0.1`,
    },
    body: { username: email, password: "correct-horse" },
  },
  req: { socket: { remoteAddress: "10.0.0.1" } },
  set: jest.fn(),
  throw: jest.fn((status: number, message: string) => {
    const err: any = new Error(message)
    err.status = status
    throw err
  }),
})

describe("#19525 login IP lockout", () => {
  beforeEach(() => {
    buckets.clear()
    jest.mocked(cache.get).mockImplementation(async (key: string) => {
      return buckets.get(key) ?? null
    })
    jest.mocked(cache.increment).mockImplementation(async (key: string) => {
      const count = (buckets.get(key) ?? 0) + 1
      buckets.set(key, count)
      return count
    })
  })

  it("keys on the resolved client, not on the shared proxy hop", async () => {
    await recordFailedAttemptForIp("203.0.113.10")
    await recordFailedAttemptForIp("198.51.100.77")

    expect([...buckets.keys()].sort()).toEqual([
      "auth:login:ip:198.51.100.77",
      "auth:login:ip:203.0.113.10",
    ])
  })

  it("does not consume the allowance for successful logins", async () => {
    for (let i = 0; i < env.LOGIN_IP_LOCKOUT_LIMIT + 5; i++) {
      const ctx = ctxFor("203.0.113.50", `user${i}@nursery.example.com`)
      const next = jest.fn()
      await ipLockout(ctx as any, next)
      expect(next).toHaveBeenCalled()
    }

    expect(buckets.size).toBe(0)
  })

  it("does not let one client's failures block another behind the same proxy", async () => {
    for (let i = 0; i < env.LOGIN_IP_LOCKOUT_LIMIT; i++) {
      await recordFailedAttemptForIp("203.0.113.50")
    }

    const blocked = ctxFor("203.0.113.50", "attacker@example.com")
    await expect(ipLockout(blocked as any, jest.fn())).rejects.toThrow(
      "Too many login attempts. Try again later."
    )

    const unaffected = ctxFor("198.51.100.200", "victim@nursery.example.com")
    const next = jest.fn()
    await ipLockout(unaffected as any, next)
    expect(next).toHaveBeenCalled()
  })

  it("cannot be evaded by forging the leftmost X-Forwarded-For hop", async () => {
    for (let i = 0; i < env.LOGIN_IP_LOCKOUT_LIMIT; i++) {
      await recordFailedAttemptForIp("203.0.113.50")
    }

    // X-Real-IP is stamped by our own edge, so a forged XFF is ignored
    const forged = ctxFor("203.0.113.50", "attacker@example.com")
    forged.request.headers["x-forwarded-for"] =
      "9.9.9.9, 203.0.113.50, 172.16.0.9, 10.0.0.1"

    await expect(ipLockout(forged as any, jest.fn())).rejects.toThrow(
      "Too many login attempts. Try again later."
    )
  })
})
