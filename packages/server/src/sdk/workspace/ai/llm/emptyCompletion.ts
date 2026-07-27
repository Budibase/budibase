import {
  LanguageModelV3Content,
  LanguageModelV3Middleware,
  LanguageModelV3StreamPart,
  LanguageModelV3StreamResult,
  NoContentGeneratedError,
} from "@ai-sdk/provider"
import { TransformStream } from "node:stream/web"

const errorMessage =
  "The model completed without producing text or a tool call. Please retry the request."

const isGeneratedOutput = (part: LanguageModelV3Content) =>
  (part.type === "text" && !!part.text.trim()) ||
  part.type === "tool-call" ||
  part.type === "tool-result" ||
  part.type === "tool-approval-request" ||
  part.type === "file"

const isStreamOutput = (part: LanguageModelV3StreamPart) =>
  (part.type === "text-delta" && !!part.delta.trim()) ||
  part.type === "tool-call" ||
  part.type === "tool-result" ||
  part.type === "tool-approval-request" ||
  part.type === "file" ||
  part.type === "error"

export const rejectEmptyCompletionMiddleware: LanguageModelV3Middleware = {
  specificationVersion: "v3",
  async wrapGenerate({ doGenerate }) {
    const result = await doGenerate()
    if (!result.content.some(isGeneratedOutput)) {
      throw new NoContentGeneratedError({ message: errorMessage })
    }
    return result
  },
  async wrapStream({ doStream }) {
    const result = await doStream()
    let hasOutput = false
    const transformStream = new TransformStream<
      LanguageModelV3StreamPart,
      LanguageModelV3StreamPart
    >({
      transform(part, controller) {
        hasOutput ||= isStreamOutput(part)
        if (part.type === "finish" && !hasOutput) {
          controller.error(
            new NoContentGeneratedError({ message: errorMessage })
          )
          return
        }
        controller.enqueue(part)
      },
    }) as Parameters<typeof result.stream.pipeThrough>[0]

    return {
      ...result,
      stream: result.stream.pipeThrough(
        transformStream
      ) as LanguageModelV3StreamResult["stream"],
    }
  },
}
