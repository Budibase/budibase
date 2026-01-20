<script lang="ts">
  import { Body } from "@budibase/bbui"
  import type { GetWorkspaceHomeMetricsResponse } from "@budibase/types"

  export let metrics: GetWorkspaceHomeMetricsResponse | null = null
  export let metricsError = false
</script>

<div class="metrics">
  <div class="metric-card">
    <Body size="XL" weight="600">{metrics ? metrics.totalUsers : "-"}</Body>
    <Body size="XS" color="var(--spectrum-global-color-gray-600)">
      Total users
    </Body>
  </div>

  <div class="metric-card">
    <Body size="XL" weight="600">
      {metrics ? metrics.automationRunsThisMonth : "-"}
    </Body>
    <Body size="XS" color="var(--spectrum-global-color-gray-600)">
      Automation runs this month
    </Body>
  </div>

  <div class="metric-card">
    <Body size="XL" weight="600">
      {metrics ? metrics.agentActionsThisMonth : "-"}
    </Body>
    <Body size="XS" color="var(--spectrum-global-color-gray-600)">
      Agent actions this month
    </Body>
  </div>

  <div class="metric-card">
    <Body size="XL" weight="600">0</Body>
    <Body size="XS" color="var(--spectrum-global-color-gray-600)">
      Chat conversations this month
    </Body>
  </div>
</div>

{#if metricsError}
  <div class="metrics-error">
    <Body size="S" color="var(--spectrum-global-color-static-red-600)">
      Failed to load workspace metrics.
    </Body>
  </div>
{/if}

<style>
  .metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--spacing-m);
  }

  .metric-card {
    background: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .metrics-error {
    padding: var(--spacing-s) var(--spacing-m);
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-100);
  }

  @media (max-width: 900px) {
    .metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
