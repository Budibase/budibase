import * as automationUtils from "../../automationUtils"
import { getErrorMessage, objectStore } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"
import {
  AutomationAttachment,
  AgentStepInputs,
  AgentStepOutputs,
  AutomationStepInputBase,
} from "@budibase/types"
import { helpers } from "@budibase/shared-core"
import sdk from "../../../sdk"
import {
  findIncompleteToolCalls,
  formatIncompleteToolCallError,
  updatePendingToolCalls,
} from "../../../sdk/workspace/ai/agents"
import { createSessionLogIndexer } from "../../../sdk/workspace/ai/agentLogs"
import { normalizeUIMessagesToModelMessages } from "../../../sdk/workspace/ai/llm"
import {
  ToolLoopAgent,
  stepCountIs,
  readUIMessageStream,
  UIMessage,
  Output,
  jsonSchema,
  wrapLanguageModel,
  extractReasoningMiddleware,
} from "ai"
import { v4 } from "uuid"
import { isProdWorkspaceID } from "../../../db/utils"
import tracer from "dd-trace"
import env from "../../../environment"
import path from "path"
import { buffer } from "stream/consumers"

const getAttachmentMediaType = (filename?: string) => {
  const extension = path.extname(filename || "").toLowerCase()
  const mediaTypeByExtension: Record<string, string> = {
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".csv": "text/csv",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
  }

  return mediaTypeByExtension[extension] || "application/octet-stream"
}

async function buildMessageFromPromptAndFiles(
  prompt: string | undefined,
  files: AutomationAttachment[] | undefined
): Promise<UIMessage | undefined> {
  if ((!prompt || !prompt.trim()) && !files?.length) {
    return undefined
  }

  const parts: UIMessage["parts"] = []

  for (const file of files || []) {
    const processed = await objectStore.processAutomationAttachment(file)
    const content = await buffer(processed.content)
    const mediaType = getAttachmentMediaType(processed.filename)
    parts.push({
      type: "file",
      mediaType,
      filename: processed.filename,
      url: `data:${mediaType};base64,${content.toString("base64")}`,
    })
  }

  if (prompt?.trim()) {
    parts.push({
      type: "text",
      text: prompt.trim(),
    })
  }

  return {
    id: v4(),
    role: "user",
    parts,
  }
}

