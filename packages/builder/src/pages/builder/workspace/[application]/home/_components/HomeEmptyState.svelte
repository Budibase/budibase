<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, Icon } from "@budibase/bbui"
  import type { HomeType } from "@budibase/types"
  import { getRowIcon, getRowIconColor } from "./rows"

  export let allRowsCount = 0
  export let filteredRowsCount = 0
  export let typeFilter: HomeType = "all"
  export let searchTerm = ""
  export let agentsEnabled = false

  const dispatch = createEventDispatcher<{
    clearSearch: void
    resetFilters: void
    createAgent: void
    createAutomation: void
    createApp: void
  }>()

  $: hasAnyRows = allRowsCount > 0
  $: hasSearch = !!searchTerm.trim()
  $: hasFilter = typeFilter !== "all"
  $: isNoResults = hasAnyRows && filteredRowsCount === 0

  const agentColor = getRowIconColor("agent")
  const automationColor = getRowIconColor("automation")
  const appColor = getRowIconColor("app")

  const agentIcon = getRowIcon("agent")
  const automationIcon = getRowIcon("automation")
  const appIcon = getRowIcon("app")
</script>

{#if filteredRowsCount === 0}
  <div class="empty">
    {#if isNoResults}
      <Body size="M" color="var(--spectrum-global-color-gray-700)">
        No results.
      </Body>
      <div class="actions">
        {#if hasSearch}
          <button
            type="button"
            class="action"
            on:click={() => dispatch("clearSearch")}
          >
            Clear search
          </button>
        {/if}
        {#if hasFilter}
          <button
            type="button"
            class="action"
            on:click={() => dispatch("resetFilters")}
          >
            Reset filter
          </button>
        {/if}
      </div>
    {:else}
      <div class="welcome">
        <div class="welcome-artwork">
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="36" cy="24" r="10" fill={agentColor} opacity="0.3" />
            <circle cx="36" cy="24" r="5" fill={agentColor} opacity="0.7" />
            <circle
              cx="22"
              cy="46"
              r="8"
              fill={automationColor}
              opacity="0.25"
            />
            <circle
              cx="22"
              cy="46"
              r="4"
              fill={automationColor}
              opacity="0.6"
            />
            <circle cx="50" cy="46" r="8" fill={appColor} opacity="0.25" />
            <circle cx="50" cy="46" r="4" fill={appColor} opacity="0.6" />
            <line
              x1="32"
              y1="30"
              x2="25"
              y2="40"
              stroke="var(--spectrum-global-color-gray-400)"
              stroke-width="1"
              stroke-linecap="round"
              stroke-dasharray="2 3"
            />
            <line
              x1="40"
              y1="30"
              x2="47"
              y2="40"
              stroke="var(--spectrum-global-color-gray-400)"
              stroke-width="1"
              stroke-linecap="round"
              stroke-dasharray="2 3"
            />
            <line
              x1="28"
              y1="46"
              x2="44"
              y2="46"
              stroke="var(--spectrum-global-color-gray-400)"
              stroke-width="1"
              stroke-linecap="round"
              stroke-dasharray="2 3"
            />
          </svg>
        </div>

        {#if agentsEnabled}
          <div class="welcome-text">
            <div class="welcome-heading">Build your first AI agent</div>
            <Body size="S" color="var(--spectrum-global-color-gray-600)">
              Create an agent that answers questions, updates systems, and
              automates work across your tools.
            </Body>
          </div>

          <button
            type="button"
            class="spotlight-btn"
            on:click={() => dispatch("createAgent")}
          >
            <div class="spotlight-btn-icon">
              <Icon name={agentIcon} size="S" color="white" weight="fill" />
            </div>
            <span>Create an agent</span>
          </button>

          <div class="divider">
            <div class="divider-line"></div>
            <span class="divider-label">or start with an</span>
            <div class="divider-line"></div>
          </div>
        {:else}
          <div class="welcome-text">
            <div class="welcome-heading">Start building</div>
            <Body size="S" color="var(--spectrum-global-color-gray-600)">
              Create your first automation or app to get going.
            </Body>
          </div>
        {/if}

        <div class="secondary-pills">
          <button
            type="button"
            class="pill"
            on:click={() => dispatch("createAutomation")}
          >
            <Icon
              name={automationIcon}
              size="S"
              color={automationColor}
              weight="fill"
            />
            <span>Automation</span>
          </button>
          <button
            type="button"
            class="pill"
            on:click={() => dispatch("createApp")}
          >
            <Icon name={appIcon} size="S" color={appColor} weight="fill" />
            <span>App</span>
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .empty {
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    justify-content: center;
    align-items: center;
    background: transparent;
  }

  .actions {
    display: flex;
    gap: var(--spacing-s);
  }

  .action {
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: transparent;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    color: var(--spectrum-global-color-gray-800);
    transition:
      background 130ms ease-out,
      border-color 130ms ease-out;
  }

  .action:hover {
    background: var(--spectrum-global-color-gray-100);
    border-color: var(--spectrum-global-color-gray-400);
  }

  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-l);
    padding: var(--spacing-xl) var(--spacing-l);
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .welcome-artwork {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .welcome-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
    max-width: 380px;
  }

  .welcome-text :global(.spectrum-Body) {
    text-wrap: balance;
  }

  .welcome-heading {
    font-family: var(--font-sans);
    font-size: 16px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    line-height: 1.3;
  }

  .spotlight-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 15px;
    height: 32px;
    box-sizing: border-box;
    border-radius: 100px;
    border: none;
    background: var(--color-brand-500);
    color: white;
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 130ms ease-out;
  }

  .spotlight-btn:hover {
    background: color-mix(in srgb, var(--color-brand-500) 88%, black);
  }

  .spotlight-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    width: 100%;
    max-width: 320px;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: var(--spectrum-global-color-gray-300);
  }

  .divider-label {
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--spectrum-global-color-gray-500);
    white-space: nowrap;
  }

  .secondary-pills {
    display: flex;
    gap: var(--spacing-m);
    flex-wrap: wrap;
    justify-content: center;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 15px;
    height: 32px;
    box-sizing: border-box;
    border-radius: 100px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-800);
    transition:
      background 130ms ease-out,
      border-color 130ms ease-out;
  }

  .pill:hover {
    background: var(--spectrum-global-color-gray-300);
    border-color: var(--spectrum-global-color-gray-300);
  }

  @media (max-width: 560px) {
    .secondary-pills {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
