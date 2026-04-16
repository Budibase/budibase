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

const LOG_PREVIEW_MAX_LENGTH = 500

const toPreview = (input?: string | null) => {
  if (!input) {
    return undefined
  }
  const normalized = input.replace(/\s+/g, " ").trim()
  return normalized.length > LOG_PREVIEW_MAX_LENGTH
    ? `${normalized.slice(0, LOG_PREVIEW_MAX_LENGTH)}...`
    : normalized
}

const logGeminiInfo = (
  message: string,
  context: Record<string, unknown> = {}
) => {
  console.log(message, {
    provider: "gemini",
    integration: "litellm",
    ...context,
  })
}

const logGeminiError = (
  message: string,
  context: Record<string, unknown> = {}
) => {
  console.error(message, {
    provider: "gemini",
    integration: "litellm",
    ...context,
  })
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
  operation,
  context = {},
}: {
  response: { ok: boolean; status: number; text: () => Promise<string> }
  fallbackMessage: string
  allowedStatuses?: number[]
  operation: string
  context?: Record<string, unknown>
}): Promise<void> => {
  if (response.ok || allowedStatuses.includes(response.status)) {
    return
  }

  const text = await response.text()
  logGeminiError("Gemini request failed", {
    operation,
    status: response.status,
    responsePreview: toPreview(text),
    ...context,
  })
  throw new HTTPError(text || fallbackMessage, response.status)
}

const parseJsonResponse = async <T>({
  response,
  operation,
  fallbackMessage,
  context = {},
}: {
  response: { text: () => Promise<string> }
  operation: string
  fallbackMessage: string
  context?: Record<string, unknown>
}): Promise<T> => {
  const text = await response.text()
  try {
    return JSON.parse(text) as T
  } catch (error) {
    logGeminiError("Gemini response could not be parsed as JSON", {
      operation,
      responsePreview: toPreview(text),
      ...context,
      error,
    })
    throw new HTTPError(fallbackMessage, 500)
  }
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
  logGeminiInfo("Creating Gemini vector store", {
    name,
  })
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
    operation: "create_vector_store",
    context: { name },
  })

  const payload = await parseJsonResponse<CreateVectorStoreResponse>({
    response,
    operation: "create_vector_store",
    fallbackMessage: "Gemini file store creation returned invalid JSON",
    context: { name },
  })
  if (!payload.id) {
    logGeminiError("Gemini vector store creation returned no id", {
      name,
      payloadPreview: toPreview(JSON.stringify(payload)),
    })
    throw new HTTPError("Gemini file store creation did not return an id", 500)
  }

  logGeminiInfo("Created Gemini vector store", {
    name,
    vectorStoreId: payload.id,
  })
  return payload.id
}

export async function deleteGeminiVectorStore(
  vectorStoreId: string
): Promise<void> {
  const geminiApiKey = getGeminiApiKey()
  logGeminiInfo("Deleting Gemini vector store", {
    vectorStoreId,
  })
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
    operation: "delete_vector_store",
    context: { vectorStoreId },
  })

  logGeminiInfo("Deleted Gemini vector store", {
    vectorStoreId,
    status: response.status,
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
  logGeminiInfo("Starting Gemini ingest", {
    vectorStoreId,
    filename,
    mimetype: mimetype || "application/octet-stream",
    sizeBytes: buffer.byteLength,
  })
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
    operation: "ingest_file",
    context: {
      vectorStoreId,
      filename,
      mimetype: mimetype || "application/octet-stream",
      sizeBytes: buffer.byteLength,
    },
  })

  const payload = await parseJsonResponse<GeminiIngestResponse>({
    response,
    operation: "ingest_file",
    fallbackMessage: "Gemini ingest returned invalid JSON",
    context: {
      vectorStoreId,
      filename,
      mimetype: mimetype || "application/octet-stream",
      sizeBytes: buffer.byteLength,
    },
  })
  if (!payload.file_id) {
    logGeminiError("Gemini ingest returned no file_id", {
      vectorStoreId,
      filename,
      payloadPreview: toPreview(JSON.stringify(payload)),
      payloadKeys: payload ? Object.keys(payload) : [],
    })
    throw new HTTPError("Gemini ingest did not return file_id", 500)
  }
  logGeminiInfo("Completed Gemini ingest", {
    vectorStoreId,
    filename,
    fileId: payload.file_id,
  })
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
}): Promise<GeminiSearchResultItem[]> {
  const geminiApiKey = getGeminiApiKey()
  logGeminiInfo("Starting Gemini search", {
    vectorStoreId,
    queryLength: query.length,
  })
  const response = await fetch(
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
      }),
    }
  )

  await handleNotOkResponse({
    response,
    fallbackMessage: "Failed to search Gemini vector store",
    operation: "search",
    context: {
      vectorStoreId,
      queryLength: query.length,
    },
  })

  const payload = await parseJsonResponse<GeminiSearchResponse>({
    response,
    operation: "search",
    fallbackMessage: "Gemini search returned invalid JSON",
    context: {
      vectorStoreId,
      queryLength: query.length,
    },
  })
  const rows = payload.data || []
  logGeminiInfo("Completed Gemini search", {
    vectorStoreId,
    queryLength: query.length,
    resultCount: rows.length,
  })
  return rows
}

export async function deleteGeminiFileFromStore({
  vectorStoreId,
  fileId,
}: {
  vectorStoreId: string
  fileId: string
}): Promise<void> {
  const geminiApiKey = getGeminiApiKey()
  logGeminiInfo("Deleting Gemini file from vector store", {
    vectorStoreId,
    fileId,
  })
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
    operation: "delete_file",
    context: {
      vectorStoreId,
      fileId,
    },
  })

  logGeminiInfo("Deleted Gemini file from vector store", {
    vectorStoreId,
    fileId,
    status: response.status,
  })
}
