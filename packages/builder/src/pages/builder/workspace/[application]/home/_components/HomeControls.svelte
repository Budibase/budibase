<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { ActionButton, Icon, Select } from "@budibase/bbui"
  import type { HomeType, PlaybookResponse } from "@budibase/types"
  import { getHomeTypeIcon, getHomeTypeIconColor } from "./rows"

  export let typeFilter: HomeType = "all"
  export let agentsEnabled = false
  export let playbooksEnabled = false
  export let playbooks: PlaybookResponse[] = []
  export let selectedPlaybookId = ""

  interface HomeFilterOption {
    label: string
    value: HomeType
    disabled?: boolean
  }

  interface PlaybookOption {
    label: string
    value: string
    color?: string
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

  $: playbookOptions = [
    { label: "All playbooks", value: "", color: undefined },
    ...playbooks.map(playbook => ({
      label: playbook.name,
      value: playbook._id,
      color: playbook.color,
    })),
  ] satisfies PlaybookOption[]
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
    {#if playbooksEnabled && playbooks.length}
      <label class="playbook-filter">
        <span class="playbook-filter__label">Playbook</span>
        <Select
          autoWidth={true}
          bind:value={selectedPlaybookId}
          options={playbookOptions}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          getOptionColour={option => option.color}
          on:change={() => dispatch("playbookChange", selectedPlaybookId)}
        />
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
    min-height: 32px;
  }

  .playbook-filter__label {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    white-space: nowrap;
  }

  .playbook-filter :global(.spectrum-Picker) {
    min-width: 180px;
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
