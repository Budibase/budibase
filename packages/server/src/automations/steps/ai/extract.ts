import { objectStore } from "@budibase/backend-core"
import {
  DocumentSourceType,
  ExtractFileDataFileTypes,
  ExtractFileDataStepInputs,
  ExtractFileDataStepOutputs,
  LLMResponse,
} from "@budibase/types"
import { generateText, Output, type ModelMessage, type UserContent } from "ai"
import fetch from "node-fetch"
import { Readable } from "stream"
import { buffer } from "stream/consumers"
import * as automationUtils from "../../automationUtils"
import sdk from "../../../sdk"
import z from "zod"

function isImageType(type: ExtractFileDataFileTypes): boolean {
  const isImageTypeByFileType: Record<ExtractFileDataFileTypes, boolean> = {
    [ExtractFileDataFileTypes.pdf]: false,
    [ExtractFileDataFileTypes.jpg]: true,
    [ExtractFileDataFileTypes.png]: true,
    [ExtractFileDataFileTypes.jpeg]: true,
  }

  return isImageTypeByFileType[type]
}

function getMimeType(type: ExtractFileDataFileTypes): string {
  const mimeTypeByFileType: Record<ExtractFileDataFileTypes, string> = {
    [ExtractFileDataFileTypes.pdf]: "application/pdf",
    [ExtractFileDataFileTypes.jpg]: "image/jpeg",
    [ExtractFileDataFileTypes.png]: "image/png",
    [ExtractFileDataFileTypes.jpeg]: "image/jpeg",
  }
  return mimeTypeByFileType[type]
}

function toImageDataUrl(data: Buffer, value: ExtractFileDataFileTypes): string {
  const mimeType = getMimeType(value)
  if (!mimeType) {
    throw new Error("Unsupported image MIME type")
  }
  return `data:${mimeType};base64,${data.toString("base64")}`
}

function buildExtractPrompt() {
  return [
    "You are a data extraction assistant.",
    "Extract structured data from the attached document or image.",
    "Follow the provided schema exactly. Values like 'string', 'number', and 'boolean' indicate the expected type.",
    "Return ONLY valid JSON with this shape: {\"data\": [<object>]}.",
    "The data array must contain at most 1 object.",
    "Do not include markdown, explanations, or extra keys.",
    "If no matching data is found, return {\"data\": []}.",
  ].join("\n\n")
}

function buildExtractModelMessages(fileIdOrDataUrl: string): ModelMessage[] {
  const prompt = buildExtractPrompt()
  const userContent: UserContent = fileIdOrDataUrl.startsWith("data:")
    ? [
        {
          type: "image",
          image: new URL(fileIdOrDataUrl),
        },
        {
          type: "text",
          text: prompt,
        },
      ]
    : [
        {
          type: "file",
          data: fileIdOrDataUrl,
          mediaType: "application/pdf",
        },
        {
          type: "text",
          text: prompt,
        },
      ]

  return [
    {
      role: "user",
      content: userContent,
    },
  ]
}

async function processUrlFile(
  fileUrl: string,
  fileType: ExtractFileDataFileTypes,
  llm: LLMResponse
): Promise<string> {
  const response = await fetch(fileUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${response.statusText}`)
  }

  if (isImageType(fileType)) {
    const data = await response.buffer()
    return toImageDataUrl(data, fileType)
  }

  if (!llm.uploadFile) {
    throw new Error("File uploads are not supported by the configured LLM")
  }
  const stream = response.body as Readable
  const filename = `document.${fileType || "pdf"}`
  return await llm.uploadFile(stream, filename, fileType)
}

async function processAttachmentFile(
  attachment: any,
  llm: LLMResponse
): Promise<string> {
  const bucket = objectStore.ObjectStoreBuckets.APPS
  const { stream } = await objectStore.getReadStream(bucket, attachment.key!)
  const contentType = attachment.extension

  if (isImageType(contentType)) {
    const data = await buffer(stream)
    return toImageDataUrl(data, contentType)
  }

  if (!llm.uploadFile) {
    throw new Error("File uploads are not supported by the configured LLM")
  }
  const filename = attachment.name || "document"
  return await llm.uploadFile(stream, filename, contentType)
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
    const llm = await sdk.ai.llm.getDefaultLLMOrThrow()

    let fileIdOrDataUrl: string

    function tryParse(value: any) {
      if (typeof value !== "string") {
        return value
      }
      try {
        const parsed = JSON.parse(value)
        return parsed
      } catch {
        return value
      }
    }

    const file =
      inputs.source === DocumentSourceType.URL
        ? inputs.file
        : tryParse(inputs.file)

    if (inputs.source === DocumentSourceType.URL && typeof file === "string") {
      fileIdOrDataUrl = await processUrlFile(file, inputs.fileType, llm)
    } else if (
      inputs.source === DocumentSourceType.ATTACHMENT &&
      typeof file !== "string"
    ) {
      fileIdOrDataUrl = await processAttachmentFile(file, llm)
    } else {
      throw new Error("Invalid file input – source and file type do not match")
    }

    const output = getOutputFromSchema(inputs.schema)
    const modelMessages = buildExtractModelMessages(fileIdOrDataUrl)
    const response = await generateText({
      model: llm.chat,
      messages: modelMessages,
      providerOptions: llm.providerOptions?.(false),
      ...(output ? { output } : {}),
    })
    const data = response.output.data

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

function createZodSchemaFromRecord(schema: Record<string, any>) {
  const zodFields: Record<string, z.ZodType<any>> = {}

  for (const [key, type] of Object.entries(schema)) {
    if (typeof type === "string") {
      switch (type.toLowerCase()) {
        case "string":
          zodFields[key] = z.string()
          break
        case "number":
          zodFields[key] = z.number()
          break
        case "boolean":
          zodFields[key] = z.boolean()
          break
        default:
          zodFields[key] = z.string()
      }
    } else {
      zodFields[key] = z.string()
    }
  }

  return z.object(zodFields)
}

function getOutputFromSchema(schema: Record<string, any>) {
  const zodSchema = createZodSchemaFromRecord(schema)

  return Output.object<{ data: Record<string, any> }>({
    schema: z.object({
      data: z.array(zodSchema).max(1),
    }),
  })
}
