<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { AbsTooltip, ActionButton } from "@budibase/bbui"

  export let leftIcon: string
  export let leftNotificationTooltip: string | undefined = undefined
  export let leftNotificationCount: number | undefined = undefined
  export let leftText: string
  export let rightIcon: string
  export let rightNotificationTooltip: string | undefined = undefined
  export let rightNotificationCount: number | undefined = undefined
  export let rightText: string
  export let selected: "left" | "right" = "left"
  export let disabled = false

  const dispatch = createEventDispatcher<{
    left: void
    right: void
  }>()
</script>

<div class="view-mode-toggle" class:disabled>
  <div class="group">
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
          {disabled}
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
          {disabled}
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
  .disabled {
    opacity: 0.8;
  }
</style>
