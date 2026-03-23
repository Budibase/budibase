import { objectStore } from "@budibase/backend-core"
import {
  DocumentSourceType,
  ExtractFileDataStepInputs,
  ExtractFileDataStepOutputs,
  LLMResponse,
  SupportedFileType,
} from "@budibase/types"
import { generateText, Output, type ModelMessage, type UserContent } from "ai"
import fetch from "node-fetch"
import { PDFParse } from "pdf-parse"
import { Readable } from "stream"
import { buffer } from "stream/consumers"
import * as automationUtils from "../../automationUtils"
import sdk from "../../../sdk"
import z from "zod"

function isImageType(type: SupportedFileType): boolean {
  const isImageTypeByFileType: Record<SupportedFileType, boolean> = {
    [SupportedFileType.PDF]: false,
    [SupportedFileType.JPG]: true,
    [SupportedFileType.PNG]: true,
    [SupportedFileType.JPEG]: true,
  }

  return isImageTypeByFileType[type]
}

function getMimeType(type: SupportedFileType): string {
  const mimeTypeByFileType: Record<SupportedFileType, string> = {
    [SupportedFileType.PDF]: "application/pdf",
    [SupportedFileType.JPG]: "image/jpeg",
    [SupportedFileType.PNG]: "image/png",
    [SupportedFileType.JPEG]: "image/jpeg",
  }
  return mimeTypeByFileType[type]
}

function toImageDataUrl(data: Buffer, value: SupportedFileType): string {
  const mimeType = getMimeType(value)
  if (!mimeType) {
    throw new Error("Unsupported image MIME type")
  }
  return `data:${mimeType};base64,${data.toString("base64")}`
}

async function extractPdfText(data: Buffer): Promise<string> {
  const parser = new PDFParse({ data: data as any })
  const parsed = await parser.getText()
  return (parsed.text || "").trim()
}

const MAX_INLINE_DOC_TEXT_LENGTH = 20000

type ExtractInput =
  | { kind: "image"; value: string }
  | { kind: "file"; value: string }
  | { kind: "text"; value: string }

function buildExtractPrompt() {
  return [
    "You are a data extraction assistant.",
    "Extract structured data from the attached document or image.",
    "Follow the provided schema exactly. Values like 'string', 'number', and 'boolean' indicate the expected type.",
    'Return ONLY valid JSON with this shape: {"data": [<object>]}.',
    "The data array must contain at most 1 object.",
    "Do not include markdown, explanations, or extra keys.",
    'If no matching data is found, return {"data": []}.',
  ].join("\n\n")
}

function buildExtractModelMessages(input: ExtractInput): ModelMessage[] {
  const prompt = buildExtractPrompt()
  const userContent: UserContent =
    input.kind === "image"
      ? [
          {
            type: "image",
            image: new URL(input.value),
          },
          {
            type: "text",
            text: prompt,
          },
        ]
      : input.kind === "file"
        ? [
            {
              type: "file",
              data: input.value,
              mediaType: "application/pdf",
            },
            {
              type: "text",
              text: prompt,
            },
          ]
        : `${prompt}\n\nDocument text:\n${input.value.slice(
            0,
            MAX_INLINE_DOC_TEXT_LENGTH
          )}`

  return [
    {
      role: "user",
      content: userContent,
    },
  ]
}

async function processUrlFile(
  fileUrl: string,
  fileType: SupportedFileType,
  llm: LLMResponse
): Promise<ExtractInput> {
  const response = await fetch(fileUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${response.statusText}`)
  }

  if (isImageType(fileType)) {
    const data = await response.buffer()
    return { kind: "image", value: toImageDataUrl(data, fileType) }
  }

  const filename = `document.${fileType || "pdf"}`
  try {
    const uploaded = await llm.uploadFile(
      response.body as Readable,
      filename,
      fileType
    )
    return {
      kind: "file",
      value: uploaded,
    }
  } catch (error) {
    if (shouldInlineFileAfterUploadFailure(error)) {
      const fallbackResponse = await fetch(fileUrl)
      if (!fallbackResponse.ok) {
        throw new Error(
          `Failed to fetch file from URL: ${fallbackResponse.statusText}`
        )
      }
      const data = await fallbackResponse.buffer()
      const text = await extractPdfText(data)
      return { kind: "text", value: text }
    }
    throw error
  }
}

async function processAttachmentFile(
  attachment: any,
  llm: LLMResponse
): Promise<ExtractInput> {
  const bucket = objectStore.ObjectStoreBuckets.APPS
  const { stream } = await objectStore.getReadStream(bucket, attachment.key!)
  const contentType = attachment.extension

  if (isImageType(contentType)) {
    const data = await buffer(stream)
    return { kind: "image", value: toImageDataUrl(data, contentType) }
  }

  const filename = attachment.name || "document"
  try {
    const uploaded = await llm.uploadFile(stream, filename, contentType)
    return {
      kind: "file",
      value: uploaded,
    }
  } catch (error) {
    if (shouldInlineFileAfterUploadFailure(error)) {
      const fallback = await objectStore.getReadStream(bucket, attachment.key!)
      const data = await buffer(fallback.stream)
      const text = await extractPdfText(data)
      return { kind: "text", value: text }
    }
    throw error
  }
}

function shouldInlineFileAfterUploadFailure(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }
  return (
    /doesn't support .*create_file/i.test(error.message) ||
    error.message === "File id not found"
  )
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
    const llm = await sdk.ai.llm.getDefaultLLMOrThrow({
      reasoningEffort: "low",
    })

    let extractInput: ExtractInput

    function tryParse(value: unknown) {
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
      extractInput = await processUrlFile(file, inputs.fileType, llm)
    } else if (
      inputs.source === DocumentSourceType.ATTACHMENT &&
      typeof file !== "string"
    ) {
      extractInput = await processAttachmentFile(file, llm)
    } else {
      throw new Error("Invalid file input – source and file type do not match")
    }

    const output = getOutputFromSchema(inputs.schema)
    const modelMessages = buildExtractModelMessages(extractInput)
    const providerOptions = llm.providerOptions?.(false)
    const response = await generateText({
      model: llm.chat,
      messages: modelMessages,
      providerOptions,
      output,
    })
    if (!response.output || response.output.data == null) {
      throw new Error("Could not parse AI response as valid JSON.")
    }
    const data = response.output.data

    if (!data.length) {
      throw new Error("Could not extract the requested data.")
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

function createZodSchemaFromRecord(schema: Record<string, any>) {
  const zodFields: Record<string, z.ZodType<any>> = {}

  for (const [key, type] of Object.entries(schema)) {
    if (typeof type === "string") {
      switch (type.toLowerCase()) {
        case "number":
          zodFields[key] = z.number()
          break
        case "boolean":
          zodFields[key] = z.boolean()
          break
        case "string":
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
