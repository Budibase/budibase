import type { Agent, KnowledgeBase } from "@budibase/types"
import { knowledgeBase } from ".."
import { createRetrievalProviderForAgent } from "./index"
import { BudibaseVectorRetrievalProvider } from "./providers/budibaseVector"
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

  it("defaults to budibase vector when an agent has no knowledge bases", async () => {
    const provider = await createRetrievalProviderForAgent(buildAgent())

    expect(provider).toBeInstanceOf(BudibaseVectorRetrievalProvider)
    expect(findKnowledgeBaseMock).not.toHaveBeenCalled()
  })

  it("uses managed file search when any attached knowledge base is configured for it", async () => {
    findKnowledgeBaseMock.mockResolvedValueOnce({
      _id: "knowledgebase_1",
      name: "Support Docs",
      retrievalBackend: "managed_file_search",
    } as unknown as KnowledgeBase)

    const provider = await createRetrievalProviderForAgent(
      buildAgent(["knowledgebase_1"])
    )

    expect(provider).toBeInstanceOf(ManagedFileSearchRetrievalProvider)
    expect(findKnowledgeBaseMock).toHaveBeenCalledWith("knowledgebase_1")
  })

  it("defaults to budibase vector when retrieval backend is absent", async () => {
    findKnowledgeBaseMock.mockResolvedValueOnce({
      _id: "knowledgebase_1",
      name: "Support Docs",
    } as KnowledgeBase)

    const provider = await createRetrievalProviderForAgent(
      buildAgent(["knowledgebase_1"])
    )

    expect(provider).toBeInstanceOf(BudibaseVectorRetrievalProvider)
  })

  it("defaults to budibase vector when lookup returns no matching knowledge bases", async () => {
    findKnowledgeBaseMock.mockResolvedValue(undefined)

    const provider = await createRetrievalProviderForAgent(
      buildAgent(["knowledgebase_missing"])
    )

    expect(provider).toBeInstanceOf(BudibaseVectorRetrievalProvider)
  })

  it("uses managed file search when one of multiple knowledge bases is managed", async () => {
    findKnowledgeBaseMock
      .mockResolvedValueOnce({
        _id: "knowledgebase_1",
        name: "Ops KB",
      } as KnowledgeBase)
      .mockResolvedValueOnce({
        _id: "knowledgebase_2",
        name: "Docs KB",
        retrievalBackend: "managed_file_search",
      } as unknown as KnowledgeBase)

    const provider = await createRetrievalProviderForAgent(
      buildAgent(["knowledgebase_1", "knowledgebase_2"])
    )

    expect(provider).toBeInstanceOf(ManagedFileSearchRetrievalProvider)
    expect(findKnowledgeBaseMock).toHaveBeenCalledTimes(2)
  })
})
