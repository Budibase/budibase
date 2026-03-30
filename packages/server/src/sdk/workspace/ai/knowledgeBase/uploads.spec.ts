const mockGetWorkspaceId = jest.fn()
const mockFindKnowledgeBase = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      getOrThrowWorkspaceId: (...args: any[]) => mockGetWorkspaceId(...args),
    },
  }
})

jest.mock("./crud", () => ({
  find: (...args: any[]) => mockFindKnowledgeBase(...args),
}))

import { uploadKnowledgeBaseFile } from "./uploads"

describe("knowledgeBase uploads", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetWorkspaceId.mockReturnValue("workspace_1")
  })

  it("throws 404 when knowledge base does not exist", async () => {
    mockFindKnowledgeBase.mockResolvedValue(undefined)

    await expect(
      uploadKnowledgeBaseFile({
        knowledgeBaseId: "kb_missing",
        filename: "notes.txt",
        buffer: Buffer.from("test"),
        uploadedBy: "user_1",
      })
    ).rejects.toMatchObject({
      status: 404,
      message: "Knowledge base not found",
    })
  })
})
