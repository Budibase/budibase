import { HTTPError } from "@budibase/backend-core"
import fetch from "node-fetch"
import environment from "../../../../environment"
import { getKeySettings } from "../configs/litellm"

interface CreateVectorStoreResponse {
  id?: string
}

interface GeminiIngestResponse {
  file_id: string
}

interface GeminiSearchContent {
  text: string
  type: "text"
}

interface GeminiSearchResultItem {
  file_id?: string | null
  filename?: string
  score: number | null
  content: GeminiSearchContent[]
}

interface GeminiSearchResponse {
  data?: GeminiSearchResultItem[]
}

const getGeminiApiKey = () => {
  const key = environment.GEMINI_API_KEY
  if (!key) {
    throw new HTTPError(
      "Gemini File Search failed. Set GEMINI_API_KEY on your local environment",
      400
    )
  }
  return key
}

const handleNotOkResponse = async ({
  response,
  fallbackMessage,
  allowedStatuses = [],
}: {
  response: { ok: boolean; status: number; text: () => Promise<string> }
  fallbackMessage: string
  allowedStatuses?: number[]
}): Promise<void> => {
  if (response.ok || allowedStatuses.includes(response.status)) {
    return
  }

  const text = await response.text()
  throw new HTTPError(text || fallbackMessage, response.status)
}

const getCommonAuthHeaders = async () => {
  const { secretKey } = await getKeySettings()
  const authKey = environment.LITELLM_MASTER_KEY || secretKey
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authKey}`,
  }
}

export async function createGeminiFileStore(name: string): Promise<string> {
  const geminiApiKey = getGeminiApiKey()
  const response = await fetch(`${environment.LITELLM_URL}/v1/vector_stores`, {
    method: "POST",
    headers: await getCommonAuthHeaders(),
    body: JSON.stringify({
      name,
      custom_llm_provider: "gemini",
      ...(geminiApiKey ? { api_key: geminiApiKey } : {}),
    }),
  })

  await handleNotOkResponse({
    response,
    fallbackMessage: "Failed to create Gemini file store",
  })

  const payload = (await response.json()) as CreateVectorStoreResponse
  if (!payload.id) {
    throw new HTTPError("Gemini file store creation did not return an id", 500)
  }

  return payload.id
}

export async function deleteGeminiVectorStore(
  vectorStoreId: string
): Promise<void> {
  const geminiApiKey = getGeminiApiKey()
  const response = await fetch(
    `${environment.LITELLM_URL}/v1/vector_stores/${encodeURIComponent(vectorStoreId)}`,
    {
      method: "DELETE",
      headers: await getCommonAuthHeaders(),
      body: JSON.stringify({
        custom_llm_provider: "gemini",
        ...(geminiApiKey ? { api_key: geminiApiKey } : {}),
      }),
    }
  )

  await handleNotOkResponse({
    response,
    fallbackMessage: "Failed to delete Gemini vector store",
    allowedStatuses: [404],
  })
}

export async function ingestGeminiFile({
  vectorStoreId,
  filename,
  mimetype,
  buffer,
}: {
  vectorStoreId: string
  filename: string
  mimetype?: string
  buffer: Buffer
}): Promise<{ fileId: string }> {
  const geminiApiKey = getGeminiApiKey()
  const response = await fetch(`${environment.LITELLM_URL}/v1/rag/ingest`, {
    method: "POST",
    headers: await getCommonAuthHeaders(),
    body: JSON.stringify({
      file: {
        filename,
        content: buffer.toString("base64"),
        content_type: mimetype || "application/octet-stream",
      },
      ingest_options: {
        name: filename,
        vector_store: {
          custom_llm_provider: "gemini",
          vector_store_id: vectorStoreId,
          ...(geminiApiKey ? { api_key: geminiApiKey } : {}),
        },
      },
    }),
  })

  await handleNotOkResponse({
    response,
    fallbackMessage: "Failed to ingest file into Gemini store",
  })

  const payload = (await response.json()) as GeminiIngestResponse
  if (!payload.file_id) {
    throw new HTTPError("Gemini ingest did not return file_id", 500)
  }
  return {
    fileId: payload.file_id,
  }
}

export async function searchGeminiFileStore({
  vectorStoreId,
  query,
  fileIds,
}: {
  vectorStoreId: string
  query: string
  fileIds?: string[]
}): Promise<GeminiSearchResultItem[]> {
  const geminiApiKey = getGeminiApiKey()
  const response = await fetch(
    `${environment.LITELLM_URL}/v1/vector_stores/${encodeURIComponent(
      vectorStoreId
    )}/search`,
    {
      method: "POST",
      headers: await getCommonAuthHeaders(),
      body: JSON.stringify({
        query,
        ...(fileIds?.length ? { filters: { file_ids: fileIds } } : {}),
        custom_llm_provider: "gemini",
        ...(geminiApiKey ? { api_key: geminiApiKey } : {}),
      }),
    }
  )

  await handleNotOkResponse({
    response,
    fallbackMessage: "Failed to search Gemini vector store",
  })

  const payload = (await response.json()) as GeminiSearchResponse
  return payload.data || []
}

export async function deleteGeminiFileFromStore({
  vectorStoreId,
  fileId,
}: {
  vectorStoreId: string
  fileId: string
}): Promise<void> {
  const geminiApiKey = getGeminiApiKey()
  const response = await fetch(
    `${environment.LITELLM_URL}/v1/vector_stores/${encodeURIComponent(
      vectorStoreId
    )}/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: await getCommonAuthHeaders(),
      body: JSON.stringify({
        custom_llm_provider: "gemini",
        ...(geminiApiKey ? { api_key: geminiApiKey } : {}),
      }),
    }
  )

  await handleNotOkResponse({
    response,
    fallbackMessage: "Failed to delete file from Gemini vector store",
    allowedStatuses: [404],
  })
}
