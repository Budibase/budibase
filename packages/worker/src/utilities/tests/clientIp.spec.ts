import { withEnv } from "../../environment"
import { getClientIp, isTrustedProxy, normaliseIp } from "../clientIp"

const ctxFor = ({
  headers = {},
  socket,
}: {
  headers?: Record<string, string | string[]>
  socket?: string
}) =>
  ({
    request: { headers },
    req: { socket: { remoteAddress: socket } },
  }) as any

describe("normaliseIp", () => {
  it.each([
    ["1.2.3.4", "1.2.3.4"],
    [" 1.2.3.4 ", "1.2.3.4"],
    ["1.2.3.4:5678", "1.2.3.4"],
    ["::ffff:1.2.3.4", "1.2.3.4"],
    ["::FFFF:1.2.3.4", "1.2.3.4"],
    ["[2001:db8::1]:443", "2001:db8::1"],
    ["2001:db8::1", "2001:db8::1"],
    ["fe80::1%eth0", "fe80::1"],
    ["", undefined],
  ])("normalises %s", (input, expected) => {
    expect(normaliseIp(input)).toBe(expected)
  })
})

describe("isTrustedProxy", () => {
  it.each([
    ["10.1.2.3", true],
    ["172.16.0.1", true],
    ["172.31.255.255", true],
    ["172.32.0.1", false],
    ["192.168.1.1", true],
    ["127.0.0.1", true],
    ["::1", true],
    ["fd00::1", true],
    ["203.0.113.1", false],
    ["2001:db8::1", false],
    ["not-an-ip", false],
  ])("classifies %s", (ip, expected) => {
    expect(isTrustedProxy(ip)).toBe(expected)
  })

  it("uses TRUSTED_PROXY_CIDRS when configured", async () => {
    await withEnv({ TRUSTED_PROXY_CIDRS: "203.0.113.0/24" }, async () => {
      expect(isTrustedProxy("203.0.113.7")).toBe(true)
      // the private defaults no longer apply once an explicit list is given
      expect(isTrustedProxy("10.1.2.3")).toBe(false)
    })
  })

  it("ignores unparseable entries rather than trusting everything", async () => {
    await withEnv(
      { TRUSTED_PROXY_CIDRS: "nonsense,203.0.113.0/24,10.0.0.0/99" },
      async () => {
        expect(isTrustedProxy("203.0.113.7")).toBe(true)
        expect(isTrustedProxy("10.0.0.1")).toBe(false)
      }
    )
  })

  it.each([
    "10.0.0.0/",
    "10.0.0.0//8",
    "10.0.0.0/-0",
    "10.0.0.0/0x8",
    "10.0.0.0/1e1",
    "10.0.0.0/8/16",
    "10.0.0.0/ 8",
    "10.0.0.0/8.0",
    "::/",
  ])(
    "does not let malformed CIDR %s widen the trusted range to match everything",
    async malformed => {
      await withEnv({ TRUSTED_PROXY_CIDRS: malformed }, async () => {
        expect(isTrustedProxy("203.0.113.7")).toBe(false)
        expect(isTrustedProxy("8.8.8.8")).toBe(false)
        expect(isTrustedProxy("2001:db8::1")).toBe(false)
      })
    }
  )
})

