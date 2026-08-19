const mockTryGet = jest.fn()
const mockPut = jest.fn()
const mockDeleteObjects = jest.fn()
const mockDeleteVectorStore = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceDB: () => ({
        tryGet: (id: string) => mockTryGet(id),
        put: (doc: object) => mockPut(doc),
      }),
      getOrThrowWorkspaceId: () => "workspace_1",
    },
    locks: {
      doWithLock: async (_options: object, task: () => Promise<void>) => {
        await task()
        return { executed: true }
      },
    },
  }
})

jest.mock("./attachments", () => ({
  deleteConversationAttachmentObjects: (args: object) =>
    mockDeleteObjects(args),
}))

jest.mock("../knowledgeBase/geminiFileStore", () => ({
  deleteGeminiVectorStore: (id: string) => mockDeleteVectorStore(id),
}))

import {
  AgentChannelProvider,
  type ChatConversation,
  ConversationAttachmentStatus,
  ConversationAttachmentTurnStatus,
} from "@budibase/types"
import { cleanupConversationAttachments } from "./attachmentCleanupQueue"

describe("conversation attachment cleanup", () => {
  let conversation: ChatConversation

  beforeEach(() => {
    jest.clearAllMocks()
    const now = new Date().toISOString()
    conversation = {
      _id: "chat_1",
      _rev: "1-a",
      agentId: "agent_1",
      userId: "user_1",
      messages: [],
      attachmentVectorStoreId: "store_1",
      attachmentExpiresAt: now,
      attachments: [
        {
          id: "attachment_1",
          provider: AgentChannelProvider.SLACK,
          providerFileId: "F1",
          filename: "report.txt",
          mimetype: "text/plain",
          size: 100,
          status: ConversationAttachmentStatus.READY,
          ragSourceId: "rag_1",
          uploadedAt: now,
        },
      ],
      pendingAttachmentTurns: [
        {
          id: "turn_1",
          message: {
            id: "message_1",
            role: "user",
            parts: [{ type: "text", text: "Question" }],
          },
          attachmentIds: ["attachment_1"],
          status: ConversationAttachmentTurnStatus.QUEUED,
          requester: { userId: "user_1", linked: true },
          createdAt: now,
          updatedAt: now,
        },
      ],
    }
    mockTryGet.mockImplementation(async () => conversation)
    mockPut.mockImplementation(async (doc: ChatConversation) => {
      conversation = { ...doc, _rev: "2-b" }
      return { rev: "2-b" }
    })
    mockDeleteObjects.mockResolvedValue(undefined)
    mockDeleteVectorStore.mockResolvedValue(undefined)
  })

  it("deletes the vector store, objects, and transient state", async () => {
    await cleanupConversationAttachments("chat_1", { force: true })

    expect(mockDeleteVectorStore).toHaveBeenCalledWith("store_1")
    expect(mockDeleteObjects).toHaveBeenCalledWith({
      conversationId: "chat_1",
      attachments: expect.arrayContaining([
        expect.objectContaining({
          id: "attachment_1",
          status: ConversationAttachmentStatus.DELETING,
        }),
      ]),
    })
    expect(conversation.attachments).toBeUndefined()
    expect(conversation.attachmentVectorStoreId).toBeUndefined()
    expect(conversation.pendingAttachmentTurns).toBeUndefined()
    expect(conversation.attachmentDeletingAt).toBeUndefined()
  })
})
