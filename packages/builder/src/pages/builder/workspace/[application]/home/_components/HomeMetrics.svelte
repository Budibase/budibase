<script lang="ts">
  import { Body } from "@budibase/bbui"
  import type { GetWorkspaceHomeMetricsResponse } from "@budibase/types"
  import { onMount } from "svelte"

  import { API } from "@/api"

  export let metrics: GetWorkspaceHomeMetricsResponse | null = null
  export let agentsEnabled = false

  let githubStars: number | null = null

  const formatStars = (stars: number) => {
    return new Intl.NumberFormat("en", {
      maximumSignificantDigits: 3,
      useGrouping: false,
    }).format(stars)
  }

  onMount(async () => {
    try {
      const response = await API.workspaceHome.getGitHubStars()
      githubStars = response.stars
    } catch (err) {
      console.error("Failed to load GitHub stars", err)
    }
  })
</script>

<div class="metrics" class:three={!agentsEnabled}>
  <div class="metric-card">
    <Body size="XL" weight="600">{metrics ? metrics.totalUsers : "-"}</Body>
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      Total users
    </Body>
  </div>

  <div class="metric-card">
    <Body size="XL" weight="600">
      {metrics ? metrics.automationRunsThisMonth : "-"}
    </Body>
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      Automation runs this month
    </Body>
  </div>

  {#if agentsEnabled}
    <div class="metric-card">
      <Body size="XL" weight="600">
        {metrics ? metrics.agentActionsThisMonth : "-"}
      </Body>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Agent actions this month
      </Body>
    </div>
  {/if}

  <div class="metric-card">
    <Body size="XL" weight="600">
      {githubStars != null ? formatStars(githubStars) : "25000+"}
    </Body>
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      GitHub stars
    </Body>
  </div>
</div>

<style>
  .metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--spacing-m);
    margin-bottom: 12px;
  }

  .metrics.three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .metric-card {
    background: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    padding: var(--spacing-m) var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-s) - var(--spacing-xs));
  }

  @media (max-width: 900px) {
    .metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .metrics.three {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