describe("getClientIp", () => {
  it("prefers X-Real-IP, which our edge always overwrites", () => {
    const ctx = ctxFor({
      headers: {
        "x-real-ip": "203.0.113.10",
        "x-forwarded-for": "9.9.9.9, 172.16.0.9, 10.0.0.1",
      },
      socket: "10.0.0.1",
    })
    expect(getClientIp(ctx)).toBe("203.0.113.10")
  })

  it("does not take the rightmost X-Forwarded-For hop", () => {
    const ctx = ctxFor({
      headers: { "x-forwarded-for": "203.0.113.10, 172.16.0.9, 10.0.0.1" },
      socket: "10.0.0.1",
    })
    // the rightmost hop is our own load balancer, which is what collapsed every
    // user onto one rate limit bucket
    expect(getClientIp(ctx)).toBe("203.0.113.10")
  })

  it("does not take the leftmost X-Forwarded-For hop when the client forged one", () => {
    const ctx = ctxFor({
      headers: {
        "x-forwarded-for": "9.9.9.9, 203.0.113.10, 172.16.0.9, 10.0.0.1",
      },
      socket: "10.0.0.1",
    })
    expect(getClientIp(ctx)).toBe("203.0.113.10")
  })

  it("returns distinct addresses for distinct clients behind one proxy", () => {
    const first = getClientIp(
      ctxFor({
        headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" },
        socket: "10.0.0.1",
      })
    )
    const second = getClientIp(
      ctxFor({
        headers: { "x-forwarded-for": "198.51.100.77, 10.0.0.1" },
        socket: "10.0.0.1",
      })
    )
    expect(first).toBe("203.0.113.10")
    expect(second).toBe("198.51.100.77")
  })

  it("falls back to the socket address with no proxy headers", () => {
    expect(getClientIp(ctxFor({ socket: "::ffff:127.0.0.1" }))).toBe(
      "127.0.0.1"
    )
  })

  it("falls back to the outermost hop for cluster internal traffic", () => {
    const ctx = ctxFor({
      headers: { "x-forwarded-for": "10.4.5.6, 10.0.0.1" },
      socket: "10.0.0.1",
    })
    expect(getClientIp(ctx)).toBe("10.4.5.6")
  })

  it("skips junk hops", () => {
    const ctx = ctxFor({
      headers: { "x-forwarded-for": "unknown, 203.0.113.10, 10.0.0.1" },
      socket: "10.0.0.1",
    })
    expect(getClientIp(ctx)).toBe("203.0.113.10")
  })

  it("ignores an unparseable X-Real-IP", () => {
    const ctx = ctxFor({
      headers: {
        "x-real-ip": "not-an-ip",
        "x-forwarded-for": "203.0.113.10, 10.0.0.1",
      },
      socket: "10.0.0.1",
    })
    expect(getClientIp(ctx)).toBe("203.0.113.10")
  })

  it("handles IPv6 clients", () => {
    const ctx = ctxFor({
      headers: { "x-forwarded-for": "2001:db8::1, fd00::1" },
      socket: "fd00::1",
    })
    expect(getClientIp(ctx)).toBe("2001:db8::1")
  })

  it("returns undefined when there is nothing to go on", () => {
    expect(getClientIp(ctxFor({}))).toBeUndefined()
  })

  it("ignores X-Real-IP from a peer that is not one of our proxies", () => {
    // reaching the worker directly, so the headers are entirely attacker chosen
    const ctx = ctxFor({
      headers: { "x-real-ip": "203.0.113.10" },
      socket: "198.51.100.4",
    })
    expect(getClientIp(ctx)).toBe("198.51.100.4")
  })

  it("ignores X-Forwarded-For from a peer that is not one of our proxies", () => {
    const ctx = ctxFor({
      headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" },
      socket: "198.51.100.4",
    })
    expect(getClientIp(ctx)).toBe("198.51.100.4")
  })

  it("cannot be made to pick a victim's address by a direct caller", () => {
    const victim = "203.0.113.55"
    const attacker = "198.51.100.4"
    const ctx = ctxFor({
      headers: {
        "x-real-ip": victim,
        "x-forwarded-for": `${victim}, ${victim}`,
      },
      socket: attacker,
    })
    expect(getClientIp(ctx)).toBe(attacker)
  })

  it("does not let a peer inside the trusted range forge its own address", () => {
    const ctx = ctxFor({
      headers: {
        "x-real-ip": "10.77.0.4",
        "x-forwarded-for": "203.0.113.7, 10.77.0.4",
      },
      socket: "10.77.0.3",
    })
    // walking the chain would skip 10.77.0.4 as infrastructure and land on the
    // forged hop, which is why X-Real-IP wins even when it is private
    expect(getClientIp(ctx)).toBe("10.77.0.4")
  })

  it("prefers a private X-Real-IP over the chain", () => {
    // a LAN deployment, where the client's own address is private
    const ctx = ctxFor({
      headers: {
        "x-real-ip": "192.168.1.50",
        "x-forwarded-for": "203.0.113.7, 192.168.1.50",
      },
      socket: "10.0.0.1",
    })
    expect(getClientIp(ctx)).toBe("192.168.1.50")
  })

  it("honours forwarded headers once the peer is a configured proxy", async () => {
    await withEnv({ TRUSTED_PROXY_CIDRS: "198.51.100.0/24" }, async () => {
      const ctx = ctxFor({
        headers: { "x-real-ip": "203.0.113.10" },
        socket: "198.51.100.4",
      })
      expect(getClientIp(ctx)).toBe("203.0.113.10")
    })
  })
})
