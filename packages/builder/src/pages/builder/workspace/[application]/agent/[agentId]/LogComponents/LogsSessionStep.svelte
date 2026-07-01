<script lang="ts">
  import { Body, Icon } from "@budibase/bbui"
  import type { AgentLogEntry, AgentLogRequestDetail } from "@budibase/types"
  import { formatToolName } from "@budibase/frontend-core"
  import {
    formatMessages,
    formatErrorDetail,
    formatStructuredContent,
    getStepDuration,
    getStepFlow,
    isSlowStep,
    parseAssistantResponse,
  } from "./utils"

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
  let flow = $derived(getStepFlow(detail, loadingStep))
</script>

{#snippet toolCard(
  item: { name: string; displayName?: string; toolCallId?: string },
  content: string,
  kindLabel?: string
)}
  {@const displayName = formatToolName(item.name, item.displayName)}
  <article class="tool-card">
    <div class="tool-card-header">
      <div class="tool-card-meta">
        <span class="tool-card-name">{displayName.primary}</span>
        {#if displayName.secondary}
          <span class="tool-card-subtitle">{displayName.secondary}</span>
        {/if}
        {#if item.toolCallId}
          <span class="tool-card-id" title={item.toolCallId}>
            {item.toolCallId}
          </span>
        {/if}
      </div>
      {#if kindLabel}
        <span class="tool-card-kind">{kindLabel}</span>
      {/if}
    </div>
    <div class="content-surface">
      <pre><code>{formatStructuredContent(content)}</code></pre>
    </div>
  </article>
{/snippet}

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
      <span class="step-token-metric"
        >{entry.inputTokens} → {entry.outputTokens}</span
      >
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
        <div class="step-loading">
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Loading step detail...
          </Body>
        </div>
      {:else if detail}
        {@const assistantResponse = parseAssistantResponse(detail.response)}
        <div class="io-grid">
          <section class="io-panel">
            <div class="panel-header">
              <h4 class="panel-title">Input</h4>
            </div>

            <div class="content-section">
              <div class="content-section-header">
                <div class="section-label-group">
                  <h5 class="content-title">Prompt</h5>
                </div>
              </div>
              <div class="content-surface">
                <pre><code>{formatMessages(detail)}</code></pre>
              </div>
            </div>

            {#if detail.toolResults.length}
              <div class="content-section">
                <div class="content-section-header">
                  <div class="section-icon">
                    <Icon name="Wrench" size="S" />
                  </div>
                  <div class="section-label-group">
                    <h5 class="content-title">Tool context</h5>
                    <p class="content-subtitle">
                      Results available to this step
                    </p>
                  </div>
                </div>

                <div class="tool-stack">
                  {#each detail.toolResults as result}
                    {@render toolCard(result, result.content, "Result")}
                  {/each}
                </div>
              </div>
            {/if}
          </section>

          <section class="io-panel">
            <div class="panel-header">
              <h4 class="panel-title">Output</h4>
            </div>

            {#if assistantResponse.thinking}
              <div class="content-section">
                <div class="content-section-header">
                  <div class="section-icon section-icon--thinking">
                    <Icon name="Brain" size="S" />
                  </div>
                  <div class="section-label-group">
                    <h5 class="content-title">Thinking</h5>
                    <p class="content-subtitle">Internal reasoning trace</p>
                  </div>
                </div>
                <div class="content-surface content-surface--thinking">
                  <pre><code>{assistantResponse.thinking}</code></pre>
                </div>
              </div>
            {/if}

            {#if detail.error}
              <div class="content-section">
                <div class="content-section-header">
                  <div class="section-icon section-icon--error">
                    <Icon name="Alert" size="S" />
                  </div>
                  <div class="section-label-group">
                    <h5 class="content-title">Error</h5>
                    <p class="content-subtitle">
                      Provider and model failure details
                    </p>
                  </div>
                </div>
                <div class="content-surface content-surface--error">
                  <pre><code>{formatErrorDetail(detail.error)}</code></pre>
                </div>
              </div>
            {/if}

            {#if detail.toolCalls.length}
              <div class="content-section">
                <div class="content-section-header">
                  <div class="section-icon">
                    <Icon name="Wrench" size="S" />
                  </div>
                  <div class="section-label-group">
                    <h5 class="content-title">Tool calls</h5>
                  </div>
                </div>

                <div class="tool-stack">
                  {#each detail.toolCalls as toolCall}
                    {@render toolCard(toolCall, toolCall.arguments)}
                  {/each}
                </div>
              </div>
            {/if}

            {#if assistantResponse.response}
              <div class="content-section">
                <div class="content-section-header">
                  <div class="section-label-group">
                    <h5 class="content-title">Final response</h5>
                  </div>
                </div>
                <div class="content-surface">
                  <pre><code>{assistantResponse.response}</code></pre>
                </div>
              </div>
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
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
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
    border-radius: 8px 8px 0 0;
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
  .tool-stack,
  .tool-card,
  .tool-card-meta {
    display: flex;
    flex-direction: column;
  }

  .step-flow,
  .step-flow-main,
  .io-panel,
  .content-section,
  .section-label-group,
  .tool-card-header,
  .tool-card-meta,
  .tool-card-id {
    min-width: 0;
  }

  .step-flow-from,
  .step-flow-to,
  .step-model,
  .tool-card-id {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tool-card-subtitle,
  .tool-card-id,
  .tool-card-kind {
    font-size: 11px;
    color: var(--spectrum-global-color-gray-600);
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

  .step-token-metric {
    color: var(--spectrum-global-color-gray-700);
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

  .step-loading {
    padding: var(--spacing-s) 0;
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
    gap: 10px;
  }

  .section-label-group {
    gap: 2px;
  }

  .section-icon {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-700);
    border: 1px solid var(--spectrum-global-color-gray-200);
  }

  .section-icon--thinking {
    background: rgba(140, 161, 113, 0.14);
    border-color: rgba(140, 161, 113, 0.22);
    color: #6f8157;
  }

  .section-icon--error {
    background: rgba(214, 60, 60, 0.12);
    border-color: rgba(214, 60, 60, 0.2);
    color: var(--spectrum-global-color-red-700);
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

  .tool-stack,
  .tool-card {
    gap: 8px;
  }

  .tool-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .tool-card-meta {
    align-items: flex-start;
    gap: 8px;
  }

  .tool-card-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-800);
  }

  .tool-card-id {
    max-width: 240px;
  }

  .tool-card-kind {
    border: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--spectrum-global-color-gray-100);
    border-radius: 999px;
    padding: 2px 8px;
    flex-shrink: 0;
  }

  .content-surface {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    overflow: auto;
    max-height: 220px;
    background: var(--background);
    scrollbar-width: thin;
  }

  .content-surface::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .content-surface::-webkit-scrollbar-track {
    background: transparent;
  }

  .content-surface::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .content-surface--thinking {
    background: rgba(140, 161, 113, 0.08);
    border-color: rgba(140, 161, 113, 0.2);
  }

  .content-surface--error {
    background: rgba(214, 60, 60, 0.04);
    border-color: rgba(214, 60, 60, 0.2);
  }

  .content-surface pre {
    margin: 0;
    padding: 10px;
    font-size: 12px;
    line-height: 1.55;
    color: var(--spectrum-global-color-gray-800);
    font-family: var(--font-mono, "SF Mono", "Fira Code", monospace);
    white-space: pre-wrap;
    word-break: break-word;
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

    .tool-card-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .tool-card-meta {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .tool-card-id {
      max-width: 100%;
    }

    .io-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
