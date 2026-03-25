import fetch from "node-fetch"
import { isBlacklisted } from "../../blacklist"
import { fetchWithBlacklist } from "../outboundFetch"

jest.mock("node-fetch", () => jest.fn())
jest.mock("../../blacklist", () => ({
  isBlacklisted: jest.fn(),
}))

describe("outboundFetch", () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>
  const isBlacklistedMock = isBlacklisted as jest.MockedFunction<
    typeof isBlacklisted
  >

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("blocks blacklisted urls", async () => {
    isBlacklistedMock.mockResolvedValue(true)

    await expect(
      fetchWithBlacklist("http://169.254.169.254/metadata/v1/")
    ).rejects.toThrow("URL is blocked or could not be resolved safely.")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("blocks redirects to blacklisted urls", async () => {
    isBlacklistedMock.mockResolvedValueOnce(false).mockResolvedValueOnce(true)
    const resume = jest.fn()

    fetchMock.mockResolvedValue({
      status: 302,
      headers: { get: jest.fn().mockReturnValue("http://169.254.169.254/") },
      body: { resume },
    } as any)

    await expect(
      fetchWithBlacklist("https://example.com/spec.json")
    ).rejects.toThrow("URL is blocked or could not be resolved safely.")
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(resume).toHaveBeenCalledTimes(1)
  })

  it("rejects unsupported schemes", async () => {
    isBlacklistedMock.mockResolvedValue(false)

    await expect(fetchWithBlacklist("file:///etc/passwd")).rejects.toThrow(
      "Only HTTP(S) URLs are allowed."
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("returns the response for allowed urls", async () => {
    isBlacklistedMock.mockResolvedValue(false)
    const response = {
      status: 200,
      ok: true,
      headers: { get: jest.fn() },
    } as any
    fetchMock.mockResolvedValue(response)

    const result = await fetchWithBlacklist("https://example.com/spec.json")

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/spec.json",
      expect.objectContaining({ redirect: "manual" })
    )
    expect(result).toBe(response)
  })
})
