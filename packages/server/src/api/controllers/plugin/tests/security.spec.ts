import { utils as coreUtils } from "@budibase/backend-core"
import { githubUpload } from "../github"
import { npmUpload } from "../npm"
import { urlUpload } from "../url"
import { downloadUnzipTarball } from "../utils"
import { getPluginMetadata } from "../../../../utilities/fileSystem"

jest.mock("@budibase/backend-core", () => ({
  utils: {
    fetchWithBlacklist: jest.fn(),
  },
}))

jest.mock("../utils", () => ({
  downloadUnzipTarball: jest.fn(),
}))

jest.mock("../../../../utilities/fileSystem", () => ({
  getPluginMetadata: jest.fn(),
  deleteFolderFileSystem: jest.fn(),
}))

describe("plugin SSRF hardening", () => {
  const fetchWithBlacklistMock =
    coreUtils.fetchWithBlacklist as jest.MockedFunction<
      typeof coreUtils.fetchWithBlacklist
    >
  const downloadUnzipTarballMock = downloadUnzipTarball as jest.MockedFunction<
    typeof downloadUnzipTarball
  >
  const getPluginMetadataMock = getPluginMetadata as jest.MockedFunction<
    typeof getPluginMetadata
  >

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ─── urlUpload URL validation ──────────────────────────────────────────────

  describe("urlUpload URL validation", () => {
    it.each([
      [
        "non-https URL",
        "http://example.com/plugin.tar.gz",
        "Plugin URL must use HTTPS.",
      ],
      ["invalid URL", "not-a-url", "Invalid plugin URL."],
      [
        ".tar.gz only in fragment — SSRF bypass attempt",
        "https://169.254.169.254/latest/meta-data#.tar.gz",
        "Plugin must be compressed into a gzipped tarball.",
      ],
      [
        ".tar.gz only in query string — SSRF bypass attempt",
        "https://169.254.169.254/latest/meta-data?.tar.gz",
        "Plugin must be compressed into a gzipped tarball.",
      ],
      [
        "path does not end with .tar.gz",
        "https://example.com/plugin.tar.gz.evil",
        "Plugin must be compressed into a gzipped tarball.",
      ],
      [
        ".tar.gz in subdirectory but not at the end",
        "https://example.com/plugin.tar.gz/extra",
        "Plugin must be compressed into a gzipped tarball.",
      ],
    ])("rejects %s", async (_label, url, expectedError) => {
      await expect(urlUpload(url, "plugin-name")).rejects.toThrow(expectedError)
      expect(downloadUnzipTarballMock).not.toHaveBeenCalled()
    })

    it("accepts a valid https URL ending with .tar.gz in the path", async () => {
      downloadUnzipTarballMock.mockResolvedValue("/tmp/plugin")
      getPluginMetadataMock.mockResolvedValue({} as any)

      await urlUpload("https://example.com/plugin.tar.gz", "plugin-name")

      expect(downloadUnzipTarballMock).toHaveBeenCalledWith(
        "https://example.com/plugin.tar.gz",
        "plugin-name",
        {},
        { followRedirects: false }
      )
    })

    it("passes followRedirects: false to prevent redirect-based SSRF", async () => {
      downloadUnzipTarballMock.mockResolvedValue("/tmp/plugin")
      getPluginMetadataMock.mockResolvedValue({} as any)

      await urlUpload(
        "https://releases.example.com/v1.0/myplugin.tar.gz",
        "myplugin"
      )

      const [, , , options] = downloadUnzipTarballMock.mock.calls[0]
      expect(options).toEqual({ followRedirects: false })
    })
  })

  // ─── githubUpload URL validation ───────────────────────────────────────────

  describe("githubUpload URL validation", () => {
    it("rejects github urls outside github.com", async () => {
      await expect(
        githubUpload("https://example.com/owner/repo", "plugin-name")
      ).rejects.toThrow("The plugin origin must be from Github")
    })

    it("rejects http (non-https) github urls", async () => {
      await expect(
        githubUpload("http://github.com/owner/repo", "plugin-name")
      ).rejects.toThrow("The plugin origin must be from Github")
    })

    it("rejects a github URL that uses github.com as a path component", async () => {
      await expect(
        githubUpload("https://evil.com/github.com/owner/repo", "plugin-name")
      ).rejects.toThrow("The plugin origin must be from Github")
    })
  })

  // ─── npmUpload URL validation ──────────────────────────────────────────────

  describe("npmUpload URL validation", () => {
    it("rejects npm urls outside npm hosts", async () => {
      await expect(
        npmUpload("https://example.com/package/foo", "plugin-name")
      ).rejects.toThrow("The plugin origin must be from NPM")
    })

    it("rejects http (non-https) npm urls", async () => {
      await expect(
        npmUpload("http://www.npmjs.com/package/foo", "plugin-name")
      ).rejects.toThrow("The plugin origin must be from NPM")
    })

    it("rejects a URL that uses npmjs.com as a subdomain of another host", async () => {
      await expect(
        npmUpload("https://www.npmjs.com.evil.com/package/foo", "plugin-name")
      ).rejects.toThrow("The plugin origin must be from NPM")
    })

    it("resolves npm package metadata through fetchWithBlacklist", async () => {
      fetchWithBlacklistMock.mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({
          name: "foo",
          "dist-tags": { latest: "1.0.0" },
          versions: {
            "1.0.0": {
              dist: {
                tarball: "https://registry.npmjs.org/foo/-/foo-1.0.0.tgz",
              },
            },
          },
        }),
      } as any)
      downloadUnzipTarballMock.mockResolvedValue("/tmp/plugin")
      getPluginMetadataMock.mockResolvedValue({} as any)

      await npmUpload("https://www.npmjs.com/package/foo", "plugin-name")

      expect(fetchWithBlacklistMock).toHaveBeenCalledWith(
        "https://registry.npmjs.org/foo"
      )
      expect(downloadUnzipTarballMock).toHaveBeenCalledWith(
        "https://registry.npmjs.org/foo/-/foo-1.0.0.tgz",
        "foo",
        {}
      )
    })
  })
})
