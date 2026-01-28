<script lang="ts">
  import {
    Body,
    DetailSummary,
    Helpers,
    Icon,
    MarkdownViewer,
    notifications,
  } from "@budibase/bbui"
  import ChainOfThought from "./ChainOfThought.svelte"
  import ChainOfThoughtModal from "./ChainOfThoughtModal.svelte"
  import type { AgentStepOutputs } from "@budibase/types"
  import { type ChainStepStatus } from "./chainOfThoughtStatus"
  import {
    isReasoningUIPart,
    isToolUIPart,
    getToolName,
    type LanguageModelUsage,
  } from "ai"

  interface Props {
    outputs: AgentStepOutputs
  }

  export interface ChainStep {
    id: string
    name: string
    displayName: string
    status: ChainStepStatus
    reasoning?: string
    input?: unknown
    output?: unknown
    usage?: LanguageModelUsage
  }

  let { outputs }: Props = $props()
  let modal = $state<ChainOfThoughtModal>()

  let message = $derived(outputs.message)
  let response = $derived(outputs.response)
  let usage = $derived(outputs.usage)

  let reasoningParts = $derived(message?.parts.filter(isReasoningUIPart))
  let toolParts = $derived(message?.parts.filter(isToolUIPart))

  let chainSteps = $derived(
    toolParts?.map((part): ChainStep => {
      const toolName = getToolName(part)

      let status: ChainStep["status"]
      if (part.state === "output-error") {
        status = "error"
      } else if (part.state === "output-available") {
        status = "completed"
      } else if (
        part.state === "input-streaming" ||
        part.state === "input-available"
      ) {
        status = "pending"
      } else {
        status = "failed"
      }

      let output: unknown
      if (part.state === "output-available") {
        output = part.output
      } else if (part.state === "output-error") {
        output = part.errorText
      }

      return {
        id: part.toolCallId,
        name: toolName,
        displayName: humanizeToolName(toolName),
        status,
        reasoning: getReasoning(),
        input: part.input,
        output,
        usage,
      }
    })
  )

  function humanizeToolName(toolName: string): string {
    return toolName
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  function getReasoning(): string | undefined {
    if (!reasoningParts || reasoningParts.length === 0) {
      return undefined
    }
    return reasoningParts.map(p => p.text).join("\n\n") || undefined
  }

  function copyToClipboard(text: string) {
    Helpers.copyToClipboard(text)
    notifications.success("Copied to clipboard")
  }
</script>

<ChainOfThoughtModal
  bind:this={modal}
  steps={chainSteps}
  {response}
  {usage}
  title="Agent Execution Details"
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

  {#if chainSteps && chainSteps.length > 0}
    <DetailSummary
      name={`Execution steps (${chainSteps.length})`}
      initiallyShow
      padded
    >
      <button
        slot="actions"
        type="button"
        class="expand-button"
        onclick={modal?.show}
      >
        <Icon name="FullScreen" size="S" />
        <span>Expand view</span>
      </button>
      <div class="steps-section">
        <ChainOfThought steps={chainSteps || []} simple={true} />
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
