<script lang="ts">
  import {
    Body,
    DetailSummary,
    Helpers,
    Icon,
    MarkdownViewer,
    notifications,
  } from "@budibase/bbui"
  import ChainOfThought, { type ChainStep } from "./ChainOfThought.svelte"
  import ChainOfThoughtModal from "./ChainOfThoughtModal.svelte"
  import type { AgentStepOutputs } from "@budibase/types"
  import type { ContentPart, ToolCallDisplay } from "@budibase/types"
  import { type LanguageModelUsage } from "ai"

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
      } else if (hasErrorOutput(output)) {
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

  function hasErrorOutput(output: unknown): boolean {
    return (
      typeof output === "object" &&
      output !== null &&
      "error" in output &&
      !("success" in output && (output as { success: boolean }).success)
    )
  }

  function openModal() {
    modal?.show()
  }

  const formatNumber = (value: number) =>
    new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value)

  const toSafeNumber = (value: unknown): number | undefined => {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return
    }
    return value
  }

  const sumUsage = (usages: Array<LanguageModelUsage | undefined>) => {
    const values = usages.filter(
      (usage): usage is LanguageModelUsage => !!usage
    )
    if (values.length === 0) {
      return
    }

    const sum = (selector: (usage: LanguageModelUsage) => unknown) =>
      values.reduce((acc, usage) => {
        const num = toSafeNumber(selector(usage))
        return acc + (num ?? 0)
      }, 0)

    return {
      inputTokens: sum(usage => usage.inputTokens),
      inputTokenDetails: {
        noCacheTokens: sum(usage => usage.inputTokenDetails?.noCacheTokens),
        cacheReadTokens: sum(usage => usage.inputTokenDetails?.cacheReadTokens),
        cacheWriteTokens: sum(
          usage => usage.inputTokenDetails?.cacheWriteTokens
        ),
      },
      outputTokens: sum(usage => usage.outputTokens),
      outputTokenDetails: {
        textTokens: sum(usage => usage.outputTokenDetails?.textTokens),
        reasoningTokens: sum(
          usage => usage.outputTokenDetails?.reasoningTokens
        ),
      },
      totalTokens: sum(usage => usage.totalTokens),
      reasoningTokens: sum(usage => usage.reasoningTokens),
      cachedInputTokens: sum(usage => usage.cachedInputTokens),
    } satisfies LanguageModelUsage
  }

  const toDate = (value: unknown): Date | undefined => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value
    }
    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) {
        return date
      }
    }
    return
  }

  const formatTimestamp = (value: unknown): string | undefined => {
    const date = toDate(value)
    if (!date) {
      return
    }
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const formatUsageMeta = (usage?: LanguageModelUsage): string | undefined => {
    if (!usage) {
      return
    }

    const input = toSafeNumber(usage.inputTokens)
    const output = toSafeNumber(usage.outputTokens)
    const total = toSafeNumber(usage.totalTokens)
    const reasoning = toSafeNumber(usage.reasoningTokens)
    const cached = toSafeNumber(usage.cachedInputTokens)

    const parts: string[] = []

    if (typeof input === "number") {
      parts.push(
        `input: ${formatNumber(input)}${
          typeof cached === "number" && cached > 0
            ? ` (${formatNumber(cached)} cached)`
            : ""
        }`
      )
    }

    if (typeof output === "number") {
      parts.push(`output: ${formatNumber(output)}`)
    }

    if (typeof total === "number") {
      parts.push(`total: ${formatNumber(total)}`)
    }

    if (typeof reasoning === "number" && reasoning > 0) {
      parts.push(`reasoning: ${formatNumber(reasoning)}`)
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
    <DetailSummary name="Agent response" initiallyShow padded>
      <div class="response-section">
        <div class="response-header">
          <Body size="S" weight="600">Final response</Body>
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
        on:click={openModal}
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
