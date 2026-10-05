<script lang="ts" module>
  export interface SummaryMetric {
    label: string
    value: number | null
  }
</script>

<script lang="ts">
  import { Body, ProgressCircle } from "@budibase/bbui"

  let {
    metrics,
    loading = false,
  }: {
    metrics: SummaryMetric[]
    loading?: boolean
  } = $props()
</script>

<div class="metrics-grid" aria-busy={loading}>
  {#each metrics as metric}
    <section class="metric-card">
      <Body size="XL" weight="600">
        {#if loading}
          <span role="status" aria-label={`Loading ${metric.label}`}>
            <ProgressCircle size="S" />
          </span>
        {:else if metric.value === null}
          <span aria-label="Unavailable">-</span>
        {:else}
          {metric.value.toLocaleString()}
        {/if}
      </Body>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        {metric.label}
      </Body>
    </section>
  {/each}
</div>

<style>
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--spacing-m);
  }

  .metric-card {
    background: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    padding: var(--spacing-m) var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-s) - var(--spacing-xs));
  }

  @media (max-width: 1280px) {
    .metrics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
