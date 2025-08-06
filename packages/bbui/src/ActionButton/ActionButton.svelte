<script lang="ts">
  import "@spectrum-css/actionbutton/dist/index-vars.css"
  import Tooltip from "../Tooltip/Tooltip.svelte"
  import Icon from "../Icon/Icon.svelte"
  import { fade } from "svelte/transition"
  import { hexToRGBA } from "../helpers"

  export let quiet: boolean = false
  export let selected: boolean = false
  export let disabled: boolean = false
  export let icon: string = ""
  export let size: "S" | "M" | "L" = "M"
  export let active: boolean = false
  export let fullWidth: boolean = false
  export let noPadding: boolean = false
  export let tooltip: string = ""
  export let accentColor: string | null = null

  let showTooltip = false

  $: accentStyle = getAccentStyle(accentColor)

  const getAccentStyle = (color: string | null) => {
    if (!color) {
      return ""
    }
    let style = ""
    style += `--accent-bg-color:${hexToRGBA(color, 0.2)};`
    style += `--accent-border-color:${hexToRGBA(color, 0.2)};`
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
    <Icon
      name={icon}
      {size}
      color={`var(--spectrum-global-color-gray-${$$slots.default ? 600 : 700})`}
    />
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
    transition:
      filter 130ms ease-out,
      background 130ms ease-out,
      border 130ms ease-out,
      color 130ms ease-out;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-s);
    border-radius: 8px;
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
  .fullWidth {
    width: 100%;
  }
  .active,
  .active :global(i) {
    background-color: rgba(75, 117, 255, 0.1);
    border: 0.5px solid rgba(75, 117, 255, 0.2);
    color: var(--spectrum-global-color-gray-900);
  }
  .active:hover {
    background-color: rgba(75, 117, 255, 0.2);
    border: 0.5px solid rgba(75, 117, 255, 0.3);
  }
  :global([dir="ltr"] .spectrum-ActionButton i) {
    margin-left: 0;
    transition: color ease-out 130ms;
  }
  .is-selected:not(.spectrum-ActionButton--quiet) {
    border-color: var(--spectrum-global-color-gray-300);
  }
  .spectrum-ActionButton--quiet {
    padding: 0 8px;
    border: 1px dashed transparent;
  }
  .spectrum-ActionButton--quiet:hover {
    background-color: var(--spectrum-global-color-gray-200);
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
  .spectrum-ActionButton--quiet.is-selected {
    color: var(--spectrum-global-color-gray-900);
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
  .noPadding {
    padding: 0;
    min-width: 0;
  }
  .noPadding:hover {
    padding: 0;
    min-width: 0;
    background-color: transparent;
    border: 1px solid transparent;
  }
  .is-selected :global(i) {
    color: var(--spectrum-global-color-gray-900);
  }
  .is-selected.disabled :global(i) {
    color: var(--spectrum-global-color-gray-500);
  }
  .spectrum-ActionButton-label {
    font-weight: 600;
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
