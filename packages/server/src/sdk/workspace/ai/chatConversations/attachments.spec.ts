const mockGetInfo = jest.fn()
const mockDestroy = jest.fn()
const mockUpload = jest.fn()

jest.mock("pdf-parse", () => ({
  PDFParse: jest.fn().mockImplementation(() => ({
    getInfo: () => mockGetInfo(),
    destroy: () => mockDestroy(),
  })),
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getOrThrowWorkspaceId: () => "workspace_1",
    },
    objectStore: {
      ...actual.objectStore,
      upload: (args: object) => mockUpload(args),
    },
  }
})

import { uploadConversationAttachments } from "./attachments"

describe("conversation attachments", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetInfo.mockResolvedValue({ total: 500 })
    mockDestroy.mockResolvedValue(undefined)
    mockUpload.mockResolvedValue(undefined)
  })

  it("accepts PDFs with large page counts", async () => {
    const data = Buffer.from("%PDF-large-document")

    const attachments = await uploadConversationAttachments({
      conversation: {
        _id: "chat_1",
        attachments: [],
      },
      incoming: [
        {
          providerFileId: "F123",
          filename: "large-document.pdf",
          mimetype: "application/pdf",
          size: data.byteLength,
          fetchData: async () => data,
        },
      ],
    })

    expect(mockGetInfo).toHaveBeenCalledTimes(1)
    expect(mockUpload).toHaveBeenCalledTimes(1)
    expect(attachments).toEqual([
      expect.objectContaining({
        providerFileId: "F123",
        filename: "large-document.pdf",
        size: data.byteLength,
        pageCount: 500,
      }),
    ])
  })
})
