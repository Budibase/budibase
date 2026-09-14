import OpenAI, { toFile } from "openai"
import { HTTPError } from "@budibase/backend-core"
import environment from "../../../../environment"

export const isAzureFileSearchConfigured = () =>
  !!environment.AZURE_OPENAI_ENDPOINT?.trim() &&
  !!environment.AZURE_OPENAI_API_KEY?.trim()

const getClient = () => {
  const endpointValue = environment.AZURE_OPENAI_ENDPOINT?.trim()
  const apiKey = environment.AZURE_OPENAI_API_KEY?.trim()
  if (!endpointValue || !apiKey) {
    throw new HTTPError(
      "Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in the server environment and restart Budibase.",
      400
    )
  }
  if (!URL.canParse(endpointValue)) {
    throw new HTTPError(
      "AZURE_OPENAI_ENDPOINT must be an HTTPS resource root URL.",
      400
    )
  }
  const endpoint = new URL(endpointValue)
  if (
    endpoint.protocol !== "https:" ||
    endpoint.username ||
    endpoint.password ||
    endpoint.search ||
    endpoint.hash ||
    endpoint.pathname !== "/"
  ) {
    throw new HTTPError(
      "AZURE_OPENAI_ENDPOINT must be an HTTPS resource root URL.",
      400
    )
  }
  return new OpenAI({
    apiKey,
    baseURL: `${endpoint.origin}/openai/v1`,
    timeout: 60_000,
    maxRetries: 2,
  })
}

const request = async <T>(action: (client: OpenAI) => Promise<T>) => {
  try {
    return await action(getClient())
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new HTTPError(
        `Azure knowledge search: ${error.message}`,
        error.status || 502
      )
    }
    throw error
  }
}

const ignoreMissing = async (action: () => Promise<unknown>) => {
  try {
    await action()
  } catch (error) {
    if (!(error instanceof OpenAI.APIError && error.status === 404)) {
      throw error
    }
  }
}

export const createAzureFileStore = async ({ name }: { name: string }) =>
  request(async client => {
    const store = await client.vectorStores.create({ name })
    return store.id
  })

export const deleteAzureVectorStore = async ({
  vectorStoreId,
}: {
  vectorStoreId: string
}) =>
  request(async client => {
    const fileIds: string[] = []
    await ignoreMissing(async () => {
      for await (const file of client.vectorStores.files.list(vectorStoreId)) {
        fileIds.push(file.id)
      }
    })
    for (const fileId of fileIds) {
      await ignoreMissing(() => client.files.delete(fileId))
    }
    await ignoreMissing(() => client.vectorStores.delete(vectorStoreId))
  })

export const ingestAzureFile = async ({
  vectorStoreId,
  filename,
  mimetype,
  buffer,
}: {
  vectorStoreId: string
  filename: string
  mimetype?: string
  buffer: Buffer
}) =>
  request(async client => {
    const file = await client.files.create({
      file: await toFile(buffer, filename, { type: mimetype }),
      purpose: "assistants",
    })
    try {
      const indexed = await client.vectorStores.files.createAndPoll(
        vectorStoreId,
        { file_id: file.id },
        { pollIntervalMs: 1000, signal: AbortSignal.timeout(300_000) }
      )
      if (indexed.status !== "completed") {
        throw new HTTPError(
          `Azure file indexing ${indexed.status}: ${indexed.last_error?.message || "File was not indexed"}`,
          502
        )
      }
      return { fileId: file.id }
    } catch (error) {
      await ignoreMissing(() => client.files.delete(file.id)).catch(() => {
        console.log("Failed to clean up Azure file after ingestion failure", {
          fileId: file.id,
          vectorStoreId,
        })
      })
      throw error
    }
  })

export const searchAzureFileStore = async ({
  vectorStoreId,
  query,
}: {
  vectorStoreId: string
  query: string
}) =>
  request(async client => {
    const result = await client.vectorStores.search(vectorStoreId, {
      query,
      max_num_results: 10,
    })
    return result.data.map(row => ({
      source: row.file_id,
      chunkText: row.content.map(part => part.text).join("\n"),
    }))
  })

export const deleteAzureFileFromStore = async ({
  vectorStoreId,
  fileId,
}: {
  vectorStoreId: string
  fileId: string
}) =>
  request(async client => {
    await ignoreMissing(() =>
      client.vectorStores.files.delete(fileId, {
        vector_store_id: vectorStoreId,
      })
    )
    await ignoreMissing(() => client.files.delete(fileId))
  })
