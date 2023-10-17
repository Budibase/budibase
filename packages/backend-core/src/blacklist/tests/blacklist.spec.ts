import { refreshBlacklist, isBlacklisted } from ".."
import env from "../../environment"

describe("blacklist", () => {
  beforeAll(async () => {
    env._set(
      "BLACKLIST_IPS",
      "www.google.com,192.168.1.1, 1.1.1.1,2.2.2.2/something"
    )
    await refreshBlacklist()
  })

  it("should blacklist 192.168.1.1", async () => {
    expect(await isBlacklisted("192.168.1.1")).toBe(true)
  })

  it("should allow 192.168.1.2", async () => {
    expect(await isBlacklisted("192.168.1.2")).toBe(false)
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