export async function run({
  inputs,
  appId,
}: {
  inputs: AgentStepInputs
} & AutomationStepInputBase): Promise<AgentStepOutputs> {
  const { agentId, prompt, files, message, useStructuredOutput, outputSchema } =
    inputs
  const composedMessage = message || (await buildMessageFromPromptAndFiles(prompt, files))

  if (!agentId) {
    return {
      success: false,
      response: "Agent step failed: No agent selected",
    }
  }

  if (!prompt && !composedMessage) {
    return {
      success: false,
      response: "Agent step failed: No prompt or message provided",
    }
  }

  const sessionId = v4()
  const operationStartedAt = new Date().toISOString()
  const firstInput = prompt || files?.[0]?.filename || "Message input"

  return tracer.llmobs.trace(
    { kind: "agent", name: "automation.agent", sessionId },
    async agentSpan => {
      const sessionLogIndexer = createSessionLogIndexer({
        agentId,
        sessionId,
        firstInput,
        errorLabel: "automation agent",
        startedAt: operationStartedAt,
      })

      try {
        const agentConfig = await sdk.ai.agents.getOrThrow(agentId)

        tracer.llmobs.annotate(agentSpan, {
          inputData: prompt || JSON.stringify(composedMessage),
          metadata: {
            agentId,
            agentName: agentConfig.name,
            appId,
            isForkedProcess: env.isInThread(),
            forkedProcessName: process.env.FORKED_PROCESS_NAME || "main",
          },
        })

        if (appId && isProdWorkspaceID(appId) && agentConfig.live !== true) {
          tracer.llmobs.annotate(agentSpan, {
            outputData: "Agent is paused",
            tags: { error: "agent_paused" },
          })
          return {
            success: false,
            response:
              "Agent is paused. Set it live to use it in published automations.",
          }
        }

        const { systemPrompt, tools } =
          await sdk.ai.agents.buildPromptAndTools(agentConfig)

        tracer.llmobs.annotate(agentSpan, {
          metadata: {
            toolCount: Object.keys(tools).length,
          },
        })

        const llm = await sdk.ai.llm.createLLM(
          agentConfig.aiconfig,
          sessionId,
          agentSpan,
          agentId
        )
        const { chat, providerOptions } = llm

        let outputOption = undefined
        if (
          useStructuredOutput &&
          outputSchema &&
          Object.keys(outputSchema).length > 0
        ) {
          const normalizedSchema =
            helpers.structuredOutput.normalizeSchemaForStructuredOutput(
              outputSchema
            )
          outputOption = Output.object({ schema: jsonSchema(normalizedSchema) })
        }

        const pendingToolCalls = new Set<string>()
        const hasTools = Object.keys(tools).length > 0
        const agent = new ToolLoopAgent({
          model: wrapLanguageModel({
            model: chat,
            middleware: extractReasoningMiddleware({
              tagName: "think",
            }),
          }),
          instructions: systemPrompt || undefined,
          tools: hasTools ? tools : undefined,
          toolChoice: hasTools ? "auto" : "none",
          stopWhen: stepCountIs(30),
          providerOptions: providerOptions?.(hasTools),
          output: outputOption,
          async onStepFinish({ content, toolCalls, toolResults, response }) {
            sessionLogIndexer.addRequestId(response?.id)
            updatePendingToolCalls(pendingToolCalls, toolCalls, toolResults)
            for (const part of content) {
              if (part.type === "tool-error") {
                pendingToolCalls.delete(part.toolCallId)
              }
            }
            for (const _toolResult of toolResults) {
              await quotas.addAction(async () => {})
            }
          },
        })

        const streamResult = composedMessage
          ? await agent.stream({
              messages: await normalizeUIMessagesToModelMessages(
                [composedMessage],
                llm
              ),
            })
          : await agent.stream({ prompt })

        let assistantMessage: UIMessage | undefined
        let streamingError: string | undefined

        for await (const uiMessage of readUIMessageStream({
          stream: streamResult.toUIMessageStream({
            sendReasoning: true,
            onError: error => {
              const errorMessage = getErrorMessage(error)
              streamingError = errorMessage
              return errorMessage
            },
          }),
        })) {
          assistantMessage = uiMessage
        }

        const incompleteTools = assistantMessage
          ? findIncompleteToolCalls([assistantMessage])
          : []
        const responseMetadata = {
          requestId: (await streamResult.response).id ?? undefined,
        }
        if (pendingToolCalls.size > 0 || incompleteTools.length > 0) {
          sessionLogIndexer.addRequestId(responseMetadata.requestId)
          const errorMessage = formatIncompleteToolCallError(incompleteTools)
          await sessionLogIndexer.index()
          tracer.llmobs.annotate(agentSpan, {
            outputData: errorMessage,
            tags: { error: "1", "error.type": "IncompleteToolCall" },
          })
          return {
            success: false,
            response: errorMessage,
            message: assistantMessage,
            sessionId,
          }
        }

        let responseText: string | undefined
        let textExtractionError: string | undefined
        try {
          responseText = await streamResult.text
        } catch (err) {
          textExtractionError = getErrorMessage(err)
        }

        const error = streamingError || textExtractionError
        if (error && !responseText) {
          sessionLogIndexer.addRequestId(responseMetadata.requestId)
          await sessionLogIndexer.index()
          tracer.llmobs.annotate(agentSpan, {
            outputData: error,
            tags: { error: "1", "error.type": "StreamingError" },
          })
          return {
            success: false,
            response: error,
            message: assistantMessage,
            sessionId,
          }
        }
        const usage = await streamResult.usage
        sessionLogIndexer.addRequestId(responseMetadata.requestId)
        await sessionLogIndexer.index()
        const output = outputOption
          ? ((await streamResult.output) as Record<string, any>)
          : undefined

        tracer.llmobs.annotate(agentSpan, {
          outputData: responseText,
          metadata: { stepCount: assistantMessage?.parts?.length ?? 0 },
        })

        return {
          success: true,
          response: responseText,
          usage,
          message: assistantMessage,
          sessionId,
          output,
        }
      } catch (err: any) {
        const errorMessage = automationUtils.getError(err)
        await sessionLogIndexer.index()

        tracer.llmobs.annotate(agentSpan, {
          outputData: errorMessage,
          tags: {
            error: "1",
            "error.type": err?.name || "UnknownError",
          },
        })

        console.error("Agent step failed", {
          agentId,
          appId,
          liteLLMUrl: env.LITELLM_URL,
          errorName: err?.name,
          errorMessage,
        })

        return {
          success: false,
          response: errorMessage,
          sessionId,
        }
      }
    }
  )
}
