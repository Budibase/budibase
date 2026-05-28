import fs from "fs"
import { Readable } from "stream"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      getProdWorkspaceId: jest.fn(() => "app_test"),
    },
    utils: {
      fetchWithBlacklist: jest.fn(),
    },
    objectStore: {
      ...actual.objectStore,
      budibaseTempDir: jest.fn(() => fs.mkdtempSync("/tmp/bb-file-utils-")),
      upload: jest.fn(async ({ filename }: { filename: string }) => ({
        Key: filename,
      })),
      getAppFileUrl: jest.fn(
        async (key: string) => `https://example.com/${key}`
      ),
    },
  }
})

import { utils } from "@budibase/backend-core"
import { uploadUrl } from "../fileUtils"

describe("fileUtils.uploadUrl", () => {
  const fetchWithBlacklistMock =
    utils.fetchWithBlacklist as jest.MockedFunction<
      typeof utils.fetchWithBlacklist
    >

  it("uses fetchWithBlacklist for remote URL downloads", async () => {
    const body = Readable.from([Buffer.from("hello")])
    fetchWithBlacklistMock.mockResolvedValue({
      url: "https://example.com/test.jpg",
      body,
    } as unknown as Response)

    const result = await uploadUrl("https://example.com/test.jpg")

    expect(utils.fetchWithBlacklist).toHaveBeenCalledWith(
      "https://example.com/test.jpg"
    )
    expect(result?.url).toContain("app_test/attachments/")
  })
})
