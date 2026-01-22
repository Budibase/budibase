<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, Icon, Select } from "@budibase/bbui"
  import type { HomeType } from "./types"

  export let typeFilter: HomeType = "all"
  export let searchTerm = ""
  export let agentsEnabled = false

  const dispatch = createEventDispatcher<{
    typeChange: string
    searchChange: string
    createAutomation: void
    createApp: void
    createAgent: void
    createChat: void
  }>()

  const getOptions = (agentsEnabled: boolean) => {
    const options: { label: string; value: HomeType; disabled?: boolean }[] = [
      { label: "Apps", value: "app" },
      { label: "Automations", value: "automation" },
    ]

    if (agentsEnabled) {
      options.push({ label: "Agents", value: "agent" })
      options.push({ label: "Chat (Alpha)", value: "chat", disabled: true })
    }

    return options
  }

  $: selectValue = typeFilter === "all" ? null : typeFilter

  const handleSearchInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    dispatch("searchChange", value)
  }
</script>

<div class="controls">
  <div class="controls-left">
    <div class="filter-wrapper">
      <Select
        size="S"
        quiet
        placeholder="Type"
        value={selectValue}
        options={getOptions(agentsEnabled)}
        isOptionEnabled={option => !option.disabled}
        on:change={({ detail }) => dispatch("typeChange", detail ?? "all")}
      />
    </div>

    <div class="search-wrapper">
      <Icon name="magnifying-glass" size="S" />
      <input
        class="search-input"
        type="text"
        placeholder="Search"
        value={searchTerm}
        on:input={handleSearchInput}
      />
    </div>
  </div>

  <div class="controls-right">
    <button
      class="create-button"
      type="button"
      on:click={() => dispatch("createAutomation")}
    >
      <Icon name="path" size="S" color="#89B5E2" />
      <Body size="S">Automation</Body>
    </button>

    <button
      class="create-button"
      type="button"
      on:click={() => dispatch("createApp")}
    >
      <Icon name="browsers" size="S" color="#D4A27F" />
      <Body size="S">App</Body>
    </button>

    {#if agentsEnabled}
      <button
        class="create-button"
        type="button"
        on:click={() => dispatch("createAgent")}
      >
        <Icon name="sparkle" size="S" color="#BDB0F5" />
        <Body size="S">Agent</Body>
        <span class="badge">Beta</span>
      </button>

      <button
        class="create-button create-button--disabled"
        type="button"
        disabled
        title="Coming soon"
        on:click={() => dispatch("createChat")}
      >
        <Icon name="chat-circle" size="S" color="#8CA171" />
        <Body size="S">Chat</Body>
        <span class="badge">Alpha</span>
      </button>
    {/if}
  </div>
</div>

<style>
  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .controls-left {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  .filter-wrapper {
    display: flex;
    align-items: center;
  }

  .filter-wrapper :global(.spectrum-Picker) {
    height: 28px;
    border-radius: 6px;
    width: 140px;
    padding-right: 8px;
  }

  .filter-wrapper :global(.spectrum-Picker-label) {
    padding-left: 8px;
  }

  .search-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 6px;
    padding: 3px 8px;
    min-width: 200px;
  }

  .search-input {
    background: transparent;
    border: none;
    outline: none;
    flex: 1;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--spectrum-global-color-gray-900);
  }

  .search-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .controls-right {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }

  .create-button {
    background: var(--spectrum-global-color-gray-200);
    border: none;
    border-radius: 100px;
    padding: 7px 15px 8px;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    cursor: pointer;
    transition: background 130ms ease-out;
    color: var(--spectrum-global-color-gray-900);
  }

  .create-button:hover {
    background: var(--spectrum-global-color-gray-300);
  }

  .create-button--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .badge {
    background: var(--spectrum-global-color-gray-300);
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 11px;
    line-height: 10px;
    color: var(--spectrum-global-color-gray-700);
  }

  @media (max-width: 900px) {
    .controls {
      flex-direction: column;
      align-items: stretch;
    }

    .controls-left {
      justify-content: space-between;
    }

    .controls-right {
      justify-content: flex-start;
      flex-wrap: wrap;
    }
  }
</style>
