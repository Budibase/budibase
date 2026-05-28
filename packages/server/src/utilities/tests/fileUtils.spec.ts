import fs from "fs"
import { Readable } from "stream"

jest.mock("@budibase/backend-core/utils", () => ({
  fetchWithBlacklist: jest.fn(),
}))

jest.mock("@budibase/backend-core", () => ({
  context: {
    getProdWorkspaceId: jest.fn(() => "app_test"),
  },
  objectStore: {
    budibaseTempDir: jest.fn(() => fs.mkdtempSync("/tmp/bb-file-utils-")),
    upload: jest.fn(async ({ filename }: { filename: string }) => ({
      Key: filename,
    })),
    getAppFileUrl: jest.fn(async (key: string) => `https://example.com/${key}`),
  },
}))

import * as coreUtils from "@budibase/backend-core/utils"
import { uploadUrl } from "../fileUtils"

describe("fileUtils.uploadUrl", () => {
  it("uses fetchWithBlacklist for remote URL downloads", async () => {
    const body = Readable.from([Buffer.from("hello")])
    ;(
      coreUtils.fetchWithBlacklist as jest.MockedFunction<
        typeof coreUtils.fetchWithBlacklist
      >
    ).mockResolvedValue({
      url: "https://example.com/test.jpg",
      body,
    } as Response)

    const result = await uploadUrl("https://example.com/test.jpg")

    expect(coreUtils.fetchWithBlacklist).toHaveBeenCalledWith(
      "https://example.com/test.jpg"
    )
    expect(result?.url).toContain("app_test/attachments/")
  })
})
