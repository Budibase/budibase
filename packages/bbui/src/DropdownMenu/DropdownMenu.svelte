<script>
  import "@spectrum-css/popover/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { createEventDispatcher } from "svelte"
  import buildStyle from "../utils/buildStyle"
  import positionDropdown from "../Actions/position_dropdown"
  import clickOutside from "../Actions/click_outside"

  const dispatch = createEventDispatcher()

  export let anchor
  export let align = "right"
  export let borderColor = ""

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

  $: menuStyle = buildStyle({
    borderColor,
  })
</script>

{#if open}
  <Portal>
    <div
      tabindex="0"
      use:positionDropdown={{ anchor, align }}
      use:clickOutside={hide}
      style={menuStyle}
      on:keydown={handleEscape}
      class="spectrum-Popover is-open" role="presentation">
      <slot />
    </div>
  </Portal>
{/if}
