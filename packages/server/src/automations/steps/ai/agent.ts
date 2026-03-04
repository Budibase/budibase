import * as automationUtils from "../../automationUtils"
import { getErrorMessage } from "@budibase/backend-core"
import {
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
} from "../../../sdk/workspace/ai/agents/utils"
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

export async function run({
  inputs,
  appId,
}: {
  inputs: AgentStepInputs
} & AutomationStepInputBase): Promise<AgentStepOutputs> {
  const { agentId, prompt, useStructuredOutput, outputSchema } = inputs

  if (!agentId) {
    return {
      success: false,
      response: "Agent step failed: No agent selected",
    }
  }

  if (!prompt) {
    return {
      success: false,
      response: "Agent step failed: No prompt provided",
    }
  }

  const sessionId = v4()

  return tracer.llmobs.trace(
    { kind: "agent", name: "automation.agent", sessionId },
    async agentSpan => {
      try {
        const agentConfig = await sdk.ai.agents.getOrThrow(agentId)

        tracer.llmobs.annotate(agentSpan, {
          inputData: prompt,
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

        const { chat, providerOptions } = await sdk.ai.llm.createLLM(
          agentConfig.aiconfig,
          sessionId,
          agentSpan
        )

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
          onStepFinish({ content, toolCalls, toolResults }) {
            updatePendingToolCalls(pendingToolCalls, toolCalls, toolResults)
            for (const part of content) {
              if (part.type === "tool-error") {
                pendingToolCalls.delete(part.toolCallId)
              }
            }
          },
        })

        const streamResult = await agent.stream({ prompt })

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
        if (pendingToolCalls.size > 0 || incompleteTools.length > 0) {
          const errorMessage = formatIncompleteToolCallError(incompleteTools)
          tracer.llmobs.annotate(agentSpan, {
            outputData: errorMessage,
            tags: { error: "1", "error.type": "IncompleteToolCall" },
          })
          return {
            success: false,
            response: errorMessage,
            message: assistantMessage,
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
          tracer.llmobs.annotate(agentSpan, {
            outputData: error,
            tags: { error: "1", "error.type": "StreamingError" },
          })
          return {
            success: false,
            response: error,
            message: assistantMessage,
          }
        }
        const usage = await streamResult.usage
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
          output,
        }
      } catch (err: any) {
        const errorMessage = automationUtils.getError(err)

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
        }
      }
    }
  )
}
