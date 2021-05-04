<script>
  import "@spectrum-css/popover/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { createEventDispatcher } from "svelte"
  import positionDropdown from "../Actions/position_dropdown"
  import clickOutside from "../Actions/click_outside"

  const dispatch = createEventDispatcher()

  export let anchor
  export let align = "right"

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
  <Portal>
    <div
      tabindex="0"
      use:positionDropdown={{ anchor, align }}
      use:clickOutside={hide}
      on:keydown={handleEscape}
      class="spectrum-Popover is-open"
      role="presentation">
      <slot />
    </div>
  </Portal>
{/if}

<style>
  .spectrum-Popover {
    min-width: var(--spectrum-global-dimension-size-2000) !important;
  }
</style>
