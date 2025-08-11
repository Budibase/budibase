<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { AbsTooltip, ActionButton } from "@budibase/bbui"

  export let leftIcon: string
  export let leftTooltip: string | undefined = undefined
  export let leftTooltipValue: string | undefined = undefined
  export let leftText: string
  export let rightIcon: string
  export let rightTooltip: string | undefined = undefined
  export let rightTooltipValue: string | undefined = undefined
  export let rightText: string
  export let selected: "left" | "right" = "left"

  const dispatch = createEventDispatcher<{}>()
</script>

<div class="view-mode-toggle">
  <div class="group">
    <div class="wrapper">
      {#if leftTooltip && leftTooltipValue}
        <AbsTooltip text={leftTooltip}>
          <span
            class="notification"
            role="button"
            tabindex="-1"
            aria-label={`Notifications ${leftTooltipValue}`}
          >
            {leftTooltipValue}
          </span>
        </AbsTooltip>
      {/if}
      <div class="left">
        <ActionButton
          icon={leftIcon}
          quiet
          selected={selected === "left"}
          on:click={() => {
            selected = "left"
            dispatch("left")
          }}
        >
          {leftText}
        </ActionButton>
      </div>
    </div>
    <div class="wrapper">
      {#if rightTooltip && rightTooltipValue}
        <AbsTooltip text={rightTooltip}>
          <span
            class="notification"
            role="button"
            tabindex="-1"
            aria-label={`Notifications ${rightTooltipValue}`}
          >
            {rightTooltipValue}
          </span>
        </AbsTooltip>
      {/if}
      <div class="right">
        <ActionButton
          icon={rightIcon}
          quiet
          selected={selected === "right"}
          on:click={() => {
            selected = "right"
            dispatch("right")
          }}
        >
          {rightText}
        </ActionButton>
      </div>
    </div>
  </div>
</div>

<style>
  .view-mode-toggle {
    display: flex;
    gap: var(--spacing-l);
    flex-shrink: 0;
  }
  .view-mode-toggle .group {
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    background: var(--spectrum-global-color-gray-100);
    padding: 2px;
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
  .right :global(*) {
    border-radius: 0 10px 10px 0;
  }
  .left :global(*) {
    border-radius: 10px 0 0 10px;
  }
  .wrapper {
    position: relative;
  }
  .notification {
    position: absolute;
    right: -6px;
    top: -6px;
    background: var(--spectrum-global-color-static-red-600);
    color: white;
    border-radius: 8px;
    padding: 0 4px;
    z-index: 2;
    font-size: 0.8em;
    cursor: pointer;
  }
</style>
