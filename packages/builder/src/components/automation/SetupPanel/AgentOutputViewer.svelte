<script lang="ts">
  import {
    Body,
    DetailSummary,
    Helpers,
    Icon,
    MarkdownViewer,
    notifications,
  } from "@budibase/bbui"
  import { formatNumber } from "@budibase/frontend-core"
  import ChainOfThought, { type ChainStep } from "./ChainOfThought.svelte"
  import ChainOfThoughtModal from "./ChainOfThoughtModal.svelte"
  import type { AgentStepOutputs } from "@budibase/types"
  import type { ContentPart, ToolCallDisplay } from "@budibase/types"
  import { type LanguageModelUsage } from "ai"
  import dayjs from "dayjs"

  type ToolCallDisplayWithReasoning = ToolCallDisplay & {
    reasoningText?: string
    stepIndex: number
  }

  type StepContentPart = ContentPart & {
    stepIndex: number
  }

  type StepToolCallPart = Extract<StepContentPart, { type: "tool-call" }>
  type StepToolResultPart = Extract<StepContentPart, { type: "tool-result" }>
  type StepReasoningPart = Extract<StepContentPart, { type: "reasoning" }>

  export let outputs: AgentStepOutputs

  let modal: ChainOfThoughtModal

  $: response = outputs.response || ""
  $: steps = outputs.steps || []

  $: stepContentParts = steps.flatMap((step, stepIndex) =>
    step.content.map(part => ({
      ...part,
      stepIndex,
    }))
  )
  $: toolCallParts = stepContentParts.filter(
    (part): part is StepToolCallPart => part.type === "tool-call"
  )
  $: toolResultParts = stepContentParts.filter(
    (part): part is StepToolResultPart => part.type === "tool-result"
  )

  $: toolResultsMap = new Map(
    toolResultParts.map(result => [result.toolCallId, result])
  )

  $: toolCallsDisplay = toolCallParts.map(
    (call): ToolCallDisplayWithReasoning => {
      const result = toolResultsMap.get(call.toolCallId)
      const output = result?.output

      let status: ToolCallDisplay["status"]
      if (!result) {
        status = "failed"
      } else if (output?.error) {
        status = "error"
      } else {
        status = "completed"
      }

      const step = steps[call.stepIndex]

      const stepReasoningText =
        typeof step?.reasoningText === "string" ? step.reasoningText : undefined

      const stepReasoningParts = stepContentParts.filter(
        (part): part is StepReasoningPart =>
          part.stepIndex === call.stepIndex && part.type === "reasoning"
      )

      const contentReasoningText = stepReasoningParts
        .map(part => part.text)
        .filter(
          (text): text is string =>
            typeof text === "string" && text.trim().length > 0
        )

      const reasoningSegments: string[] = []
      if (stepReasoningText && stepReasoningText.trim().length > 0) {
        reasoningSegments.push(stepReasoningText)
      }
      if (contentReasoningText.length > 0) {
        reasoningSegments.push(...contentReasoningText)
      }

      const reasoningText =
        reasoningSegments.length > 0
          ? reasoningSegments.join("\n\n")
          : undefined

      return {
        toolCallId: call.toolCallId,
        toolName: call.toolName,
        displayName: humanizeToolName(call.toolName),
        input: call.input,
        output,
        status,
        reasoningText,
        stepIndex: call.stepIndex,
      }
    }
  )

  $: chainSteps = toolCallsDisplay.map(
    (call): ChainStep => ({
      id: call.toolCallId,
      name: call.toolName,
      displayName: call.displayName,
      status: call.status,
      reasoning: call.reasoningText,
      input: call.input,
      output: call.output,
      usage: steps?.[call.stepIndex]?.usage,
    })
  )

  $: aggregatedUsage = sumUsage(steps.map(step => step.usage))
  $: usageMeta = formatUsageMeta(aggregatedUsage)
  $: usageTimestamp = formatTimestamp(
    steps?.[steps.length - 1]?.response?.timestamp
  )
  $: stepsMetaLine = [
    chainSteps.length ? `${chainSteps.length} steps` : undefined,
    usageMeta,
    usageTimestamp,
  ]
    .filter(Boolean)
    .join(" · ")

  function humanizeToolName(toolName: string): string {
    return toolName
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  function copyToClipboard(text: string) {
    Helpers.copyToClipboard(text)
    notifications.success("Copied to clipboard")
  }

  const sumUsage = (
    usages: Array<LanguageModelUsage | undefined>
  ): LanguageModelUsage | undefined => {
    const values = usages.filter(
      (usage): usage is LanguageModelUsage => !!usage
    )
    if (values.length === 0) {
      return
    }

    const sum = (
      selector: (_usage: LanguageModelUsage) => number | undefined
    ) => values.reduce((acc, usage) => acc + (selector(usage) ?? 0), 0)

    return {
      inputTokens: sum(u => u.inputTokens),
      inputTokenDetails: {
        noCacheTokens: sum(u => u.inputTokenDetails?.noCacheTokens),
        cacheReadTokens: sum(u => u.inputTokenDetails?.cacheReadTokens),
        cacheWriteTokens: sum(u => u.inputTokenDetails?.cacheWriteTokens),
      },
      outputTokens: sum(u => u.outputTokens),
      outputTokenDetails: {
        textTokens: sum(u => u.outputTokenDetails?.textTokens),
        reasoningTokens: sum(u => u.outputTokenDetails?.reasoningTokens),
      },
      totalTokens: sum(u => u.totalTokens),
      reasoningTokens: sum(u => u.reasoningTokens),
      cachedInputTokens: sum(u => u.cachedInputTokens),
    }
  }

  const formatTimestamp = (value: Date): string | undefined => {
    const display = Helpers.getDateDisplayValue(dayjs(value))
    return display || undefined
  }

  const formatUsageMeta = (usage?: LanguageModelUsage): string | undefined => {
    if (!usage) {
      return
    }

    const parts: string[] = []

    const inputTokens = usage.inputTokens
    const inputTokenDetails = usage.inputTokenDetails
    const outputTokens = usage.outputTokens
    const outputTokenDetails = usage.outputTokenDetails
    const totalTokens = usage.totalTokens

    if (inputTokens !== undefined) {
      const cacheReadTokens = inputTokenDetails?.cacheReadTokens
      const cachedPart =
        cacheReadTokens && cacheReadTokens > 0
          ? ` (${formatNumber(cacheReadTokens)} cached)`
          : ""
      parts.push(`input: ${formatNumber(inputTokens)}${cachedPart}`)
    }
    if (outputTokens !== undefined) {
      parts.push(`output: ${formatNumber(outputTokens)}`)
    }
    if (totalTokens !== undefined) {
      parts.push(`total: ${formatNumber(totalTokens)}`)
    }
    const reasoningTokens = outputTokenDetails?.reasoningTokens
    if (reasoningTokens !== undefined && reasoningTokens > 0) {
      parts.push(`reasoning: ${formatNumber(reasoningTokens)}`)
    }

    return parts.length > 0 ? parts.join(" → ") : undefined
  }
</script>

<ChainOfThoughtModal
  bind:this={modal}
  steps={chainSteps}
  {response}
  title="Agent Execution Details"
  meta={stepsMetaLine}
/>

<div class="agent-output-viewer">
  {#if response}
    <DetailSummary name="Agent response" padded>
      <div class="response-section">
        <div class="response-header">
          <Body size="S" weight="600">Response</Body>
          <Icon
            name="Copy"
            size="S"
            hoverable
            on:click={() => copyToClipboard(response)}
          />
        </div>
        <div class="response-text">
          <MarkdownViewer value={response} />
        </div>
      </div>
    </DetailSummary>
  {/if}

  {#if chainSteps.length > 0}
    <DetailSummary
      name={`Execution steps (${chainSteps.length})`}
      initiallyShow
      padded
    >
      <button
        slot="actions"
        type="button"
        class="expand-button"
        on:click={modal?.show}
      >
        <Icon name="FullScreen" size="S" />
        <span>Expand view</span>
      </button>
      <div class="steps-section">
        <ChainOfThought steps={chainSteps} simple />
      </div>
    </DetailSummary>
  {/if}
</div>

<style>
  .agent-output-viewer {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .response-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .response-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .response-text {
    background-color: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--border-radius-s);
    padding: var(--spacing-m);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .steps-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .expand-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-s);
    background: var(--spectrum-global-color-gray-200);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-800);
    cursor: pointer;
    transition:
      background 150ms ease,
      border-color 150ms ease;
    font-family: inherit;
  }

  .expand-button:hover {
    background: var(--spectrum-global-color-gray-300);
    border-color: var(--spectrum-global-color-gray-400);
  }
</style>
