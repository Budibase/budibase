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
  type ChatConversationAttachment,
  ConversationAttachmentErrorCode,
  ConversationAttachmentStatus,
} from "@budibase/types"
import { encryption } from "@budibase/backend-core"
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

  describe("resending files", () => {
    const failed: ChatConversationAttachment = {
      id: "attachment_1",
      provider: AgentChannelProvider.MSTEAMS,
      providerFileId: "file_1",
      filename: "report.txt",
      mimetype: "text/plain",
      size: 100,
      status: ConversationAttachmentStatus.FAILED,
      errorCode: ConversationAttachmentErrorCode.TEAMS_FILE_ACCESS_DENIED,
      errorMessage: "Access denied",
      processedAt: "2026-01-01T00:00:00.000Z",
      uploadedAt: "2026-01-01T00:00:00.000Z",
      textLength: 100,
      ragSourceId: "old_source",
    }
    const incoming = {
      providerFileId: "file_1",
      filename: "updated.txt",
      mimetype: "text/plain",
      size: 200,
      downloadUrl: "https://example.com/fresh-download",
    }

    it.each([AgentChannelProvider.MSTEAMS, AgentChannelProvider.SLACK])(
      "requeues a failed %s file with fresh metadata and its existing attachment ID",
      provider => {
        const queued = prepareConversationAttachments({
          conversation: {
            _id: "chat_1",
            attachments: [{ ...failed, provider }],
          },
          incoming: [incoming, incoming],
          provider,
        })

        expect(queued).toEqual([
          {
            id: failed.id,
            provider,
            providerFileId: incoming.providerFileId,
            filename: incoming.filename,
            mimetype: incoming.mimetype,
            size: incoming.size,
            status: ConversationAttachmentStatus.QUEUED,
            encryptedDownloadUrl: expect.any(String),
            uploadedAt: expect.any(String),
          },
        ])
        expect(encryption.decrypt(queued[0].encryptedDownloadUrl!)).toBe(
          incoming.downloadUrl
        )
      }
    )

    it.each([
      ConversationAttachmentStatus.QUEUED,
      ConversationAttachmentStatus.PROCESSING,
      ConversationAttachmentStatus.READY,
      ConversationAttachmentStatus.DELETING,
    ])("does not requeue a %s file", status => {
      expect(
        prepareConversationAttachments({
          conversation: {
            _id: "chat_1",
            attachments: [{ ...failed, status }],
          },
          incoming: [incoming],
          provider: AgentChannelProvider.MSTEAMS,
        })
      ).toEqual([])
    })

    it("allows a retry at the file limit but rejects a fourth file", () => {
      const conversation = {
        _id: "chat_1",
        attachments: [
          failed,
          ...["file_2", "file_3"].map(providerFileId => ({
            ...failed,
            id: providerFileId,
            providerFileId,
            status: ConversationAttachmentStatus.READY,
          })),
        ],
      }

      expect(
        prepareConversationAttachments({
          conversation,
          incoming: [incoming],
          provider: AgentChannelProvider.MSTEAMS,
        })
      ).toEqual([
        expect.objectContaining({
          id: failed.id,
          status: ConversationAttachmentStatus.QUEUED,
        }),
      ])
      expect(() =>
        prepareConversationAttachments({
          conversation,
          incoming: [incoming, { ...incoming, providerFileId: "file_4" }],
          provider: AgentChannelProvider.MSTEAMS,
        })
      ).toThrow("A conversation can contain at most 3 files")
    })

    it("validates the metadata of a resent failed file", () => {
      expect(() =>
        prepareConversationAttachments({
          conversation: { _id: "chat_1", attachments: [failed] },
          incoming: [
            { ...incoming, size: MAX_CONVERSATION_ATTACHMENT_BYTES + 1 },
          ],
          provider: AgentChannelProvider.MSTEAMS,
        })
      ).toThrow("updated.txt exceeds the 20 MB file limit")
    })
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

  it.each(["What was the revenue?", "Summarize the report."])(
    "retrieves bounded context for the request: %s",
    async request => {
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
        messages: [{ role: "user", content: request }],
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
        query: request,
      })
      expect(messages).toEqual([
        {
          role: "user",
          content: [
            { type: "text", text: request },
            {
              type: "text",
              text: expect.stringContaining(
                '<conversation-file name="report.pdf" page="37">\nQuarterly revenue was 42.'
              ),
            },
          ],
        },
      ])
      expect(JSON.stringify(messages)).toContain(
        "Respond to the user's request above using the relevant context. Return a complete response."
      )
    }
  )

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
