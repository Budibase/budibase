import { createAzure } from "@ai-sdk/azure"
import { createOpenAI } from "@ai-sdk/openai"
import { constants, env, HTTPError } from "@budibase/backend-core"
import { AIProvider, LLMProviderConfig, LLMResponse } from "@budibase/types"
import tracer from "dd-trace"
import { ai, licensing } from "@budibase/pro"
import { Readable } from "stream"
import { blob } from "stream/consumers"
import { createBBAIClient } from "./bbai"

function normaliseBaseUrl(baseUrl?: string) {
  if (!baseUrl) {
    return baseUrl
  }

  try {
    const parsed = new URL(baseUrl)
    if (!parsed.pathname || parsed.pathname === "/") {
      parsed.pathname = "/v1"
    }
    return parsed.toString().replace(/\/$/, "")
  } catch {
    const normalised = baseUrl.replace(/\/$/, "")
    if (!normalised || normalised.endsWith("/v1")) {
      return normalised
    }
    return `${normalised}/v1`
  }
}

const getLegacyProviderClient = async (
  provider: AIProvider,
  config: LLMProviderConfig
) => {
  if (!config) {
    throw new Error("No LLM config found")
  }

  switch (provider) {
    case "OpenAI":
    case "TogetherAI":
    case "Custom":
      return createOpenAI({
        baseURL: normaliseBaseUrl(config.baseUrl),
        apiKey: config.apiKey,
      })
    case "BudibaseAI": {
      const licenseKey = await licensing.keys.getLicenseKey()
      if (!licenseKey) {
        throw new HTTPError("No license key found", 422)
      }
      return createOpenAI({
        baseURL: `${env.BUDICLOUD_URL}/api/ai`,
        apiKey: licenseKey,
      })
    }

    case "Anthropic":
      return createOpenAI({
        baseURL:
          normaliseBaseUrl(config.baseUrl) || "https://api.anthropic.com/v1",
        apiKey: config.apiKey,
      })
    case "AzureOpenAI":
      return createAzure({
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
        apiVersion: "2024-10-01-preview",
        useDeploymentBasedUrls: true,
      })
    default:
      throw new Error(`Unsupported legacy provider: ${provider}`)
  }
}

const supportsLegacyFileUploads = (provider: AIProvider) => {
  return (
    provider === "OpenAI" || provider === "TogetherAI" || provider === "Custom"
  )
}

async function uploadLegacyFile({
  stream,
  filename,
  config,
}: {
  stream: Readable
  filename: string
  config: LLMProviderConfig
}): Promise<string> {
  if (!config.apiKey) {
    throw new Error("Legacy AI config is missing API key for file upload")
  }

  const baseUrl =
    normaliseBaseUrl(config.baseUrl) ||
    (config.provider === "OpenAI" ? "https://api.openai.com/v1" : undefined)
  if (!baseUrl) {
    throw new Error("Legacy AI config is missing base URL for file upload")
  }

  const fileBlob = (await blob(stream)) as Blob
  const formdata = new FormData()
  formdata.append("purpose", "assistants")
  formdata.append("file", fileBlob, filename)

  const response = await fetch(`${baseUrl}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: formdata,
  })

  const json = await response.json()
  if (typeof json.id !== "string") {
    throw new Error("File id not found")
  }
  return json.id
}

export const createLegacyLLM = async (
  span?: tracer.Span
): Promise<LLMResponse | undefined> => {
  const config = await ai.getLLMConfig()
  if (!config) {
    return undefined
  }

  if (span) {
    tracer.llmobs.annotate(span, {
      metadata: {
        provider: config.provider,
        modelName: config.model,
        baseUrl: config.baseUrl,
      },
    })
  }

  const model =
    config.provider === "BudibaseAI"
      ? `budibase/legacy/${config.model}`
      : config.model

  if (config.provider === "BudibaseAI" && !env.SELF_HOSTED) {
    return createBBAIClient(model)
  }

  const llm = await getLegacyProviderClient(config.provider, config)
  const uploadFile = supportsLegacyFileUploads(config.provider)
    ? (stream: Readable, filename: string) =>
        uploadLegacyFile({ stream, filename, config })
    : config.provider === "BudibaseAI"
      ? (stream: Readable, filename: string) =>
          uploadFileToBBSelfHost({ stream, filename })
      : undefined

  return {
    chat: llm.chat(model),
    embedding: llm.embedding(model),
    uploadFile,
  }
}

async function uploadFileToBBSelfHost({
  stream,
  filename,
}: {
  stream: Readable
  filename: string
}): Promise<string> {
  const licenseKey = await licensing.keys.getLicenseKey()
  if (!licenseKey) {
    throw new HTTPError("No license key found", 422)
  }

  if (!env.BUDICLOUD_URL) {
    throw new Error("No Budibase URL found")
  }

  const fileBlob = (await blob(stream)) as Blob
  const data = Buffer.from(await fileBlob.arrayBuffer()).toString("base64")
  const requestUrl = `${env.BUDICLOUD_URL}/api/ai/upload-file`

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [constants.Header.LICENSE_KEY]: licenseKey,
    },
    body: JSON.stringify({
      data,
      filename,
    }),
  })
  if (!response.ok) {
    throw await HTTPError.fromResponse(response)
  }

  const json = await response.json()
  if (typeof json.file !== "string") {
    throw new Error("File id not found")
  }
  return json.file
}
