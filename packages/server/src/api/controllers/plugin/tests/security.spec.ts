import { utils as coreUtils } from "@budibase/backend-core"
import { githubUpload } from "../github"
import { npmUpload } from "../npm"
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

  it("rejects github urls outside github.com", async () => {
    await expect(
      githubUpload("https://example.com/owner/repo", "plugin-name")
    ).rejects.toThrow("The plugin origin must be from Github")
  })

  it("rejects npm urls outside npm hosts", async () => {
    await expect(
      npmUpload("https://example.com/package/foo", "plugin-name")
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
