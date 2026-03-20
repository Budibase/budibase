import {
  type Agent,
  type KnowledgeBase,
  KnowledgeBaseType,
} from "@budibase/types"
import { knowledgeBase } from ".."
import { createRetrievalProviderForAgent } from "./index"
import { ManagedFileSearchRetrievalProvider } from "./providers/managedFileSearch"

jest.mock("..", () => ({
  knowledgeBase: {
    find: jest.fn(),
  },
}))

describe("createRetrievalProviderForAgent", () => {
  const findKnowledgeBaseMock = knowledgeBase.find as jest.MockedFunction<
    typeof knowledgeBase.find
  >

  const buildAgent = (knowledgeBases?: string[]) =>
    ({ knowledgeBases }) as Agent

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("throws when an agent has no knowledge bases", async () => {
    await expect(createRetrievalProviderForAgent(buildAgent())).rejects.toThrow(
      "No knowledge bases configured for agent retrieval"
    )
    expect(findKnowledgeBaseMock).not.toHaveBeenCalled()
  })

  it("uses managed file search when any attached knowledge base is configured for it", async () => {
    findKnowledgeBaseMock.mockResolvedValueOnce({
      _id: "knowledgebase_1",
      name: "Support Docs",
      type: KnowledgeBaseType.GOOGLE_DRIVE,
    } as unknown as KnowledgeBase)

    const provider = await createRetrievalProviderForAgent(
      buildAgent(["knowledgebase_1"])
    )

    expect(provider).toBeInstanceOf(ManagedFileSearchRetrievalProvider)
    expect(findKnowledgeBaseMock).toHaveBeenCalledWith("knowledgebase_1")
  })

  it("throws when knowledge type is unsupported", async () => {
    findKnowledgeBaseMock.mockResolvedValueOnce({
      _id: "knowledgebase_1",
      name: "Support Docs",
    } as unknown as KnowledgeBase)

    await expect(
      createRetrievalProviderForAgent(buildAgent(["knowledgebase_1"]))
    ).rejects.toThrow("Unsupported knowledge base type")
  })

  it("throws when lookup returns no matching knowledge bases", async () => {
    findKnowledgeBaseMock.mockResolvedValue(undefined)

    await expect(
      createRetrievalProviderForAgent(buildAgent(["knowledgebase_missing"]))
    ).rejects.toThrow("Knowledge base not found for retrieval")
  })

  it("uses managed file search when one of multiple knowledge bases is managed", async () => {
    findKnowledgeBaseMock
      .mockResolvedValueOnce({
        _id: "knowledgebase_1",
        name: "Ops KB",
        type: KnowledgeBaseType.LOCAL,
      } as KnowledgeBase)
      .mockResolvedValueOnce({
        _id: "knowledgebase_2",
        name: "Docs KB",
        type: KnowledgeBaseType.GOOGLE_DRIVE,
      } as unknown as KnowledgeBase)

    const provider = await createRetrievalProviderForAgent(
      buildAgent(["knowledgebase_1", "knowledgebase_2"])
    )

    expect(provider).toBeInstanceOf(ManagedFileSearchRetrievalProvider)
    expect(findKnowledgeBaseMock).toHaveBeenCalledTimes(2)
  })
})
