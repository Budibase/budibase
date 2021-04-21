<script>
  import Portal from "svelte-portal"
  import { createEventDispatcher } from "svelte"
  import positionDropdown from "../Actions/position_dropdown"
  import clickOutside from "../Actions/click_outside"
  const dispatch = createEventDispatcher()

  export let anchor
  export let align = "right"
  let open = null

  export const show = () => {
    open = true
    dispatch("show")
  }

  export const hide = () => {
    open = false
    dispatch("hide")
  }

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
      class="spectrum-Popover is-open">
      <slot />
    </div>
  </Portal>
{/if}
