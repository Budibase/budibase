import {
  DEFAULT_MSTEAMS_SERVICE_URL,
  validateMSTeamsServiceUrl,
} from "../msTeams"

describe("validateMSTeamsServiceUrl", () => {
  it("accepts paths on the configured Teams service origin", () => {
    const origin = new URL(DEFAULT_MSTEAMS_SERVICE_URL).origin

    expect(validateMSTeamsServiceUrl(`${origin}/emea/`)).toBe(`${origin}/emea/`)
  })

  it.each([
    "http://smba.trafficmanager.net/apis/",
    "https://example.com/",
    "https://smba.trafficmanager.net.example.com/",
    "https://user:password@smba.trafficmanager.net/",
    "not-a-url",
  ])("rejects an untrusted service URL: %s", serviceUrl => {
    expect(() => validateMSTeamsServiceUrl(serviceUrl)).toThrow(
      "Invalid Microsoft Teams service URL"
    )
  })
})
