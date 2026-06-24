<svelte:options runes={true} />

<script lang="ts">
  import { ActionButton, Icon } from "@budibase/bbui"
  import type { HomeType } from "@budibase/types"
  import { getHomeTypeIcon, getHomeTypeIconColor } from "./rows"

  interface Props {
    typeFilter?: HomeType
    variant?: "default" | "panel"
    onTypeChange?: (_type: HomeType) => void
  }

  let {
    typeFilter = "all",
    variant = "default",
    onTypeChange = () => {},
  }: Props = $props()

  interface HomeFilterOption {
    label: string
    value: HomeType
    disabled?: boolean
  }

  const tabOptions: HomeFilterOption[] = [
    { label: "All tools", value: "all" },
    { label: "Agents", value: "agent" },
    { label: "Automations", value: "automation" },
    { label: "Apps", value: "app" },
  ]
</script>

<div class="filter" class:filter--panel={variant === "panel"}>
  {#each tabOptions as option}
    <span
      class="filter-tab"
      style="--tab-icon-color: {getHomeTypeIconColor(option.value)}"
    >
      <ActionButton
        quiet
        selected={typeFilter === option.value}
        disabled={option.disabled}
        on:click={() => !option.disabled && onTypeChange(option.value)}
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
    gap: 4px;
    padding: 4px;
    border-radius: var(--border-radius-s);
    background: var(--spectrum-global-color-gray-100);
  }

  .filter--panel {
    background: transparent;
    padding: 0 4px;
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
    padding: 2px 8px;
    height: auto;
  }

  .filter--panel :global(.spectrum-ActionButton.is-selected) {
    background: var(--spectrum-global-color-gray-200);
  }

  .filter :global(.spectrum-ActionButton-label) {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: var(--font-size-s);
    font-weight: 400;
  }
</style>
