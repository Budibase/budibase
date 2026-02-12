import { generateText, Output, type ModelMessage } from "ai"
import fetch from "node-fetch"
import { Readable } from "stream"
import { z } from "zod"
import { objectStore } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import {
  DocumentSourceType,
  ExtractFileDataStepInputs,
  ExtractFileDataStepOutputs,
  ImageContentTypes,
} from "@budibase/types"
import * as automationUtils from "../../automationUtils"
import sdk from "../../../sdk"

const EXTRACT_PROMPT = [
  "You are a data extraction assistant.",
  "Extract data from the attached document/image that matches the provided schema.",
  "The schema defines the structure where values like 'string', 'number', 'boolean' indicate the expected data types.",
  "Extract all items that match the schema from the document.",
  "Return the data in json format",
  "If no matching data is found, return an empty data array.",
].join("\n\n")

function normalizeExtension(extension?: string) {
  if (!extension) return
  return extension.startsWith(".") ? extension.slice(1) : extension
}

function createZodSchemaFromRecord(
  schema: Record<string, any>
): z.ZodType<any> {
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

function buildResponseSchema(schema: Record<string, any>) {
  const zodSchema = createZodSchemaFromRecord(schema)
  return z.object({
    data: zodSchema,
  })
}

async function readStreamToBuffer(stream: Readable) {
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(new Uint8Array(chunk))
  }
  return Buffer.concat(chunks)
}

function toDataUrl(buffer: Buffer, mediaType: string) {
  return `data:${mediaType};base64,${buffer.toString("base64")}`
}

async function processUrlFile(
  fileUrl: string,
  fileType?: string
): Promise<{
  dataUrl: string
  mediaType: string
  filename: string
  isImage: boolean
}> {
  const response = await fetch(fileUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${response.statusText}`)
  }
  const stream = response.body as Readable
  const buffer = await readStreamToBuffer(stream)
  const contentType =
    response.headers.get("content-type") ||
    ai.normalizeContentType(normalizeExtension(fileType))
  const filename = fileType ? `document.${fileType}` : "document"
  const dataUrl = toDataUrl(buffer, contentType)
  const isImage = ImageContentTypes.includes(contentType.toLowerCase())
  return { dataUrl, mediaType: contentType, filename, isImage }
}

async function processAttachmentFile(attachment: any): Promise<{
  dataUrl: string
  mediaType: string
  filename: string
  isImage: boolean
}> {
  const bucket = objectStore.ObjectStoreBuckets.APPS
  const { stream } = await objectStore.getReadStream(bucket, attachment.key!)
  const buffer = await readStreamToBuffer(stream)
  const extension = normalizeExtension(attachment.extension)
  const mediaType = ai.normalizeContentType(extension)
  const filename = attachment.name || "document"
  const dataUrl = toDataUrl(buffer, mediaType)
  const isImage = ImageContentTypes.includes(mediaType.toLowerCase())
  return { dataUrl, mediaType, filename, isImage }
}

function buildMessages({
  dataUrl,
  mediaType,
  filename,
  isImage,
}: {
  dataUrl: string
  mediaType: string
  filename: string
  isImage: boolean
}): ModelMessage[] {
  const filePart = isImage
    ? { type: "image" as const, image: dataUrl, mediaType }
    : {
        type: "file" as const,
        data: dataUrl,
        mediaType,
        filename,
      }

  return [
    {
      role: "user",
      content: [
        filePart,
        {
          type: "text",
          text: EXTRACT_PROMPT,
        },
      ],
    },
  ]
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
    let fileData: {
      dataUrl: string
      mediaType: string
      filename: string
      isImage: boolean
    }

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
      fileData = await processUrlFile(file, inputs.fileType)
    } else if (
      inputs.source === DocumentSourceType.ATTACHMENT &&
      typeof file !== "string"
    ) {
      fileData = await processAttachmentFile(file)
    } else {
      throw new Error("Invalid file input – source and file type do not match")
    }

    const messages = buildMessages(fileData)
    const responseSchema = buildResponseSchema(inputs.schema)
    const llm = await sdk.ai.llm.getDefaultLLMOrThrow()
    const response = await generateText({
      model: llm.chat,
      messages,
      output: Output.object({ schema: responseSchema }),
      providerOptions: llm.providerOptions?.(false),
    })

    return {
      data: response.output.data,
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
