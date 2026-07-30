<script lang="ts">
  import { Body, Icon } from "@budibase/bbui"
  import type {
    AgentLogEntry,
    AgentLogRequestDetail,
    AgentLogSession,
  } from "@budibase/types"
  import LogsSessionStep from "./LogsSessionStep.svelte"
  import { formatSpend, formatTime, getSessionSummary } from "./utils"

  type Props = {
    selectedSession: AgentLogSession | null
    expandedStepId: string | null
    expandedStepDetail: AgentLogRequestDetail | null
    expandedStepLoading: boolean
    onToggleStep: (_entry: AgentLogEntry) => void | Promise<void>
  }

  let {
    selectedSession,
    expandedStepId,
    expandedStepDetail,
    expandedStepLoading,
    onToggleStep,
  }: Props = $props()

  function formatEnvironment(environment: "development" | "production") {
    return environment === "production" ? "Production" : "Development"
  }
</script>

{#if selectedSession}
  {@const summary = getSessionSummary(selectedSession)}
  <div class="detail-content">
    <div class="detail-header">
      <h3 class="detail-title">Session</h3>
      <div class="detail-header-stats">
        <span class="header-stat">{selectedSession.entries.length} steps</span>
        <span class="header-stat">{summary.latency}</span>
      </div>
    </div>

    <div class="detail-meta">
      <div class="meta-row">
        <span class="meta-label">Input</span>
        <span class="meta-value">{selectedSession.firstInput || "-"}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Status</span>
        <span
          class="meta-value"
          class:meta-value--success={selectedSession.status === "success"}
          class:meta-value--error={selectedSession.status === "error"}
        >
          {selectedSession.status === "success" ? "Success" : "Error"}
        </span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Trigger</span>
        <span class="meta-value">{selectedSession.trigger}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Environment</span>
        <span class="meta-value">
          {formatEnvironment(selectedSession.environment)}
        </span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Tokens (in/out)</span>
        <span class="meta-value">
          {summary.inputTokens} / {summary.outputTokens}
        </span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Spend</span>
        <span class="meta-value">{formatSpend(summary.spend)}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Started</span>
        <span class="meta-value">{formatTime(selectedSession.startTime)}</span>
      </div>
    </div>

    <div class="steps-section">
      <h4 class="steps-title">Execution steps</h4>
      <div class="steps-list">
        {#each selectedSession.entries as entry, index (entry.requestId)}
          <LogsSessionStep
            {entry}
            {index}
            expanded={expandedStepId === entry.requestId}
            detail={expandedStepId === entry.requestId
              ? expandedStepDetail || undefined
              : undefined}
            loadingStep={expandedStepId === entry.requestId &&
              expandedStepLoading}
            {onToggleStep}
          />
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="detail-empty">
    <Icon name="clock" size="L" color="var(--spectrum-global-color-gray-500)" />
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      Select a session to view details
    </Body>
  </div>
{/if}

<style>
  .detail-content {
    padding: var(--spacing-xl) var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .detail-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .detail-header-stats {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    flex-wrap: wrap;
  }

  .header-stat {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    background: var(--spectrum-global-color-gray-100);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 999px;
    padding: 4px 10px;
  }

  .detail-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    gap: var(--spacing-s) var(--spacing-l);
  }

  .meta-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: var(--spacing-s);
    align-items: baseline;
    font-size: 13px;
  }

  .meta-label {
    color: var(--spectrum-global-color-gray-600);
    font-weight: 500;
  }

  .meta-value {
    color: var(--spectrum-global-color-gray-900);
    word-break: break-word;
  }

  .meta-value--success {
    color: #8ca171;
  }

  .meta-value--error {
    color: var(--spectrum-global-color-red-600);
  }

  .steps-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .steps-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    height: 100%;
    padding: var(--spacing-xl);
  }

  @media (max-width: 900px) {
    .detail-meta {
      grid-template-columns: 1fr;
    }

    .meta-row {
      grid-template-columns: 110px 1fr;
    }
  }
</style>
