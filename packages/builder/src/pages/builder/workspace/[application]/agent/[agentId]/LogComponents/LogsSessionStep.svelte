<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import type { AgentLogEntry, AgentLogRequestDetail } from "@budibase/types"
  import {
    formatMessages,
    formatErrorDetail,
    getStepDuration,
    getStepFlow,
    isSlowStep,
    parseAssistantResponse,
  } from "./utils"
  import LogStepContentBlock from "./LogStepContentBlock.svelte"
  import LogStepLoadingPanel from "./LogStepLoadingPanel.svelte"
  import LogStepPill from "./LogStepPill.svelte"
  import LogStepToolCard from "./LogStepToolCard.svelte"

  type Props = {
    entry: AgentLogEntry
    index: number
    expanded: boolean
    detail?: AgentLogRequestDetail
    loadingStep: boolean
    onToggleStep: (_entry: AgentLogEntry) => void | Promise<void>
  }

  let { entry, index, expanded, detail, loadingStep, onToggleStep }: Props =
    $props()
  let flow = $derived(getStepFlow(detail))

  const formatTokenLabel = (count: number): string => {
    const tokenLabel = count === 1 ? "token" : "tokens"
    return `${count.toLocaleString()} ${tokenLabel}`
  }

  const inputTokenTooltip =
    "Includes prompt, instructions, tools, history, and context."
</script>

<div class="step" class:step--expanded={expanded}>
  <button class="step-header" type="button" onclick={() => onToggleStep(entry)}>
    <div class="step-number">{index + 1}</div>
    <div class="step-flow">
      <div class="step-flow-main">
        <span class="step-flow-from">{flow.from}</span>
        <span class="step-flow-arrow">→</span>
        <span class="step-flow-to">{flow.to}</span>
      </div>
      <div class="step-model">{entry.model}</div>
    </div>
    <div class="step-metrics">
      <span class="step-duration" class:step-duration--slow={isSlowStep(entry)}>
        {getStepDuration(entry)}
      </span>
      <Icon
        name={expanded ? "chevron-down" : "chevron-right"}
        size="S"
        color="var(--spectrum-global-color-gray-600)"
      />
    </div>
  </button>

  {#if expanded}
    <div class="step-body">
      {#if loadingStep && !detail}
        <div class="io-grid">
          <LogStepLoadingPanel
            title="Input"
            tokenLabel={formatTokenLabel(entry.inputTokens)}
            tokenTooltip={inputTokenTooltip}
          />
          <LogStepLoadingPanel
            title="Output"
            tokenLabel={formatTokenLabel(entry.outputTokens)}
          />
        </div>
      {:else if detail}
        {@const assistantResponse = parseAssistantResponse(detail.response)}
        {@const promptContent = formatMessages(detail)}
        <div class="io-grid">
          <section class="io-panel">
            <div class="panel-header">
              <h4 class="panel-title">Input</h4>
              <LogStepPill tooltip={inputTokenTooltip}>
                {formatTokenLabel(entry.inputTokens)}
              </LogStepPill>
            </div>

            <LogStepContentBlock
              title="Prompt"
              content={promptContent}
              copyTooltip="Copy prompt"
            />

            {#if detail.toolResults.length}
              <div class="content-section">
                <div class="content-section-header">
                  <div class="content-section-heading">
                    <div class="section-label-group">
                      <h5 class="content-title">Tool context</h5>
                      <p class="content-subtitle">
                        Results available to this step
                      </p>
                    </div>
                  </div>
                </div>

                <div class="tool-stack">
                  {#each detail.toolResults as result}
                    <LogStepToolCard
                      item={result}
                      content={result.content}
                      kindLabel="Result"
                      copyTooltip="Copy tool context"
                    />
                  {/each}
                </div>
              </div>
            {/if}
          </section>

          <section class="io-panel">
            <div class="panel-header">
              <h4 class="panel-title">Output</h4>
              <LogStepPill>{formatTokenLabel(entry.outputTokens)}</LogStepPill>
            </div>

            {#if assistantResponse.thinking}
              <LogStepContentBlock
                title="Thinking"
                subtitle="Internal reasoning trace"
                content={assistantResponse.thinking}
                copyTooltip="Copy thinking"
                icon="Brain"
                variant="thinking"
              />
            {/if}

            {#if detail.error}
              {@const errorContent = formatErrorDetail(detail.error)}
              <LogStepContentBlock
                title="Error"
                subtitle="Provider and model failure details"
                content={errorContent}
                copyTooltip="Copy error"
                icon="Alert"
                variant="error"
              />
            {/if}

            {#if detail.toolCalls.length}
              <div class="content-section">
                <div class="content-section-header">
                  <div class="content-section-heading">
                    <div class="section-label-group">
                      <h5 class="content-title">Tool calls</h5>
                    </div>
                  </div>
                </div>

                <div class="tool-stack">
                  {#each detail.toolCalls as toolCall}
                    <LogStepToolCard
                      item={toolCall}
                      content={toolCall.arguments}
                      copyTooltip="Copy tool call"
                    />
                  {/each}
                </div>
              </div>
            {/if}

            {#if assistantResponse.response}
              <LogStepContentBlock
                title="Final response"
                content={assistantResponse.response}
                copyTooltip="Copy final response"
              />
            {/if}
          </section>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .step {
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .step:last-child {
    border-bottom: none;
  }

  .step--expanded {
    background: var(--spectrum-global-color-gray-100);
  }

  .step-header {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
    padding: 10px 12px;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background 130ms ease-out;
    border-radius: 8px;
  }

  .step-header:hover {
    background: var(--spectrum-global-color-gray-100);
  }

  .step--expanded .step-header {
    background: transparent;
  }

  .step-number {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .step-flow,
  .step-body,
  .section-label-group,
  .content-section,
  .io-panel,
  .tool-stack {
    display: flex;
    flex-direction: column;
  }

  .step-flow,
  .step-flow-main,
  .io-panel,
  .content-section,
  .section-label-group {
    min-width: 0;
  }

  .step-flow-from,
  .step-flow-to,
  .step-model {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .step-flow {
    gap: 2px;
  }

  .step-flow-main {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .step-flow-from,
  .step-flow-to {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-900);
  }

  .step-flow-arrow {
    color: var(--spectrum-global-color-gray-500);
    font-size: 12px;
    flex-shrink: 0;
  }

  .step-model {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }

  .step-metrics {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
    white-space: nowrap;
  }

  .step-duration {
    color: var(--spectrum-global-color-gray-600);
    min-width: 34px;
    text-align: right;
  }

  .step-duration--slow {
    color: var(--spectrum-global-color-orange-600);
  }

  .step-body {
    padding: 12px;
    gap: var(--spacing-s);
  }

  .io-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-s);
  }

  .io-panel {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background);
    padding: 12px;
    gap: 14px;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-bottom: 10px;
  }

  .panel-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--spectrum-global-color-gray-900);
    letter-spacing: 0.01em;
  }

  .content-section {
    gap: 8px;
  }

  .content-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .content-section-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .section-label-group {
    gap: 2px;
  }

  .content-title {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .content-subtitle {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }

  .tool-stack {
    gap: 8px;
  }

  @media (max-width: 900px) {
    .step-header {
      grid-template-columns: 28px minmax(0, 1fr);
      gap: 8px;
    }

    .step-metrics {
      grid-column: 1 / -1;
      justify-content: flex-end;
      padding-left: 36px;
    }

    .io-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
