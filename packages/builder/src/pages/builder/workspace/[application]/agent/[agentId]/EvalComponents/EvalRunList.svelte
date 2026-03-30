<script lang="ts">
  import { Body, Heading } from "@budibase/bbui"
  import type { AgentEvalRun } from "@budibase/types"
  import { formatRunTime } from "./utils"

  type Props = {
    runs: AgentEvalRun[]
    selectedRunId: string | null
    onSelectRun: (_runId: string) => void
  }

  let { runs, selectedRunId, onSelectRun }: Props = $props()
</script>

<div class="run-list">
  <div class="section-header">
    <Heading size="XS">Suite runs</Heading>
  </div>

  {#if runs.length > 0}
    <div class="run-items">
      {#each runs as run (run.runId)}
        <button
          class:selected={run.runId === selectedRunId}
          class="run-item"
          type="button"
          onclick={() => onSelectRun(run.runId)}
        >
          <div class="run-item-main">
            <span class="run-item-score">{run.passed}/{run.total} passed</span>
            <span class="run-item-subtitle">{run.failed} failed</span>
          </div>
          <span class="run-item-time">{formatRunTime(run.completedAt)}</span>
        </button>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Run the suite to inspect historical results.
      </Body>
    </div>
  {/if}
</div>

<style>
  .run-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .section-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .run-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .run-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
    width: 100%;
    padding: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    background: var(--background);
    cursor: pointer;
    text-align: left;
    transition:
      border-color 130ms ease,
      background 130ms ease;
  }

  .run-item:hover {
    border-color: var(--spectrum-global-color-gray-400);
  }

  .run-item.selected {
    border-color: var(--bb-blue);
    background: var(--background-alt);
  }

  .run-item-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .run-item-score {
    font-size: 13px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }

  .run-item-subtitle,
  .run-item-time {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }

  .empty-state {
    padding: var(--spacing-xs) 0;
  }
</style>
