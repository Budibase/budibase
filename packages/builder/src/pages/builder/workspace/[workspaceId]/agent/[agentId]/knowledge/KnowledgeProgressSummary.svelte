<script lang="ts">
  export interface Props {
    counts: {
      ready: number
      processing: number
      failed: number
      total: number
    }
    onShowFailed: () => void
  }

  let { counts, onShowFailed }: Props = $props()

  const toWidth = (count: number) =>
    `${counts.total ? (count / counts.total) * 100 : 0}%`
</script>

<div class="progress-summary">
  <div class="progress-bar">
    <span class="segment ready" style:width={toWidth(counts.ready)}></span>
    <span class="segment processing" style:width={toWidth(counts.processing)}
    ></span>
    <span class="segment failed" style:width={toWidth(counts.failed)}></span>
  </div>
  <div class="legend">
    <span class="legend-item">
      <i class="dot ready"></i>{counts.ready} ready
    </span>
    <span class="legend-item">
      <i class="dot processing"></i>{counts.processing} processing
    </span>
    {#if counts.failed > 0}
      <button class="legend-item failed-link" onclick={onShowFailed}>
        <i class="dot failed"></i>{counts.failed} failed
      </button>
    {/if}
  </div>
</div>

<style>
  .progress-summary {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .progress-bar {
    display: flex;
    height: 6px;
    border-radius: 999px;
    overflow: hidden;
    background: var(--spectrum-global-color-gray-300);
  }

  .segment.ready,
  .dot.ready {
    background: var(--spectrum-semantic-positive-color-default);
  }

  .segment.processing,
  .dot.processing {
    background: var(--spectrum-semantic-notice-color-default);
  }

  .segment.failed,
  .dot.failed {
    background: var(--spectrum-semantic-negative-color-default);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs) var(--spacing-m);
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .failed-link {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    color: var(--spectrum-semantic-negative-color-default);
    text-decoration: underline;
  }
</style>
