<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { ActionButton, Icon } from "@budibase/bbui"
  import type { HomeType } from "@budibase/types"
  import { getHomeTypeIcon, getHomeTypeIconColor } from "./rows"

  export let typeFilter: HomeType = "all"
  export let agentsEnabled = false

  interface HomeFilterOption {
    label: string
    value: HomeType
    disabled?: boolean
  }

  const dispatch = createEventDispatcher<{
    typeChange: HomeType
  }>()

  const getOptions = (agentsEnabled: boolean) => {
    const options: HomeFilterOption[] = []

    if (agentsEnabled) {
      options.push({ label: "Agents", value: "agent" })
    }
    options.push({ label: "Automations", value: "automation" })
    options.push({ label: "Apps", value: "app" })

    return options
  }

  $: tabOptions = [
    { label: "All", value: "all" },
    ...getOptions(agentsEnabled),
  ] satisfies HomeFilterOption[]
</script>

<div class="filter">
  {#each tabOptions as option}
    <span
      class="filter-tab"
      style="--tab-icon-color: {getHomeTypeIconColor(option.value)}"
    >
      <ActionButton
        quiet
        selected={typeFilter === option.value}
        disabled={option.disabled}
        on:click={() =>
          !option.disabled && dispatch("typeChange", option.value)}
      >
        <Icon
          name={getHomeTypeIcon(option.value)}
          size="S"
          color={getHomeTypeIconColor(option.value)}
          weight="fill"
        />
        {option.label}
      </ActionButton>
    </span>
  {/each}
</div>

<style>
  .filter {
    display: flex;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-100);
  }

  .filter-tab {
    display: inline-flex;
  }

  .filter-tab :global(.spectrum-ActionButton.is-selected i) {
    color: var(--tab-icon-color) !important;
  }

  .filter :global(.spectrum-ActionButton) {
    border-radius: var(--border-radius-s);
    transition:
      border-color 130ms ease-out,
      background 130ms ease-out;
    border: 1px solid transparent;
    padding: var(--spacing-xs) var(--spacing-s);
    height: auto;
  }

  .filter :global(.spectrum-ActionButton-label) {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-s);
    font-weight: 500;
  }
</style>
