import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { AgentFileStatus } from "@budibase/types"
import * as ragSdk from "../../../../sdk/workspace/ai/rag"

jest.mock("../../../../sdk/workspace/ai/rag", () => {
  const originalModule = jest.requireActual("../../../../sdk/workspace/ai/rag")
  return {
    __esModule: true,
    ...originalModule,
  }
})

const config = new TestConfiguration()

describe("agent files", () => {
  const fileBuffer = Buffer.from("Hello from Budibase")

  const createAgentWithRag = async () => {
    const vectorDb = await config.api.vectorDb.create({
      name: "Agent Vector DB",
      provider: "pgvector",
      host: "localhost",
      port: 5432,
      database: "budibase",
      user: "bb_user",
      password: "secret",
    })

    const agent = await config.api.agent.create({
      name: "Support Agent",
      aiconfig: "default",
      description: "Support",
      promptInstructions: "Be helpful",
    })

    const updatedAgent = await config.api.agent.update({
      ...agent,
      ragConfig: {
        enabled: true,
        embeddingModel: "embedding-config",
        vectorDb: vectorDb._id!,
        ragMinDistance: 0.6,
        ragTopK: 3,
      },
    })

    return { agent: updatedAgent, vectorDb }
  }

  beforeEach(async () => {
    await config.newTenant()
    jest.restoreAllMocks()
  })

  it("uploads and lists agent files", async () => {
    const ingestSpy = jest
      .spyOn(ragSdk, "ingestAgentFile")
      .mockResolvedValue({ inserted: 1, total: 2 })

    const { agent } = await createAgentWithRag()

    const upload = await config.api.agentFiles.upload(agent._id!, {
      file: fileBuffer,
      name: "notes.txt",
    })

    expect(upload.file.status).toBe(AgentFileStatus.READY)
    expect(upload.file.chunkCount).toBe(2)
    expect(upload.file.filename).toBe("notes.txt")
    expect(ingestSpy).toHaveBeenCalled()

    const { files } = await config.api.agentFiles.fetch(agent._id!)
    expect(files).toHaveLength(1)
    expect(files[0]._id).toBe(upload.file._id)
  })

  it("deletes agent files and clears chunks", async () => {
    jest
      .spyOn(ragSdk, "ingestAgentFile")
      .mockResolvedValue({ inserted: 1, total: 1 })
    const deleteSpy = jest
      .spyOn(ragSdk, "deleteAgentFileChunks")
      .mockResolvedValue()

    const { agent } = await createAgentWithRag()

    const upload = await config.api.agentFiles.upload(agent._id!, {
      file: fileBuffer,
      name: "docs.txt",
    })

    const response = await config.api.agentFiles.remove(
      agent._id!,
      upload.file._id!
    )
    expect(response.deleted).toBe(true)

    const { files } = await config.api.agentFiles.fetch(agent._id!)
    expect(files).toHaveLength(0)
    expect(deleteSpy).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: true }),
      [upload.file.ragSourceId]
    )
  })
})
