<script lang="ts">
  import { Body, Icon, Modal } from "@budibase/bbui"
  import type { GetWorkspaceHomeMetricsResponse } from "@budibase/types"
  import { onMount } from "svelte"
  import type { Route } from "@/types/routing"

  import { API } from "@/api"
  import { bb } from "@/stores/bb"
  import { flattenedRoutes } from "@/stores/routing"
  import { licensing } from "@/stores/portal/licensing"
  import { ActionsBreakdownModal } from "@/components/usage"

  const GITHUB_REPO_URL = "https://github.com/Budibase/budibase"

  export let metrics: GetWorkspaceHomeMetricsResponse | null = null
  export let showBudibaseAIMetric = true
  export let variant: "default" | "projects" = "default"

  let githubStars: number | null = null
  let actionsBreakdownModal: Modal

  $: canViewOrganisationUsers = $flattenedRoutes.some(
    (route: Route) => route.path === "/people/users"
  )

  $: actionsBreakdown = $licensing.actionsBreakdown
  $: actionsUsage = {
    name: "Actions",
    used: metrics?.operationsThisMonth ?? 0,
    total: $licensing.actionsLimit ?? 0,
  }

  const formatMetric = (value: number) => {
    return new Intl.NumberFormat("en").format(value)
  }

  const formatStars = (stars: number) => {
    return new Intl.NumberFormat("en", {
      maximumSignificantDigits: 3,
      useGrouping: false,
    }).format(stars)
  }

  onMount(async () => {
    if (variant === "projects") {
      return
    }
    try {
      const response = await API.workspaceHome.getGitHubStars()
      githubStars = response.stars
    } catch (err) {
      console.error("Failed to load GitHub stars", err)
    }
  })
</script>

<div
  class="metrics"
  class:three={!showBudibaseAIMetric && variant !== "projects"}
  class:projects={variant === "projects"}
>
  {#if variant === "projects"}
    <div class="metric-card">
      <Body size="XL" weight="600">
        {metrics ? formatMetric(metrics.operationsThisMonth) : "-"}
      </Body>
      {#if actionsBreakdown}
        <button
          type="button"
          class="metric-label-link metric-label-button"
          on:click={() => actionsBreakdownModal.show()}
        >
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Actions this month
          </Body>
          <Icon
            name="arrow-up-right"
            size="XS"
            color="var(--spectrum-global-color-gray-600)"
            weight="regular"
          />
        </button>
      {:else}
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Actions this month
        </Body>
      {/if}
    </div>

    <div class="metric-card">
      <Body size="XL" weight="600">
        {metrics ? formatMetric(metrics.totalUsers) : "-"}
      </Body>
      {#if canViewOrganisationUsers}
        <button
          type="button"
          class="metric-label-link metric-label-button"
          on:click={() => bb.settings("/people/users")}
        >
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Users
          </Body>
          <Icon
            name="arrow-up-right"
            size="XS"
            color="var(--spectrum-global-color-gray-600)"
            weight="regular"
          />
        </button>
      {:else}
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Users
        </Body>
      {/if}
    </div>

    {#if showBudibaseAIMetric}
      <div class="metric-card">
        <Body size="XL" weight="600">
          {metrics ? formatMetric(metrics.budibaseAICreditsThisMonth) : "-"}
        </Body>
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Budibase AI tokens this month
        </Body>
      </div>
    {/if}
  {:else}
    <div class="metric-card">
      <Body size="XL" weight="600">
        {metrics ? formatMetric(metrics.totalUsers) : "-"}
      </Body>
      {#if canViewOrganisationUsers}
        <button
          type="button"
          class="metric-label-link metric-label-button"
          on:click={() => bb.settings("/people/users")}
        >
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Total users
          </Body>
          <Icon
            name="arrow-up-right"
            size="XS"
            color="var(--spectrum-global-color-gray-600)"
            weight="regular"
          />
        </button>
      {:else}
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Total users
        </Body>
      {/if}
    </div>

    <div class="metric-card">
      <Body size="XL" weight="600">
        {metrics ? formatMetric(metrics.operationsThisMonth) : "-"}
      </Body>
      {#if actionsBreakdown}
        <button
          type="button"
          class="metric-label-link metric-label-button"
          on:click={() => actionsBreakdownModal.show()}
        >
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Actions this month
          </Body>
          <Icon
            name="arrow-up-right"
            size="XS"
            color="var(--spectrum-global-color-gray-600)"
            weight="regular"
          />
        </button>
      {:else}
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Actions this month
        </Body>
      {/if}
    </div>

    {#if showBudibaseAIMetric}
      <div class="metric-card">
        <Body size="XL" weight="600">
          {metrics ? formatMetric(metrics.budibaseAICreditsThisMonth) : "-"}
        </Body>
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Budibase AI credits this month
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
  {/if}
</div>

{#if actionsBreakdown}
  <Modal bind:this={actionsBreakdownModal}>
    <ActionsBreakdownModal usage={actionsUsage} breakdown={actionsBreakdown} />
  </Modal>
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

  .metrics.projects {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 0;
  }

  .metric-card {
    background: var(--spectrum-global-color-gray-100);
    border-radius: 4px;
    padding: var(--spacing-m) var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-s) - var(--spacing-xs));
  }

  .metrics.projects .metric-card {
    border-radius: 12px;
    padding: 16px;
    gap: 12px;
  }

  .metrics.projects .metric-card :global(.spectrum-Body[size="XL"]) {
    font-size: 26px;
    line-height: normal;
  }

  .metric-label-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: inherit;
    width: fit-content;
  }

  .metric-label-button {
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    font: inherit;
  }

  .metric-label-link:hover {
    color: var(--spectrum-global-color-gray-800);
  }

  .metric-label-link:hover :global(.spectrum-Body),
  .metric-label-link:hover :global(i) {
    color: var(--spectrum-global-color-gray-800) !important;
  }

  @media (max-width: 900px) {
    .metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .metrics.three,
    .metrics.projects {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
