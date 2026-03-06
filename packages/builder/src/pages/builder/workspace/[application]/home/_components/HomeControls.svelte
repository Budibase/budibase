<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { ActionButton, Icon } from "@budibase/bbui"
  import type { HomeType, PlaybookResponse } from "@budibase/types"
  import { getHomeTypeIcon, getHomeTypeIconColor } from "./rows"

  export let typeFilter: HomeType = "all"
  export let agentsEnabled = false
  export let playbooks: PlaybookResponse[] = []
  export let selectedPlaybookId = ""

  interface HomeFilterOption {
    label: string
    value: HomeType
    disabled?: boolean
  }

  const dispatch = createEventDispatcher<{
    typeChange: HomeType
    playbookChange: string
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

<div class="controls">
  <div class="controls-left">
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
    {#if playbooks.length}
      <label class="playbook-filter">
        <span>Playbook</span>
        <select
          bind:value={selectedPlaybookId}
          on:change={() => dispatch("playbookChange", selectedPlaybookId)}
        >
          <option value="">All playbooks</option>
          {#each playbooks as playbook}
            <option value={playbook._id}>{playbook.name}</option>
          {/each}
        </select>
      </label>
    {/if}
  </div>
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-m);
  }

  .controls-left {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
    flex-wrap: wrap;
  }

  .filter {
    display: flex;
    gap: 10px;
    padding: 3px;
    border-radius: 7px;
    background: var(--spectrum-global-color-gray-100);
  }

  .filter-tab {
    display: inline-flex;
  }

  .filter-tab :global(.spectrum-ActionButton.is-selected i) {
    color: var(--tab-icon-color) !important;
  }

  .filter :global(.spectrum-ActionButton) {
    border-radius: 6px;
    transition:
      border-color 130ms ease-out,
      background 130ms ease-out;
    border: 1px solid transparent;
    padding: 3px 10px;
    height: auto;
  }

  .filter :global(.spectrum-ActionButton-label) {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
  }

  .playbook-filter {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }

  .playbook-filter select {
    min-height: 32px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    padding: 0 10px;
    background: white;
  }

  @media (max-width: 1140px) {
    .controls {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-m);
    }

    .controls-left {
      justify-content: flex-start;
    }
  }
</style>
