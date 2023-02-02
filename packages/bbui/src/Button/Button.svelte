<script>
  import "@spectrum-css/button/dist/index-vars.css"
  import Tooltip from "../Tooltip/Tooltip.svelte"

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
  export let id

  let showTooltip = false
</script>

<button
  {id}
  class:spectrum-Button--cta={cta}
  class:spectrum-Button--primary={primary}
  class:spectrum-Button--secondary={secondary}
  class:spectrum-Button--warning={warning}
  class:spectrum-Button--overBackground={overBackground}
  class:spectrum-Button--quiet={quiet}
  class:new-styles={newStyles}
  class:active
  class:disabled
  class="spectrum-Button spectrum-Button--size{size.toUpperCase()}"
  {disabled}
  on:click|preventDefault
  on:mouseover={() => (showTooltip = true)}
  on:focus={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
>
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--size{size.toUpperCase()}"
      focusable="false"
      aria-hidden="true"
      aria-label={icon}
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  {#if $$slots}
    <span class="spectrum-Button-label"><slot /></span>
  {/if}
  {#if !disabled && tooltip}
    <div class="tooltip-icon">
      <svg
        class="spectrum-Icon spectrum-Icon--size{size.toUpperCase()}"
        focusable="false"
        aria-hidden="true"
        aria-label="Info"
      >
        <use xlink:href="#spectrum-icon-18-InfoOutline" />
      </svg>
    </div>
  {/if}
  {#if showTooltip && tooltip}
    <div class="tooltip">
      <Tooltip textWrapping={true} direction={"bottom"} text={tooltip} />
    </div>
  {/if}
</button>

<style>
  button {
    position: relative;
  }
  .spectrum-Button-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .active {
    color: var(--spectrum-global-color-blue-600) !important;
  }
  .tooltip {
    position: absolute;
    display: flex;
    justify-content: center;
    z-index: 100;
    width: 160px;
    text-align: center;
    transform: translateX(-50%);
    left: 50%;
    top: calc(100% - 3px);
  }
  .tooltip-icon {
    padding-left: var(--spacing-m);
    line-height: 0;
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
  .spectrum-Button--secondary.new-styles:not(.disabled):hover {
    background: var(--spectrum-global-color-gray-300);
  }
  .spectrum-Button--secondary.new-styles.disabled {
    color: var(--spectrum-global-color-gray-500);
  }
</style>
