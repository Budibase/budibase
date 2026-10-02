import fs from "fs"
import { Readable } from "stream"

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  const tempDir = fs.mkdtempSync("/tmp/bb-file-utils-")
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
      budibaseTempDir: jest.fn(() => tempDir),
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
import { uploadFile, uploadUrl } from "../fileUtils"

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

describe("fileUtils.uploadFile", () => {
  it("reuses an existing file for repeated uploads", async () => {
    const file = {
      fileName: "document",
      extension: ".txt",
      content: "hello",
    }

    await expect(uploadFile(file)).resolves.toEqual(
      expect.objectContaining({ name: "document.txt" })
    )
    await expect(uploadFile(file)).resolves.toEqual(
      expect.objectContaining({ name: "document.txt" })
    )
  })
})
