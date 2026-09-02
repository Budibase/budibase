import * as automationUtils from "../../automationUtils"
import {
  context as backendContext,
  events,
  getErrorMessage,
  roles,
} from "@budibase/backend-core"
import {
  ActionFailureReason,
  AgentStepInputs,
  AgentStepOutputs,
  AutomationStepInputBase,
  ContextUser,
} from "@budibase/types"
import { readUIMessageStream, UIMessage } from "ai"
import tracer from "dd-trace"
import { v4 } from "uuid"
import { isProdWorkspaceID } from "../../../db/utils"
import env from "../../../environment"
import sdk from "../../../sdk"
import {
  type AgentChatRun,
  findIncompleteToolCalls,
  formatIncompleteToolCallError,
} from "../../../sdk/workspace/ai/agents"

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
  const structuredOutputSchema =
    useStructuredOutput && outputSchema && Object.keys(outputSchema).length > 0
      ? outputSchema
      : undefined

  return tracer.llmobs.trace(
    { kind: "agent", name: "automation.agent", sessionId },
    async agentSpan => {
      let agentRun: AgentChatRun | undefined
      try {
        const agent = await sdk.ai.agents.getOrThrow(agentId)

        tracer.llmobs.annotate(agentSpan, {
          inputData: prompt,
          metadata: {
            agentId,
            agentName: agent.name,
            appId,
            isForkedProcess: env.isInThread(),
            forkedProcessName: process.env.FORKED_PROCESS_NAME || "main",
          },
        })

        if (appId && isProdWorkspaceID(appId) && agent.live !== true) {
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

        const userId = `automation:${sessionId}`
        const user: ContextUser = {
          _id: userId,
          globalId: userId,
          userId,
          tenantId: backendContext.getTenantId(),
          email: `${encodeURIComponent(userId)}@automation.budibase.local`,
          roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
        }

        agentRun = await sdk.ai.agents.prepareAgentChatRun({
          agent,
          agentId,
          modelMessages: [{ role: "user", content: prompt }],
          latestQuestion: prompt,
          errorLabel: "automation agent",
          sessionId,
          user,
          outputSchema: structuredOutputSchema,
          promptMode: "automation",
        })

        const pendingToolCalls = new Set<string>()
        const streamResult = await agentRun.stream({ pendingToolCalls })
        const responseErrorPromise = streamResult.response.then(
          () => undefined,
          error => getErrorMessage(error)
        )
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

        const responseError = await responseErrorPromise

        const incompleteTools = assistantMessage
          ? findIncompleteToolCalls([assistantMessage])
          : []
        if (pendingToolCalls.size > 0 || incompleteTools.length > 0) {
          const errorMessage = formatIncompleteToolCallError(incompleteTools)
          return {
            success: false,
            response: errorMessage,
            message: assistantMessage,
            sessionId,
          }
        }

        let responseText: string | undefined
        try {
          responseText = await streamResult.text
        } catch (error) {
          if (!streamingError) {
            streamingError = getErrorMessage(error)
          }
        }
        const runError = streamingError || responseError
        if (runError && !responseText) {
          return {
            success: false,
            response: runError,
            message: assistantMessage,
            sessionId,
          }
        }

        let usage: AgentStepOutputs["usage"]
        let usageError: string | undefined
        try {
          usage = await streamResult.usage
        } catch (error) {
          usageError = getErrorMessage(error)
        }
        if (usageError && !responseText) {
          return {
            success: false,
            response: usageError,
            message: assistantMessage,
            sessionId,
          }
        }

        const output =
          structuredOutputSchema && !agentRun.isSuspended()
            ? ((await streamResult.output) as AgentStepOutputs["output"])
            : undefined

        tracer.llmobs.annotate(agentSpan, {
          outputData: responseText,
          metadata: { stepCount: assistantMessage?.parts?.length ?? 0 },
        })
        events.action.aiAgentExecuted({ agentId })

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
        events.action.aiAgentFailed({
          agentId,
          reason: ActionFailureReason.ERROR,
          errorMessage,
        })
        return {
          success: false,
          response: errorMessage,
          sessionId,
        }
      } finally {
        await agentRun?.sessionLogIndexer.index().catch(indexError => {
          console.error("Failed to index automation agent session log", {
            agentId,
            sessionId,
            error: getErrorMessage(indexError),
          })
        })
      }
    }
  )
}
