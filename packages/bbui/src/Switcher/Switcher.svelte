<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import AbsTooltip from "../Tooltip/AbsTooltip.svelte"
  import ActionButton from "../ActionButton/ActionButton.svelte"

  export let leftIcon: string | undefined = undefined
  export let leftNotificationTooltip: string | undefined = undefined
  export let leftNotificationCount: number | undefined = undefined
  export let leftText: string
  export let rightIcon: string | undefined = undefined
  export let rightNotificationTooltip: string | undefined = undefined
  export let rightNotificationCount: number | undefined = undefined
  export let rightText: string
  export let selected: "left" | "right" = "left"
  export let disabled = false
  export let leftDisabled = false
  export let rightDisabled = false
  export let size: "S" | "M" | "L" = "M"

  const dispatch = createEventDispatcher<{
    left: void
    right: void
  }>()
</script>

<div class="view-mode-toggle" class:disabled>
  <div class="group size-{size}">
    <div class="wrapper">
      {#if leftNotificationTooltip && leftNotificationCount}
        <AbsTooltip text={leftNotificationTooltip}>
          <span
            class="notification"
            role="button"
            tabindex="-1"
            aria-label={`Notifications ${leftNotificationCount}`}
          >
            {leftNotificationCount}
          </span>
        </AbsTooltip>
      {/if}
      <div class="left">
        <ActionButton
          icon={leftIcon}
          quiet
          disabled={disabled || leftDisabled}
          {size}
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
      {#if rightNotificationTooltip && rightNotificationCount}
        <AbsTooltip text={rightNotificationTooltip}>
          <span
            class="notification"
            role="button"
            tabindex="-1"
            aria-label={`Notifications ${rightNotificationCount}`}
          >
            {rightNotificationCount}
          </span>
        </AbsTooltip>
      {/if}
      <div class="right">
        <ActionButton
          icon={rightIcon}
          quiet
          disabled={disabled || rightDisabled}
          {size}
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
  /* A radius sized for M crops the label on a shorter button */
  .group.size-S {
    border-radius: 8px;
  }
  .size-S .right :global(*) {
    border-radius: 0 6px 6px 0;
  }
  .size-S .left :global(*) {
    border-radius: 6px 0 0 6px;
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
  .disabled {
    opacity: 0.8;
  }
</style>
