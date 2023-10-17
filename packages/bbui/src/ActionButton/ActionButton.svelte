<script>
  import "@spectrum-css/actionbutton/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import Tooltip from "../Tooltip/Tooltip.svelte"
  import { fade } from "svelte/transition"

  const dispatch = createEventDispatcher()

  export let quiet = false
  export let emphasized = false
  export let selected = false
  export let longPressable = false
  export let disabled = false
  export let icon = ""
  export let size = "M"
  export let active = false
  export let fullWidth = false
  export let noPadding = false
  export let tooltip = ""

  let showTooltip = false

  function longPress(element) {
    if (!longPressable) return
    let timer

    const listener = () => {
      timer = setTimeout(() => {
        dispatch("longpress")
      }, 700)
    }

    element.addEventListener("pointerdown", listener)

    return {
      destroy() {
        clearTimeout(timer)
        element.removeEventListener("pointerdown", longPress)
      },
    }
  }
</script>

<span
  class="btn-wrap"
  on:mouseover={() => (showTooltip = true)}
  on:mouseleave={() => (showTooltip = false)}
  on:focus={() => (showTooltip = true)}
>
  <button
    use:longPress
    class:spectrum-ActionButton--quiet={quiet}
    class:spectrum-ActionButton--emphasized={emphasized}
    class:is-selected={selected}
    class:noPadding
    class:fullWidth
    class="spectrum-ActionButton spectrum-ActionButton--size{size}"
    class:active
    {disabled}
    on:longPress
    on:click|preventDefault
  >
    {#if longPressable}
      <svg
        class="spectrum-Icon spectrum-UIIcon-CornerTriangle100 spectrum-ActionButton-hold"
        focusable="false"
        aria-hidden="true"
      >
        <use xlink:href="#spectrum-css-icon-CornerTriangle100" />
      </svg>
    {/if}
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
</span>

<style>
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
  .is-selected:not(.spectrum-ActionButton--emphasized):not(
      .spectrum-ActionButton--quiet
    ) {
    background: var(--spectrum-global-color-gray-300);
    border-color: var(--spectrum-global-color-gray-500);
  }
  .noPadding {
    padding: 0;
    min-width: 0;
  }
  .spectrum-ActionButton--quiet {
    padding: 0 8px;
  }
  .spectrum-ActionButton--quiet.is-selected {
    color: var(--spectrum-global-color-gray-900);
  }
  .is-selected:not(.emphasized) .spectrum-Icon {
    color: var(--spectrum-global-color-gray-900);
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
  }
</style>
