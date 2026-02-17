import { objectStore } from "@budibase/backend-core"
import { ai, LLMPromptResponse } from "@budibase/pro"
import {
  DocumentSourceType,
  ExtractFileDataStepInputs,
  ExtractFileDataStepOutputs,
} from "@budibase/types"
import fetch from "node-fetch"
import { Readable } from "stream"
import * as automationUtils from "../../automationUtils"

const EXTRACT_RETRY_ATTEMPTS = 5
const EXTRACT_RETRY_DELAY_MS = 100

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function processUrlFile(
  fileUrl: string,
  fileType: string | undefined,
  llm: ai.LLM
): Promise<string> {
  const response = await fetch(fileUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${response.statusText}`)
  }
  const stream = response.body as Readable
  const contentType = response.headers.get("content-type") || fileType
  const filename = `document.${fileType}`
  return await llm.uploadFile(stream, filename, contentType)
}

async function processAttachmentFile(
  attachment: any,
  llm: ai.LLM
): Promise<string> {
  const bucket = objectStore.ObjectStoreBuckets.APPS
  const { stream } = await objectStore.getReadStream(bucket, attachment.key!)
  const filename = attachment.name || "document"
  return await llm.uploadFile(stream, filename, attachment.extension)
}

async function parseAIResponse(
  llmResponse: LLMPromptResponse
): Promise<Record<string, any>> {
  try {
    const data = JSON.parse(llmResponse.message)
    return data.data
  } catch (err: any) {
    console.error("Error parsing JSON response:", err)
    throw new Error("Could not parse AI response as valid JSON.")
  }
}

export async function run({
  inputs,
}: {
  inputs: ExtractFileDataStepInputs
}): Promise<ExtractFileDataStepOutputs> {
  if (!inputs.file || !inputs.schema) {
    return {
      success: false,
      data: {},
      response:
        "Extract Document Data AI Step Failed: File and Schema are required.",
    }
  }

  try {
    const llm = await ai.getLLMOrThrow()

    let fileIdOrDataUrl: string

    if (
      inputs.source === DocumentSourceType.URL &&
      typeof inputs.file === "string"
    ) {
      fileIdOrDataUrl = await processUrlFile(inputs.file, inputs.fileType, llm)
    } else if (
      inputs.source === DocumentSourceType.ATTACHMENT &&
      typeof inputs.file !== "string"
    ) {
      fileIdOrDataUrl = await processAttachmentFile(inputs.file, llm)
    } else {
      throw new Error("Invalid file input – source and file type do not match")
    }

    const request = ai.extractFileData(
      inputs.schema,
      fileIdOrDataUrl,
      llm.supportsFiles
    )
    let data: Record<string, any> | any[] = []
    let lastError: unknown

    for (let attempt = 1; attempt <= EXTRACT_RETRY_ATTEMPTS; attempt++) {
      try {
        const llmResponse = await llm.prompt(request)
        data = await parseAIResponse(llmResponse)

        const isEmptyArray = Array.isArray(data) && data.length === 0
        if (!isEmptyArray || attempt === EXTRACT_RETRY_ATTEMPTS) {
          break
        }

        console.warn(
          `[Extract AI] Empty extraction result on attempt ${attempt}/${EXTRACT_RETRY_ATTEMPTS}, retrying...`
        )
      } catch (err) {
        lastError = err
        if (attempt === EXTRACT_RETRY_ATTEMPTS) {
          console.error(
            `[Extract AI] Final extraction attempt ${attempt}/${EXTRACT_RETRY_ATTEMPTS} failed:`,
            err
          )
          throw err
        }

        console.warn(
          `[Extract AI] Extraction attempt ${attempt}/${EXTRACT_RETRY_ATTEMPTS} failed, retrying...`,
          err
        )
      }

      await sleep(EXTRACT_RETRY_DELAY_MS)
    }

    if (lastError && Array.isArray(data) && data.length === 0) {
      throw lastError
    }

    return {
      data,
      success: true,
    }
  } catch (err: any) {
    console.error("Document extraction error:", err)
    return {
      success: false,
      data: {},
      response: automationUtils.getError(err),
    }
  }
}
