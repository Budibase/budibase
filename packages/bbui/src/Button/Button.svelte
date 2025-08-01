<script>
  import "@spectrum-css/button/dist/index-vars.css"
  import AbsTooltip from "../Tooltip/AbsTooltip.svelte"
  import { createEventDispatcher } from "svelte"
  import Icon from "../Icon/Icon.svelte"

  export let type = undefined
  export let disabled = false
  export let size = "M"
  export let cta = false
  export let primary = false
  export let secondary = false
  export let warning = false
  export let overBackground = false
  export let quiet = false
  export let icon = undefined
  export let active = false
  export let tooltip = undefined
  export let newStyles = true
  export let id = undefined
  export let ref = undefined
  export let reverse = false

  const dispatch = createEventDispatcher()
</script>

<AbsTooltip text={tooltip}>
  <button
    {id}
    {type}
    bind:this={ref}
    class:spectrum-Button--cta={cta}
    class:spectrum-Button--primary={primary}
    class:spectrum-Button--secondary={secondary}
    class:spectrum-Button--warning={warning}
    class:spectrum-Button--overBackground={overBackground}
    class:spectrum-Button--quiet={quiet}
    class:new-styles={newStyles}
    class:active
    class:is-disabled={disabled}
    class="spectrum-Button spectrum-Button--size{size.toUpperCase()}"
    on:click|preventDefault={() => {
      if (!disabled) {
        dispatch("click")
      }
    }}
  >
    {#if $$slots && reverse}
      <span class="spectrum-Button-label"><slot /></span>
    {/if}
    {#if icon}
      <span class="icon">
        <Icon name={icon} size={size.toUpperCase()} />
      </span>
    {/if}
    {#if $$slots && !reverse}
      <span class="spectrum-Button-label"><slot /></span>
    {/if}
  </button>
</AbsTooltip>

<style>
  button {
    position: relative;
    display: flex;
    gap: var(--spacing-s);
  }
  button.is-disabled {
    cursor: default;
  }
  .spectrum-Button {
    padding-bottom: calc(var(--spectrum-button-padding-y) - 1px);
  }
  .spectrum-Button-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600 !important;
    line-height: 20px;
    letter-spacing: -0.02em;
  }
  .spectrum-Button--sizeM {
    font-size: 14px;
  }
  .active {
    color: var(--spectrum-global-color-blue-600) !important;
  }

  .spectrum-Button--primary.new-styles {
    background: var(--spectrum-global-color-gray-800);
    border-color: transparent;
    color: var(--spectrum-global-color-gray-50);
  }
  .spectrum-Button--primary.new-styles:hover {
    background: var(--spectrum-global-color-gray-900);
  }
  .spectrum-Button--secondary.new-styles {
    background: var(--spectrum-global-color-gray-200);
    border-color: transparent;
    color: var(--spectrum-global-color-gray-900);
  }
  .spectrum-Button--secondary.new-styles:not(.is-disabled):hover {
    background: var(--spectrum-global-color-gray-300);
  }
  .spectrum-Button--secondary.new-styles.is-disabled {
    color: var(--spectrum-global-color-gray-500);
  }
  .spectrum-Button--warning.new-styles {
    background: var(--spectrum-global-color-red-400);
    border-color: transparent;
    color: var(--spectrum-global-color-gray-900);
  }
  .spectrum-Button--warning.new-styles:not(.is-disabled):hover {
    background: var(--spectrum-global-color-red-500);
  }
  .spectrum-Button--primary.new-styles.is-disabled {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-500);
  }
  .spectrum-Button--warning.new-styles.is-disabled {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-500);
  }
</style>
