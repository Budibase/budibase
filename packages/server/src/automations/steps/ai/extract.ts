import { ai } from "@budibase/pro"
import * as automationUtils from "../../automationUtils"
import {
  ExtractDocumentDataStepInputs,
  ExtractDocumentDataStepOutputs,
} from "@budibase/types"
import { objectStore } from "@budibase/backend-core"
import { toFile } from "openai"
import {
  getReadStream,
  getObjectMetadata,
} from "@budibase/backend-core/src/objectStore"
import { Readable } from "stream"
import fetch from "node-fetch"

export async function run({
  inputs,
}: {
  inputs: ExtractDocumentDataStepInputs
}): Promise<ExtractDocumentDataStepOutputs> {
  if (!inputs.documentUrl || !inputs.schema) {
    return {
      success: false,
      data: {},
      response:
        "Extract Document Data AI Step Failed: Document URL and Schema are required.",
    }
  }

  try {
    const llm = await ai.getLLMOrThrow()

    let stream: Readable
    let filename: string
    let contentType: string | undefined

    // We might want ti handle the case where the user supplies their own URL
    if (
      inputs.documentUrl.startsWith("http://") ||
      inputs.documentUrl.startsWith("https://")
    ) {
      const response = await fetch(inputs.documentUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch file from URL: ${response.statusText}`)
      }
      stream = response.body as Readable
      contentType = response.headers.get("content-type") || undefined

      filename =
        inputs.documentUrl.split("/").pop()?.split("?")[0] || "document"

      if (!filename.includes(".") && contentType) {
        if (contentType.includes("pdf")) {
          filename += ".pdf"
        } else if (contentType.includes("image/")) {
          const imageType = contentType.split("/")[1]
          filename += `.${imageType}`
        }
      }
      // Now we handle the standard case where the user supplies a signed urel.
    } else {
      const { bucket, path } = objectStore.extractBucketAndPath(
        inputs.documentUrl
      )!
      console.log(path)
      stream = await getReadStream(bucket, path)
      filename = path.split("/").pop() || "document.pdf"
    }

    const fileId = await llm.uploadFile(
      stream,
      filename,
      "assistants",
      "image/png"
    )
    const request = ai.extractDocumentData(inputs.schema, fileId)
    request.withFormat("json")
    console.log(request)
    const llmResponse = await llm.prompt(request)

    let extractedData = {}

    try {
      extractedData = llmResponse.message
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
      data: extractedData,
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
