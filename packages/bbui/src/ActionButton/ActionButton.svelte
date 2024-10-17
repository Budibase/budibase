<script>
  import "@spectrum-css/actionbutton/dist/index-vars.css"
  import Tooltip from "../Tooltip/Tooltip.svelte"
  import { fade } from "svelte/transition"
  import { hexToRGBA } from "../helpers"

  export let quiet = false
  export let selected = false
  export let disabled = false
  export let icon = ""
  export let size = "M"
  export let active = false
  export let fullWidth = false
  export let noPadding = false
  export let tooltip = ""
  export let accentColor = null

  let showTooltip = false

  $: accentStyle = getAccentStyle(accentColor)

  const getAccentStyle = color => {
    if (!color) {
      return ""
    }
    let style = ""
    style += `--accent-bg-color:${hexToRGBA(color, 0.15)};`
    style += `--accent-border-color:${hexToRGBA(color, 0.35)};`
    return style
  }
</script>

<button
  class="spectrum-ActionButton spectrum-ActionButton--size{size}"
  class:spectrum-ActionButton--quiet={quiet}
  class:is-selected={selected}
  class:noPadding
  class:fullWidth
  class:active
  class:disabled
  class:accent={accentColor != null}
  on:click|preventDefault
  on:mouseover={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
  on:focus={() => (showTooltip = true)}
  {disabled}
  style={accentStyle}
>
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeS"
      focusable="false"
      aria-hidden="true"
      aria-label={icon}
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  {#if $$slots}
    <span class="spectrum-ActionButton-label"><slot /></span>
  {/if}
  {#if tooltip && showTooltip}
    <div class="tooltip" in:fade={{ duration: 130, delay: 250 }}>
      <Tooltip textWrapping direction="bottom" text={tooltip} />
    </div>
  {/if}
</button>

<style>
  button {
    transition: filter 130ms ease-out, background 130ms ease-out,
      border 130ms ease-out, color 130ms ease-out;
  }
  .fullWidth {
    width: 100%;
  }
  .active,
  .active svg {
    color: var(--spectrum-global-color-blue-600);
  }
  :global([dir="ltr"] .spectrum-ActionButton .spectrum-Icon) {
    margin-left: 0;
    transition: color ease-out 130ms;
  }
  .is-selected:not(.spectrum-ActionButton--quiet) {
    background: var(--spectrum-global-color-gray-300);
    border-color: var(--spectrum-global-color-gray-500);
  }
  .spectrum-ActionButton--quiet {
    padding: 0 8px;
  }
  .spectrum-ActionButton--quiet.is-selected {
    color: var(--spectrum-global-color-gray-900);
    background: var(--spectrum-global-color-gray-300);
  }
  .noPadding {
    padding: 0;
    min-width: 0;
  }
  .is-selected .spectrum-Icon {
    color: var(--spectrum-global-color-gray-900);
  }
  .is-selected.disabled .spectrum-Icon {
    color: var(--spectrum-global-color-gray-500);
  }
  .tooltip {
    position: absolute;
    pointer-events: none;
    left: 50%;
    top: calc(100% + 4px);
    width: 100vw;
    max-width: 150px;
    transform: translateX(-50%);
    text-align: center;
    z-index: 1;
  }
  .accent.is-selected,
  .accent:active {
    border: 1px solid var(--accent-border-color);
    background: var(--accent-bg-color);
  }
  .accent:hover {
    filter: brightness(1.2);
  }
</style>
