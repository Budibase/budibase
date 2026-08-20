const mockGetInfo = jest.fn()
const mockDestroy = jest.fn()
const mockUpload = jest.fn()
const mockSearch = jest.fn()

jest.mock("pdf-parse", () => ({
  PDFParse: jest.fn().mockImplementation(() => ({
    getInfo: () => mockGetInfo(),
    destroy: () => mockDestroy(),
  })),
}))

jest.mock("../knowledgeBase/geminiFileStore", () => ({
  searchGeminiFileStore: (args: object) => mockSearch(args),
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

import { encryption } from "@budibase/backend-core"
import {
  AgentChannelProvider,
  ConversationAttachmentStatus,
} from "@budibase/types"
import {
  MAX_CONVERSATION_ATTACHMENT_BYTES,
  addConversationAttachmentsToModelMessages,
  persistConversationAttachment,
  prepareConversationAttachments,
} from "./attachments"

describe("conversation attachments", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetInfo.mockResolvedValue({ total: 500 })
    mockDestroy.mockResolvedValue(undefined)
    mockUpload.mockResolvedValue(undefined)
    mockSearch.mockResolvedValue([])
  })

  it("accepts PDFs with large page counts", async () => {
    const data = Buffer.from("%PDF-large-document")

    const attachments = prepareConversationAttachments({
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
        },
      ],
    })
    const metadata = await persistConversationAttachment({
      conversationId: "chat_1",
      attachment: attachments[0],
      data,
    })

    expect(mockGetInfo).toHaveBeenCalledTimes(1)
    expect(mockUpload).toHaveBeenCalledTimes(1)
    expect(attachments).toEqual([
      expect.objectContaining({
        providerFileId: "F123",
        filename: "large-document.pdf",
        size: data.byteLength,
        status: ConversationAttachmentStatus.QUEUED,
      }),
    ])
    expect(metadata).toEqual({ pageCount: 500 })
  })

  it("allows three files of 20 MB each", () => {
    const attachments = prepareConversationAttachments({
      conversation: { _id: "chat_1", attachments: [] },
      incoming: ["F1", "F2", "F3"].map(providerFileId => ({
        providerFileId,
        filename: `${providerFileId}.txt`,
        mimetype: "text/plain",
        size: MAX_CONVERSATION_ATTACHMENT_BYTES,
      })),
    })

    expect(attachments).toHaveLength(3)
  })

  it("rejects an individual file above 20 MB", () => {
    expect(() =>
      prepareConversationAttachments({
        conversation: { _id: "chat_1", attachments: [] },
        incoming: [
          {
            providerFileId: "F1",
            filename: "large.txt",
            mimetype: "text/plain",
            size: MAX_CONVERSATION_ATTACHMENT_BYTES + 1,
          },
        ],
      })
    ).toThrow("large.txt exceeds the 20 MB file limit")
  })

  it("rejects images", () => {
    expect(() =>
      prepareConversationAttachments({
        conversation: { _id: "chat_1", attachments: [] },
        incoming: [
          {
            providerFileId: "F1",
            filename: "image.png",
            mimetype: "image/png",
            size: 1024,
          },
        ],
      })
    ).toThrow("image.png has an unsupported file type")
  })

  it("rejects an empty downloaded file", async () => {
    await expect(
      persistConversationAttachment({
        conversationId: "chat_1",
        attachment: {
          id: "attachment_1",
          provider: AgentChannelProvider.MSTEAMS,
          providerFileId: "drive-item-1",
          filename: "empty.txt",
          mimetype: "text/plain",
          status: ConversationAttachmentStatus.PROCESSING,
          uploadedAt: new Date().toISOString(),
        },
        data: Buffer.alloc(0),
      })
    ).rejects.toThrow("empty.txt is empty")
  })

  it("accepts Teams metadata without a reported size and encrypts its download URL", () => {
    const downloadUrl = "https://files.example.com/report.txt"
    const attachments = prepareConversationAttachments({
      conversation: { _id: "chat_1", attachments: [] },
      provider: AgentChannelProvider.MSTEAMS,
      incoming: [
        {
          providerFileId: "drive-item-1:etag-1",
          filename: "report.txt",
          mimetype: "text/plain",
          downloadUrl,
        },
      ],
    })

    expect(attachments[0]).toEqual(
      expect.objectContaining({
        provider: AgentChannelProvider.MSTEAMS,
        providerFileId: "drive-item-1:etag-1",
        encryptedDownloadUrl: expect.any(String),
      })
    )
    expect(attachments[0].size).toBeUndefined()
    expect(
      encryption.compare(downloadUrl, attachments[0].encryptedDownloadUrl!)
    ).toBe(true)
  })

  it("retrieves bounded context instead of adding the file buffer", async () => {
    mockSearch.mockResolvedValue([
      {
        file_id: "rag-file-1",
        content: [
          {
            text: "Quarterly revenue was 42.",
            retrievedContext: { pageNumber: 37 },
          },
        ],
      },
    ])

    const messages = await addConversationAttachmentsToModelMessages({
      messages: [{ role: "user", content: "What was the revenue?" }],
      conversation: {
        _id: "chat_1",
        attachmentVectorStoreId: "store_1",
        attachments: [
          {
            id: "attachment_1",
            provider: AgentChannelProvider.SLACK,
            providerFileId: "F1",
            filename: "report.pdf",
            mimetype: "application/pdf",
            size: 1024,
            status: ConversationAttachmentStatus.READY,
            ragSourceId: "rag-file-1",
            uploadedAt: new Date().toISOString(),
          },
        ],
      },
    })

    expect(mockSearch).toHaveBeenCalledWith({
      vectorStoreId: "store_1",
      query: "What was the revenue?",
    })
    expect(messages).toEqual([
      {
        role: "user",
        content: [
          { type: "text", text: "What was the revenue?" },
          {
            type: "text",
            text: expect.stringContaining(
              '<conversation-file name="report.pdf" page="37">\nQuarterly revenue was 42.'
            ),
          },
        ],
      },
    ])
  })
})
