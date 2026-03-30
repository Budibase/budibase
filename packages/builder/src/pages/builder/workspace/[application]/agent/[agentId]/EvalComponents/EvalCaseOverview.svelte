<script lang="ts">
  import { Detail, Divider, StatusLight } from "@budibase/bbui"
  import { Duration } from "@budibase/shared-core"
  import type {
    AgentEvalCase,
    AgentEvalCaseResult,
    AgentEvalRun,
  } from "@budibase/types"
  import { formatRunTime, resultSummary } from "./utils"

  type Props = {
    selectedCase: AgentEvalCase | null
    selectedResult: AgentEvalCaseResult | null
    selectedRun: AgentEvalRun | null
  }

  let { selectedCase, selectedResult, selectedRun }: Props = $props()

  let displayedInput = $derived(
    selectedResult?.caseSnapshot?.input ||
      selectedResult?.input ||
      selectedCase?.input ||
      "—"
  )
  let snapshotModelSummary = $derived(
    selectedRun?.snapshot.aiConfig
      ? [
          selectedRun.snapshot.aiConfig.provider,
          selectedRun.snapshot.aiConfig.model,
        ]
          .filter(Boolean)
          .join(" / ") || selectedRun.snapshot.aiConfig.aiConfigId
      : selectedRun?.snapshot.aiconfig || "—"
  )
  let toolSummary = $derived(
    selectedResult?.toolCalls?.length
      ? selectedResult.toolCalls.join(", ")
      : "No tools executed"
  )

  let responsePreview = $derived(
    selectedResult?.response
      ? selectedResult.response.length > 200
        ? selectedResult.response.slice(0, 200) + "..."
        : selectedResult.response
      : null
  )
</script>

<div class="overview">
  <div class="meta-grid">
    <div class="meta-row">
      <span class="meta-label">Input</span>
      <span class="meta-value">{displayedInput}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Status</span>
      <span class="meta-value">
        {#if selectedResult}
          <StatusLight
            positive={selectedResult.status === "passed"}
            negative={selectedResult.status === "failed" ||
              selectedResult.status === "error"}
          >
            {resultSummary(selectedResult)}
          </StatusLight>
        {:else}
          <span class="meta-muted">No result in this run</span>
        {/if}
      </span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Duration</span>
      <span class="meta-value">
        {#if selectedResult}
          {Duration.fromMilliseconds(selectedResult.durationMs).toSeconds()}
        {:else}
          —
        {/if}
      </span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Last run</span>
      <span class="meta-value"
        >{formatRunTime(selectedResult?.completedAt)}</span
      >
    </div>
    <div class="meta-row">
      <span class="meta-label">Suite run</span>
      <span class="meta-value">{formatRunTime(selectedRun?.completedAt)}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Model</span>
      <span class="meta-value">{snapshotModelSummary}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Tools</span>
      <span class="meta-value">{toolSummary}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Snapshot</span>
      <span class="meta-value">
        {#if selectedRun?.snapshot}
          {selectedRun.snapshot.enabledTools.length} enabled tools &bull;
          {selectedRun.snapshot.knowledgeBases.length} KBs
        {:else}
          —
        {/if}
      </span>
    </div>
  </div>

  {#if responsePreview}
    <Divider size="S" noMargin />

    <div class="response-preview">
      <Detail>Response preview</Detail>
      <pre>{responsePreview}</pre>
    </div>
  {/if}
</div>

<style>
  .overview {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    padding: var(--spacing-m) 0;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(200px, 1fr));
    gap: var(--spacing-s) var(--spacing-l);
  }

  .meta-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: var(--spacing-s);
    align-items: baseline;
    font-size: 13px;
  }

  .meta-value :global(.spectrum-StatusLight) {
    justify-content: flex-start;
  }

  .meta-label {
    color: var(--spectrum-global-color-gray-600);
    font-weight: 500;
  }

  .meta-value {
    color: var(--spectrum-global-color-gray-900);
    word-break: break-word;
  }

  .meta-muted {
    color: var(--spectrum-global-color-gray-600);
  }

  .response-preview {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-xs);
  }

  .response-preview pre {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: "ui-monospace", "SFMono-Regular", monospace;
    font-size: 12px;
    line-height: 1.5;
    background: var(--background);
    border-radius: 8px;
    padding: var(--spacing-s);
    margin: 0;
    border: 1px solid var(--spectrum-global-color-gray-200);
    max-height: 120px;
    overflow-y: auto;
  }

  @media (max-width: 900px) {
    .meta-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
