import { refreshBlacklist, isBlacklisted } from ".."
import { setEnv } from "../../environment"

describe("blacklist", () => {
  describe("default ranges", () => {
    let restoreEnv: (() => void) | undefined

    beforeAll(async () => {
      restoreEnv = setEnv({ BLACKLIST_IPS: undefined })
      await refreshBlacklist()
    })

    afterAll(async () => {
      restoreEnv?.()
      await refreshBlacklist()
    })

    it("should blacklist localhost", async () => {
      expect(await isBlacklisted("127.0.0.1")).toBe(true)
    })

    it("should blacklist RFC1918 addresses", async () => {
      expect(await isBlacklisted("192.168.1.1")).toBe(true)
      expect(await isBlacklisted("10.0.0.1")).toBe(true)
      expect(await isBlacklisted("172.16.0.1")).toBe(true)
    })

    it("should blacklist link-local addresses", async () => {
      expect(await isBlacklisted("169.254.169.254")).toBe(true)
    })

    it("should allow public IPs by default", async () => {
      expect(await isBlacklisted("8.8.8.8")).toBe(false)
    })

    it("should block addresses that fail lookup or parsing", async () => {
      expect(await isBlacklisted("http://[")).toBe(true)
    })

    it("should block addresses when DNS lookup fails", async () => {
      expect(await isBlacklisted("https://budibase-ssrf.invalid")).toBe(true)
    })
  })

  describe("configured entries", () => {
    let restoreEnv: (() => void) | undefined

    beforeAll(async () => {
      restoreEnv = setEnv({
        BLACKLIST_IPS: "www.google.com,192.168.1.1,1.1.1.1",
      })
      await refreshBlacklist()
    })

    afterAll(async () => {
      restoreEnv?.()
      await refreshBlacklist()
    })

    it("should blacklist 192.168.1.1", async () => {
      expect(await isBlacklisted("192.168.1.1")).toBe(true)
    })

    it("should allow public IPs that are not configured", async () => {
      expect(await isBlacklisted("8.8.8.8")).toBe(false)
    })

    it("should blacklist www.google.com", async () => {
      expect(await isBlacklisted("www.google.com")).toBe(true)
    })

    it("should handle a complex domain", async () => {
      expect(
        await isBlacklisted("https://www.google.com/derp/?something=1")
      ).toBe(true)
    })

    it("should allow www.microsoft.com", async () => {
      expect(await isBlacklisted("www.microsoft.com")).toBe(false)
    })

    it("should blacklist an IP that needed trimming", async () => {
      expect(await isBlacklisted("1.1.1.1")).toBe(true)
    })

    it("should blacklist 1.1.1.1/something", async () => {
      expect(await isBlacklisted("1.1.1.1/something")).toBe(true)
    })
  })

  describe("self-hosted blacklist override", () => {
    let restoreEnv: (() => void) | undefined

    afterEach(async () => {
      restoreEnv?.()
      restoreEnv = undefined
      await refreshBlacklist()
    })

    it("should allow private IPs when self-hosted override is empty", async () => {
      restoreEnv = setEnv({
        SELF_HOSTED: true,
        BLACKLIST_IPS: "",
      })
      await refreshBlacklist()

      expect(await isBlacklisted("192.168.1.1")).toBe(false)
      expect(await isBlacklisted("10.0.0.1")).toBe(false)
      expect(await isBlacklisted("172.16.0.1")).toBe(false)
    })

    it("should fail open on DNS lookup errors when self-hosted override is empty", async () => {
      restoreEnv = setEnv({
        SELF_HOSTED: true,
        BLACKLIST_IPS: "",
      })
      await refreshBlacklist()

      expect(await isBlacklisted("https://budibase-ssrf.invalid")).toBe(false)
    })

    it("should use only configured entries when self-hosted override is set", async () => {
      restoreEnv = setEnv({
        SELF_HOSTED: true,
        BLACKLIST_IPS: "1.1.1.1",
      })
      await refreshBlacklist()

      expect(await isBlacklisted("1.1.1.1")).toBe(true)
      expect(await isBlacklisted("192.168.1.1")).toBe(false)
    })
  })

  describe("malformed CIDR entries", () => {
    let restoreEnv: (() => void) | undefined

    afterEach(async () => {
      restoreEnv?.()
      restoreEnv = undefined
      await refreshBlacklist()
    })

    it("should ignore out of range ipv4 prefixes", async () => {
      restoreEnv = setEnv({ BLACKLIST_IPS: "1.1.1.1/33" })

      await refreshBlacklist()

      expect(await isBlacklisted("1.1.1.1")).toBe(false)
      expect(await isBlacklisted("1.1.1.2")).toBe(false)
    })

    it("should ignore partially numeric prefixes", async () => {
      restoreEnv = setEnv({ BLACKLIST_IPS: "2.2.2.2/1foo" })

      await refreshBlacklist()

      expect(await isBlacklisted("2.2.2.2")).toBe(false)
      expect(await isBlacklisted("64.0.0.1")).toBe(false)
    })

    it("should ignore empty prefixes", async () => {
      restoreEnv = setEnv({ BLACKLIST_IPS: "3.3.3.3/" })

      await refreshBlacklist()

      expect(await isBlacklisted("3.3.3.3")).toBe(false)
    })

    it("should ignore entries with multiple slashes", async () => {
      restoreEnv = setEnv({ BLACKLIST_IPS: "4.4.4.4/24/extra" })

      await refreshBlacklist()

      expect(await isBlacklisted("4.4.4.4")).toBe(false)
      expect(await isBlacklisted("4.4.4.5")).toBe(false)
    })
  })

  describe("valid CIDR entries", () => {
    let restoreEnv: (() => void) | undefined

    afterEach(async () => {
      restoreEnv?.()
      restoreEnv = undefined
      await refreshBlacklist()
    })

    it("should blacklist the full configured ipv4 subnet", async () => {
      restoreEnv = setEnv({ BLACKLIST_IPS: "5.5.5.0/24" })

      await refreshBlacklist()

      expect(await isBlacklisted("5.5.5.1")).toBe(true)
      expect(await isBlacklisted("5.5.5.200")).toBe(true)
      expect(await isBlacklisted("5.5.6.1")).toBe(false)
    })
  })
})
