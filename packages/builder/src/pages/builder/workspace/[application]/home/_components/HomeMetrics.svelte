<script lang="ts">
  import { Body, Icon } from "@budibase/bbui"
  import type { GetWorkspaceHomeMetricsResponse } from "@budibase/types"
  import { onMount } from "svelte"

  import { API } from "@/api"

  const GITHUB_REPO_URL = "https://github.com/Budibase/budibase"

  export let metrics: GetWorkspaceHomeMetricsResponse | null = null
  export let metricsError = false
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
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      class="metric-label-link"
    >
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        GitHub stars
      </Body>
      <Icon
        name="arrow-up-right"
        size="XS"
        color="var(--spectrum-global-color-gray-600)"
        weight="regular"
      />
    </a>
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

  .metric-label-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: inherit;
    width: fit-content;
  }

  .metric-label-link:hover {
    color: var(--spectrum-global-color-gray-800);
  }

  .metric-label-link:hover :global(.spectrum-Body),
  .metric-label-link:hover :global(i) {
    color: var(--spectrum-global-color-gray-800) !important;
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

    .metrics.three {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
