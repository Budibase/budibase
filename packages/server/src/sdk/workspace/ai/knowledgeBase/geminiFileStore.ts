import { HTTPError } from "@budibase/backend-core"
import { helpers } from "@budibase/shared-core"
import fetch from "node-fetch"
import environment from "../../../../environment"
import { getKeySettings } from "../configs/litellm"
import { getLiteLLMSessionId } from "../llm/requestSession"

interface CreateVectorStoreResponse {
  id?: string
}

interface RagIngestResponse {
  id: string
  status: "completed" | "in_progress" | "failed"
  vector_store_id: string
  file_id: string
  error?: string
}

interface RagSearchRetrievedContext {
  text?: string
  title?: string
  uri?: string
  pageNumber?: number | string | null
  page_number?: number | string | null
  fileSearchStore?: string
  file_search_store?: string
  mediaId?: string
  media_id?: string
  customMetadata?: unknown
  custom_metadata?: unknown
}

interface RagSearchContent {
  text?: string
  type?: "text" | string
  retrievedContext?: RagSearchRetrievedContext
  retrieved_context?: RagSearchRetrievedContext
  [key: string]: unknown
}

interface RagSearchResultItem {
  id?: string | null
  file_id?: string | null
  filename?: string
  score?: number | null
  content?: RagSearchContent[] | string | null
  attributes?: Record<string, unknown> | Record<string, unknown>[] | string
  metadata?: Record<string, unknown>
  retrievedContext?: RagSearchRetrievedContext
  retrieved_context?: RagSearchRetrievedContext
  groundingMetadata?: Record<string, unknown>
  grounding_metadata?: Record<string, unknown>
  [key: string]: unknown
}

interface RagSearchResponse {
  data?: RagSearchResultItem[]
}

interface GeminiFileStoreResponse {
  ok: boolean
  status: number
}

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504])
const RETRY_DELAYS_MS = [500, 1500, 3000]

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

const isRetryableResponse = (response: GeminiFileStoreResponse) => {
  return !response.ok && RETRYABLE_STATUS_CODES.has(response.status)
}

const isRetryableFetchError = (error: unknown) => {
  return error instanceof Error && error.name === "FetchError"
}

const requestWithRetries = async <TResponse extends GeminiFileStoreResponse>(
  request: () => Promise<TResponse>
): Promise<TResponse> => {
  let attempt = 0

  while (true) {
    try {
      const response = await request()
      if (!isRetryableResponse(response) || attempt >= RETRY_DELAYS_MS.length) {
        return response
      }

      const delayMs = RETRY_DELAYS_MS[attempt]
      await helpers.wait(delayMs)
    } catch (error) {
      if (!isRetryableFetchError(error) || attempt >= RETRY_DELAYS_MS.length) {
        throw error
      }

      const delayMs = RETRY_DELAYS_MS[attempt]
      await helpers.wait(delayMs)
    }

    attempt++
  }
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
  const response = await requestWithRetries(async () =>
    fetch(
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

  const payload = (await response.json()) as RagIngestResponse
  if (payload.status === "failed" && payload.error) {
    console.error("Gemini ingest failed", { error: payload.error })
    if (payload.error.includes("fileSearchStores")) {
      if (payload.error.includes("403")) {
        throw new HTTPError(
          "Gemini file store is inaccessible (403 Forbidden). Use 'Reset store' to recreate it.",
          403
        )
      }
      if (payload.error.includes("404")) {
        throw new HTTPError(
          "Gemini file store was not found (404). Use 'Reset store' to recreate it.",
          404
        )
      }
    }
    throw new HTTPError(payload.error, 500)
  }
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
}: {
  vectorStoreId: string
  query: string
}): Promise<RagSearchResultItem[]> {
  const geminiApiKey = getGeminiApiKey()
  const sessionId = getLiteLLMSessionId()
  const response = await requestWithRetries(async () =>
    fetch(
      `${environment.LITELLM_URL}/v1/vector_stores/${encodeURIComponent(
        vectorStoreId
      )}/search`,
      {
        method: "POST",
        headers: await getCommonAuthHeaders(),
        body: JSON.stringify({
          query,
          custom_llm_provider: "gemini",
          ...(geminiApiKey ? { api_key: geminiApiKey } : {}),
          ...(sessionId
            ? {
                litellm_session_id: sessionId,
                metadata: { session_id: sessionId },
              }
            : {}),
        }),
      }
    )
  )

  await handleNotOkResponse({
    response,
    fallbackMessage: "Failed to search Gemini vector store",
  })

  const payload = (await response.json()) as RagSearchResponse
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
  const response = await requestWithRetries(async () =>
    fetch(
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
  )

  await handleNotOkResponse({
    response,
    fallbackMessage: "Failed to delete file from Gemini vector store",
    allowedStatuses: [404],
  })
}
