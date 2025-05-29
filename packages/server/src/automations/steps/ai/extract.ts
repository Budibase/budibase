import { ai } from "@budibase/pro"
import * as automationUtils from "../../automationUtils"
import {
  ExtractFileDataStepInputs,
  ExtractFileDataStepOutputs,
  RowAttachment,
} from "@budibase/types"
import { objectStore } from "@budibase/backend-core"
import { Readable } from "stream"
import fetch from "node-fetch"
import { contentType, lookup } from "mime-types"
import { LLMRequest } from "packages/pro/src/ai"
import { sanitizeBucket } from "@budibase/backend-core/src/objectStore"
import { sanitizeKey } from "@budibase/backend-core/src/objectStore"

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

    let filename: string
    let contentType: string | undefined
    let fileIdOrDataUrl: string
    let request: LLMRequest

    if (inputs.file.startsWith("http") || inputs.file.startsWith("https")) {
      let fileUrl = inputs.file
      const response = await fetch(fileUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch file from URL: ${response.statusText}`)
      }
      const stream = response.body as Readable
      contentType = response.headers.get("content-type") || undefined

      filename = fileUrl.split("/").pop()?.split("?")[0] || "document"

      if (!filename.includes(".") && contentType) {
        if (contentType.includes("pdf")) {
          filename += ".pdf"
        } else if (contentType.includes("image/")) {
          const imageType = contentType.split("/")[1]
          filename += `.${imageType}`
        }
      }
      fileIdOrDataUrl = await llm.uploadFile(
        stream,
        filename,
        "assistants",
        contentType
      )
      request = ai.extractDocumentData(inputs.schema, fileIdOrDataUrl)
    } else if (inputs.file.includes(objectStore.SIGNED_FILE_PREFIX)) {
      // We now know this is a object store url.
      const { bucket, path } = objectStore.extractBucketAndPath(inputs.file!)!

      const stream = await objectStore.getReadStream(bucket, path)
      filename = path.split("/").pop() || "document"

      fileIdOrDataUrl = await llm.uploadFile(
        stream,
        filename,
        "assistants",
        inputs.fileType === "PDF" ? "application/pdf" : "image/jpeg"
      )
      request = ai.extractDocumentData(inputs.schema, fileIdOrDataUrl)
      request.withFormat("json")
    } else {
      throw new Error("Invalid file input")
    }

    const llmResponse = await llm.prompt(request)

    let data
    try {
      data = JSON.parse(llmResponse.message)
    } catch (err: any) {
      console.error("Error parsing JSON response:", err)
      return {
        success: false,
        data: {},
        response:
          "Extract Document Data AI Step Failed: Could not parse AI response as valid JSON.",
      }
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
