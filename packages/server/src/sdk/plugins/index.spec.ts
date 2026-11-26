import { parseGithubRepo } from "./githubUrl"

describe("parseGithubRepo", () => {
  it("parses a GitHub repository URL", () => {
    expect(parseGithubRepo("https://github.com/Budibase/budibase")).toEqual({
      repo: "Budibase/budibase",
      url: "https://github.com/Budibase/budibase",
    })
  })

  it.each([
    "https://github.com.evil.com/Budibase/budibase",
    "https://evil.com/https://github.com/Budibase/budibase",
    "https://github.com@evil.com/Budibase/budibase",
  ])("rejects a deceptive GitHub URL: %s", url => {
    expect(parseGithubRepo(url)).toEqual({})
  })
})
