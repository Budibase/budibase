import { ai } from "@budibase/pro"
import * as automationUtils from "../../automationUtils"
import {
  DocumentSourceType,
  ExtractFileDataStepInputs,
  ExtractFileDataStepOutputs,
} from "@budibase/types"
import { objectStore } from "@budibase/backend-core"
import { Readable } from "stream"
import fetch from "node-fetch"

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

    let filename
    let contentType
    let fileIdOrDataUrl
    let request

    if (
      inputs.source === DocumentSourceType.URL &&
      typeof inputs.file === "string"
    ) {
      const fileUrl = inputs.file
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

      fileIdOrDataUrl = await llm.uploadFile(stream, filename, contentType)
    } else if (
      inputs.source === DocumentSourceType.ATTACHMENT &&
      typeof inputs.file !== "string"
    ) {
      const attachment = inputs.file
      const bucket = objectStore.ObjectStoreBuckets.APPS
      const stream = await objectStore.getReadStream(bucket, inputs.file.key!)

      filename = attachment.name || "document"
      fileIdOrDataUrl = await llm.uploadFile(
        stream,
        filename,
        attachment.extension
      )
    } else {
      throw new Error("Invalid file input – source and file type do not match")
    }

    request = ai.extractDocumentData(inputs.schema, fileIdOrDataUrl)
    request.withFormat("json")
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
      data: data.data, // completions api won't return a json array, so we need to return a wrapper object
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
