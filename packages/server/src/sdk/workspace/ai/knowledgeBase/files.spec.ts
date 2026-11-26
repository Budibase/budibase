import { KnowledgeBaseFileStatus, KnowledgeBaseType } from "@budibase/types"

let workspaceId = "app_dev_123"
const workspaceFiles = new Map<string, Map<string, object>>()
const mockDeleteObject = jest.fn()
const mockInvalidatePublishStore = jest.fn()

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getOrThrowWorkspaceId: () => workspaceId,
      doInWorkspaceContext: async (
        id: string,
        action: () => Promise<unknown>
      ) => {
        const previous = workspaceId
        workspaceId = id
        try {
          return await action()
        } finally {
          workspaceId = previous
        }
      },
      getWorkspaceDB: () => ({
        tryGet: async (id: string) => workspaceFiles.get(workspaceId)?.get(id),
        remove: async (file: { _id: string }) => {
          workspaceFiles.get(workspaceId)?.delete(file._id)
        },
      }),
    },
    objectStore: {
      ...actual.objectStore,
      deleteFile: (...args: any[]) => mockDeleteObject(...args),
    },
    locks: {
      ...actual.locks,
      doWithLock: async (
        _options: unknown,
        action: () => Promise<unknown>
      ) => ({
        result: await action(),
      }),
    },
    events: {
      ...actual.events,
      ai: { ...actual.events.ai, ragFileDeleted: jest.fn() },
    },
  }
})

jest.mock("./workspaceStore", () => ({
  invalidateWorkspaceGeminiPublishStore: (...args: any[]) =>
    mockInvalidatePublishStore(...args),
}))

import { removeKnowledgeBaseFile } from "./files"

describe("removeKnowledgeBaseFile", () => {
  const knowledgeBase = {
    _id: "kb_1",
    name: "Knowledge",
    type: KnowledgeBaseType.GEMINI,
    config: { googleFileStoreId: "legacy-store" },
  }
  const file = {
    _id: "file_1",
    knowledgeBaseId: "kb_1",
    filename: "policy.md",
    objectStoreKey: "objects/policy.md",
    status: KnowledgeBaseFileStatus.READY,
    uploadedBy: "user_1",
  }

  beforeEach(() => {
    jest.clearAllMocks()
    workspaceId = "app_dev_123"
    workspaceFiles.clear()
    workspaceFiles.set("app_dev_123", new Map([[file._id, file]]))
    mockInvalidatePublishStore.mockResolvedValue(undefined)
    mockDeleteObject.mockResolvedValue(undefined)
  })

  it("keeps the blob when production still references it", async () => {
    workspaceFiles.set("app_123", new Map([[file._id, { ...file }]]))

    await removeKnowledgeBaseFile(knowledgeBase, file)

    expect(mockDeleteObject).not.toHaveBeenCalled()
    expect(workspaceFiles.get("app_dev_123")?.has(file._id)).toBe(false)
    expect(workspaceFiles.get("app_123")?.has(file._id)).toBe(true)
  })

  it("deletes the blob when no other workspace references it", async () => {
    await removeKnowledgeBaseFile(knowledgeBase, file)

    expect(mockDeleteObject).toHaveBeenCalledWith(
      expect.anything(),
      file.objectStoreKey
    )
  })
})
