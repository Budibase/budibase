jest.mock("../../knowledgeBase/azureFileStore")
jest.mock("../../knowledgeBase/files")

import {
  KnowledgeBaseFileStatus,
  KnowledgeBaseType,
  type AzureKnowledgeBase,
  type KnowledgeBaseFile,
  type WithRequired,
} from "@budibase/types"
import {
  ingestAzureFile,
  deleteAzureFileFromStore,
} from "../../knowledgeBase/azureFileStore"
import { updateKnowledgeBaseFile } from "../../knowledgeBase/files"
import { AzureRagProcessor } from "./azure"

const knowledgeBase: WithRequired<AzureKnowledgeBase, "_id"> = {
  _id: "kb_1",
  name: "Docs",
  type: KnowledgeBaseType.AZURE,
  config: { vectorStoreId: "vs_1" },
}
const file: WithRequired<KnowledgeBaseFile, "_id"> = {
  _id: "file_1",
  knowledgeBaseId: "kb_1",
  filename: "notes.txt",
  status: KnowledgeBaseFileStatus.PROCESSING,
  objectStoreKey: "workspace_1/notes.txt",
  uploadedBy: "user_1",
}

describe("Azure RAG processor", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.mocked(ingestAzureFile).mockResolvedValue({ fileId: "azure_file_1" })
    jest.mocked(deleteAzureFileFromStore).mockResolvedValue(undefined)
  })

  it("persists the ready status and Azure source ID after ingestion", async () => {
    await new AzureRagProcessor(knowledgeBase).ingestKnowledgeBaseFile(
      file,
      Buffer.from("Sample notes")
    )
    expect(updateKnowledgeBaseFile).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "file_1",
        status: KnowledgeBaseFileStatus.READY,
        ragSourceId: "azure_file_1",
        processedAt: expect.any(String),
      })
    )
  })

  it("cleans up an indexed Azure file if persisting the result fails", async () => {
    jest
      .mocked(updateKnowledgeBaseFile)
      .mockRejectedValue(new Error("Database unavailable"))
    await expect(
      new AzureRagProcessor(knowledgeBase).ingestKnowledgeBaseFile(
        file,
        Buffer.from("Sample notes")
      )
    ).rejects.toThrow("Database unavailable")
    expect(deleteAzureFileFromStore).toHaveBeenCalledWith({
      vectorStoreId: "vs_1",
      fileId: "azure_file_1",
    })
  })
})
