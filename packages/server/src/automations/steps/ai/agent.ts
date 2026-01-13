import * as automationUtils from "../../automationUtils"
import {
  AgentStepInputs,
  AgentStepOutputs,
  AutomationStepInputBase,
} from "@budibase/types"
import { ai } from "@budibase/pro"
import { helpers } from "@budibase/shared-core"
import sdk from "../../../sdk"
import {
  ToolLoopAgent,
  stepCountIs,
  readUIMessageStream,
  UIMessage,
  Output,
  jsonSchema,
} from "ai"
import { v4 } from "uuid"
import { isProdWorkspaceID } from "../../../db/utils"
import tracer from "dd-trace"
import env from "../../../environment"

const llmobs = tracer.llmobs

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

  return llmobs.trace(
    { kind: "agent", name: "automation.agent", sessionId },
    async agentSpan => {
      try {
        const agentConfig = await sdk.ai.agents.getOrThrow(agentId)

        llmobs.annotate(agentSpan, {
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
          llmobs.annotate(agentSpan, {
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

        const { modelId, apiKey, baseUrl, modelName } =
          await sdk.aiConfigs.getLiteLLMModelConfigOrThrow(agentConfig.aiconfig)

        llmobs.annotate(agentSpan, {
          metadata: {
            modelId,
            modelName,
            baseUrl,
            envLiteLLMUrl: env.LITELLM_URL,
            toolCount: Object.keys(tools).length,
          },
        })

        const litellm = ai.createLiteLLMOpenAI({
          apiKey,
          baseUrl,
          fetch: sdk.ai.agents.createLiteLLMFetch(sessionId),
        })

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

        const agent = new ToolLoopAgent({
          model: litellm.chat(modelId),
          instructions: systemPrompt || undefined,
          tools,

          stopWhen: stepCountIs(30),
          providerOptions: {
            litellm: ai.getLiteLLMProviderOptions(modelName),
          },
          output: outputOption,
        })

        const streamResult = await agent.stream({ prompt })

        let assistantMessage: UIMessage | undefined
        for await (const uiMessage of readUIMessageStream({
          stream: streamResult.toUIMessageStream({ sendReasoning: true }),
        })) {
          assistantMessage = uiMessage
        }

        const responseText = await streamResult.text
        const usage = await streamResult.usage

        llmobs.annotate(agentSpan, {
          outputData: responseText,
          metadata: { stepCount: assistantMessage?.parts?.length ?? 0 },
        })

        return {
          success: true,
          response: responseText,
          usage,
          message: assistantMessage,
          output: result.output as Record<string, any> | undefined,
        }
      } catch (err: any) {
        const errorMessage = automationUtils.getError(err)

        llmobs.annotate(agentSpan, {
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
