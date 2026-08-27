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

  it("rejects ambiguous filename matches when attachments are filtered", async () => {
    mockSearch.mockResolvedValue([
      {
        filename: "report.pdf",
        content: "Content from the unselected attachment.",
      },
      {
        file_id: "rag-selected",
        filename: "report.pdf",
        content: "Content from the selected attachment.",
      },
    ])

    const messages = await addConversationAttachmentsToModelMessages({
      messages: [{ role: "user", content: "What was in the report?" }],
      conversation: {
        _id: "chat_1",
        attachmentVectorStoreId: "store_1",
        attachments: [
          {
            id: "attachment_selected",
            provider: AgentChannelProvider.SLACK,
            providerFileId: "F1",
            filename: "report.pdf",
            mimetype: "application/pdf",
            size: 1024,
            status: ConversationAttachmentStatus.READY,
            ragSourceId: "rag-selected",
            uploadedAt: new Date().toISOString(),
          },
          {
            id: "attachment_unselected",
            provider: AgentChannelProvider.SLACK,
            providerFileId: "F2",
            filename: "report.pdf",
            mimetype: "application/pdf",
            size: 1024,
            status: ConversationAttachmentStatus.READY,
            ragSourceId: "rag-unselected",
            uploadedAt: new Date().toISOString(),
          },
        ],
      },
      attachmentIds: ["attachment_selected"],
    })

    expect(messages).toEqual([
      {
        role: "user",
        content: [
          { type: "text", text: "What was in the report?" },
          {
            type: "text",
            text: expect.stringContaining(
              "Content from the selected attachment."
            ),
          },
        ],
      },
    ])
    expect(JSON.stringify(messages)).not.toContain(
      "Content from the unselected attachment."
    )
  })

  it("accepts a unique filename match when attachments are filtered", async () => {
    mockSearch.mockResolvedValue([
      {
        filename: "selected.pdf",
        content: "Content from the selected attachment.",
      },
    ])

    const messages = await addConversationAttachmentsToModelMessages({
      messages: [{ role: "user", content: "What was in the report?" }],
      conversation: {
        _id: "chat_1",
        attachmentVectorStoreId: "store_1",
        attachments: [
          {
            id: "attachment_selected",
            provider: AgentChannelProvider.SLACK,
            providerFileId: "F1",
            filename: "selected.pdf",
            mimetype: "application/pdf",
            size: 1024,
            status: ConversationAttachmentStatus.READY,
            ragSourceId: "rag-selected",
            uploadedAt: new Date().toISOString(),
          },
          {
            id: "attachment_unselected",
            provider: AgentChannelProvider.SLACK,
            providerFileId: "F2",
            filename: "other.pdf",
            mimetype: "application/pdf",
            size: 1024,
            status: ConversationAttachmentStatus.READY,
            ragSourceId: "rag-unselected",
            uploadedAt: new Date().toISOString(),
          },
        ],
      },
      attachmentIds: ["attachment_selected"],
    })

    expect(messages).toEqual([
      {
        role: "user",
        content: [
          { type: "text", text: "What was in the report?" },
          {
            type: "text",
            text: expect.stringContaining(
              '<conversation-file name="selected.pdf">\nContent from the selected attachment.'
            ),
          },
        ],
      },
    ])
  })
})
