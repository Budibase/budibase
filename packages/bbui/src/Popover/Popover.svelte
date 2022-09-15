<script>
  import "@spectrum-css/popover/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { createEventDispatcher } from "svelte"
  import positionDropdown from "../Actions/position_dropdown"
  import clickOutside from "../Actions/click_outside"

  const dispatch = createEventDispatcher()

  export let anchor
  export let align = "right"
  export let portalTarget
  export let dataCy
  export let maxWidth

  export let direction = "bottom"
  export let showTip = false

  let tipSvg =
    '<svg xmlns="http://www.w3.org/svg/2000" width="23" height="12" class="spectrum-Popover-tip" > <path class="spectrum-Popover-tip-triangle" d="M 0.7071067811865476 0 L 11.414213562373096 10.707106781186548 L 22.121320343559645 0" /> </svg>'

  $: tooltipClasses = showTip
    ? `spectrum-Popover--withTip spectrum-Popover--${direction}`
    : ""

  export const show = () => {
    dispatch("open")
    open = true
  }

  export const hide = () => {
    dispatch("close")
    open = false
  }

  let open = null

  function handleEscape(e) {
    if (open && e.key === "Escape") {
      hide()
    }
  }
</script>

{#if open}
  <Portal target={portalTarget}>
    <div
      tabindex="0"
      use:positionDropdown={{ anchor, align, maxWidth }}
      use:clickOutside={hide}
      on:keydown={handleEscape}
      class={"spectrum-Popover is-open " + (tooltipClasses || "")}
      role="presentation"
      data-cy={dataCy}
    >
      {#if showTip}
        {@html tipSvg}
      {/if}

      <slot />
    </div>
  </Portal>
{/if}

<style>
  .spectrum-Popover {
    min-width: var(--spectrum-global-dimension-size-2000);
  }
  .spectrum-Popover.is-open.spectrum-Popover--withTip {
    margin-top: var(--spacing-xs);
    margin-left: var(--spacing-xl);
  }
  :global(.spectrum-Popover--bottom .spectrum-Popover-tip),
  :global(.spectrum-Popover--top .spectrum-Popover-tip) {
    left: 90%;
    margin-left: calc(var(--spectrum-global-dimension-size-150) * -1);
  }
</style>
