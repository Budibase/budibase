import { configs } from "@budibase/backend-core"

import { isAbsoluteUrl, toAbsoluteUrl } from "../utils"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual<typeof import("@budibase/backend-core")>(
    "@budibase/backend-core"
  )

  return {
    ...actual,
    configs: {
      ...actual.configs,
      getPlatformUrl: jest.fn(),
    },
  }
})

describe("webhook controller utils", () => {
  const getPlatformUrl = jest.mocked(configs.getPlatformUrl)

  beforeEach(() => {
    getPlatformUrl.mockResolvedValue("http://localhost:10000")
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("isAbsoluteUrl", () => {
    it.each(["http://example.com/file.pdf", "https://example.com/file.pdf"])(
      "detects absolute URL %s",
      url => {
        expect(isAbsoluteUrl(url)).toBe(true)
      }
    )

    it.each(["/files/source.pdf", "files/source.pdf"])(
      "detects non-absolute URL %s",
      url => {
        expect(isAbsoluteUrl(url)).toBe(false)
      }
    )
  })

  describe("toAbsoluteUrl", () => {
    it.each(["http://example.com/file.pdf", "https://example.com/file.pdf"])(
      "returns absolute URL %s unchanged",
      async url => {
        await expect(toAbsoluteUrl(url)).resolves.toEqual(url)
        expect(getPlatformUrl).not.toHaveBeenCalled()
      }
    )

    it("prefixes root-relative URLs with the tenant-aware platform URL", async () => {
      await expect(toAbsoluteUrl("/files/source.pdf")).resolves.toEqual(
        "http://localhost:10000/files/source.pdf"
      )
      expect(getPlatformUrl).toHaveBeenCalledWith({ tenantAware: true })
    })

    it("trims a trailing slash from the platform URL", async () => {
      getPlatformUrl.mockResolvedValue("http://localhost:10000/")

      await expect(toAbsoluteUrl("/files/source.pdf")).resolves.toEqual(
        "http://localhost:10000/files/source.pdf"
      )
    })

    it("returns non-root-relative URLs unchanged", async () => {
      await expect(toAbsoluteUrl("files/source.pdf")).resolves.toEqual(
        "files/source.pdf"
      )
      expect(getPlatformUrl).not.toHaveBeenCalled()
    })
  })
})
