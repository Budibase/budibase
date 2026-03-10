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
  })

  describe("configured entries", () => {
    let restoreEnv: (() => void) | undefined

    beforeAll(async () => {
      restoreEnv = setEnv({
        BLACKLIST_IPS: "www.google.com,192.168.1.1, 1.1.1.1,2.2.2.2/something",
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

    it("should blacklist 2.2.2.2", async () => {
      expect(await isBlacklisted("2.2.2.2")).toBe(true)
    })
  })

  describe("malformed CIDR entries", () => {
    let restoreEnv: (() => void) | undefined

    afterEach(async () => {
      restoreEnv?.()
      restoreEnv = undefined
      await refreshBlacklist()
    })

    it("should treat out of range ipv4 prefixes as a single host entry", async () => {
      restoreEnv = setEnv({ BLACKLIST_IPS: "1.1.1.1/33" })

      await refreshBlacklist()

      expect(await isBlacklisted("1.1.1.1")).toBe(true)
      expect(await isBlacklisted("1.1.1.2")).toBe(false)
    })

    it("should reject partially numeric prefixes and blacklist only the host", async () => {
      restoreEnv = setEnv({ BLACKLIST_IPS: "2.2.2.2/1foo" })

      await refreshBlacklist()

      expect(await isBlacklisted("2.2.2.2")).toBe(true)
      expect(await isBlacklisted("64.0.0.1")).toBe(false)
    })
  })
})
