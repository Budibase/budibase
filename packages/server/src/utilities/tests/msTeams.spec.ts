import {
  DEFAULT_MSTEAMS_SERVICE_URL,
  resolveDefaultMSTeamsServiceUrl,
  validateMSTeamsServiceUrl,
} from "../msTeams"

describe("resolveDefaultMSTeamsServiceUrl", () => {
  it.each(["not-a-url", "smba.trafficmanager.net", "http://example.com/"])(
    "falls back from an invalid override: %s",
    configuredServiceUrl => {
      expect(resolveDefaultMSTeamsServiceUrl(configuredServiceUrl)).toBe(
        "https://smba.trafficmanager.net/apis/"
      )
    }
  )

  it("accepts a valid HTTPS override", () => {
    expect(resolveDefaultMSTeamsServiceUrl("https://example.com/custom/")).toBe(
      "https://example.com/custom/"
    )
  })
})

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

  it.each(["?region=emea", "#emea"])(
    "rejects a configured-origin URL with suffix: %s",
    suffix => {
      expect(() =>
        validateMSTeamsServiceUrl(`${DEFAULT_MSTEAMS_SERVICE_URL}${suffix}`)
      ).toThrow("Invalid Microsoft Teams service URL")
    }
  )
})
