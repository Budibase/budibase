import { FormData as UndiciFormData } from "undici"
import { withEnv } from "../../../../environment"
import { getPool, resetHttpMocking } from "../../../../tests/jestEnv"
import {
  createAzureFileStore,
  deleteAzureFileFromStore,
  deleteAzureVectorStore,
  ingestAzureFile,
  searchAzureFileStore,
} from "./azureFileStore"

const endpoint = "https://example.com"
const azureEnv = {
  AZURE_OPENAI_ENDPOINT: endpoint,
  AZURE_OPENAI_API_KEY: "test-key",
}
const fileInput = {
  vectorStoreId: "vs_1",
  filename: "notes.txt",
  buffer: Buffer.from("The access code is LANTERN-5831."),
}

describe("Azure knowledge file store", () => {
  const originalFormData = globalThis.FormData
  beforeAll(() =>
    Object.defineProperty(globalThis, "FormData", {
      value: UndiciFormData,
      configurable: true,
      writable: true,
    })
  )
  afterAll(() =>
    Object.defineProperty(globalThis, "FormData", {
      value: originalFormData,
      configurable: true,
      writable: true,
    })
  )
  afterEach(async () => {
    await resetHttpMocking()
  })

  it("requires Azure credentials", async () => {
    await withEnv(
      { AZURE_OPENAI_API_KEY: "", AZURE_OPENAI_ENDPOINT: "" },
      async () => {
        await expect(
          createAzureFileStore({ name: "Docs" })
        ).rejects.toMatchObject({ status: 400 })
      }
    )
  })

  it("creates an Azure store", async () => {
    getPool(endpoint)
      .intercept({
        path: "/openai/v1/vector_stores",
        method: "POST",
        body: JSON.stringify({ name: "Docs" }),
        headers: { authorization: "Bearer test-key" },
      })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, { id: "vs_1" })
    await withEnv(azureEnv, async () => {
      await expect(createAzureFileStore({ name: "Docs" })).resolves.toBe("vs_1")
    })
  })

  it("waits for indexing before returning the Azure source ID", async () => {
    const pool = getPool(endpoint)
    pool
      .intercept({ path: "/openai/v1/files", method: "POST" })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, { id: "file_1" })
    pool
      .intercept({
        path: "/openai/v1/vector_stores/vs_1/files",
        method: "POST",
        body: JSON.stringify({ file_id: "file_1" }),
      })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, { id: "file_1", status: "in_progress" })
    pool
      .intercept({
        path: "/openai/v1/vector_stores/vs_1/files/file_1",
        method: "GET",
      })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, { id: "file_1", status: "completed" })
    await withEnv(azureEnv, async () => {
      await expect(ingestAzureFile(fileInput)).resolves.toEqual({
        fileId: "file_1",
      })
    })
  })

  it("deletes an uploaded file when indexing fails", async () => {
    const pool = getPool(endpoint)
    pool
      .intercept({ path: "/openai/v1/files", method: "POST" })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, { id: "file_1" })
    pool
      .intercept({
        path: "/openai/v1/vector_stores/vs_1/files",
        method: "POST",
      })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, { id: "file_1", status: "in_progress" })
    pool
      .intercept({
        path: "/openai/v1/vector_stores/vs_1/files/file_1",
        method: "GET",
      })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, {
        id: "file_1",
        status: "failed",
        last_error: { message: "Unsupported file" },
      })
    const deleted = jest.fn(() => ({ deleted: true }))
    pool
      .intercept({ path: "/openai/v1/files/file_1", method: "DELETE" })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, deleted)
    await withEnv(azureEnv, async () => {
      await expect(ingestAzureFile(fileInput)).rejects.toMatchObject({
        status: 502,
        message: "Azure file indexing failed: Unsupported file",
      })
      expect(deleted).toHaveBeenCalledTimes(1)
    })
  })

  it("maps retrieved text and file IDs to Budibase context chunks", async () => {
    getPool(endpoint)
      .intercept({
        path: "/openai/v1/vector_stores/vs_1/search",
        method: "POST",
        body: JSON.stringify({ query: "Access code?", max_num_results: 10 }),
      })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, {
        data: [
          {
            file_id: "file_1",
            content: [
              { type: "text", text: "LANTERN-5831" },
              { type: "text", text: "Workplace Services" },
            ],
          },
        ],
      })
    await withEnv(azureEnv, async () => {
      await expect(
        searchAzureFileStore({ vectorStoreId: "vs_1", query: "Access code?" })
      ).resolves.toEqual([
        { source: "file_1", chunkText: "LANTERN-5831\nWorkplace Services" },
      ])
    })
  })

  it("removes both the store association and uploaded file", async () => {
    const pool = getPool(endpoint)
    const deleted = jest.fn(() => ({ deleted: true }))
    pool
      .intercept({
        path: "/openai/v1/vector_stores/vs_1/files/file_1",
        method: "DELETE",
      })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, deleted)
    pool
      .intercept({ path: "/openai/v1/files/file_1", method: "DELETE" })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, deleted)
    await withEnv(azureEnv, async () => {
      await deleteAzureFileFromStore({
        vectorStoreId: "vs_1",
        fileId: "file_1",
      })
      expect(deleted).toHaveBeenCalledTimes(2)
    })
  })

  it("deletes the underlying files before removing a store", async () => {
    const pool = getPool(endpoint)
    pool
      .intercept({ path: "/openai/v1/vector_stores/vs_1/files", method: "GET" })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, { data: [{ id: "file_1" }], has_more: false })
    const deleted = jest.fn(() => ({ deleted: true }))
    pool
      .intercept({ path: "/openai/v1/files/file_1", method: "DELETE" })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, deleted)
    pool
      .intercept({ path: "/openai/v1/vector_stores/vs_1", method: "DELETE" })
      .defaultReplyHeaders({ "content-type": "application/json" })
      .reply(200, deleted)
    await withEnv(azureEnv, async () => {
      await deleteAzureVectorStore({ vectorStoreId: "vs_1" })
      expect(deleted).toHaveBeenCalledTimes(2)
    })
  })
})
