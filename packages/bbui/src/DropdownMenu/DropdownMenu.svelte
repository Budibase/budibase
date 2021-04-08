<script>
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
      class:open
      use:positionDropdown={{ anchor, align }}
      use:clickOutside={hide}
      style={menuStyle}
      on:keydown={handleEscape}
      class="menu-container">
      <slot />
    </div>
  </Portal>
{/if}

<style>
  .menu-container {
    position: fixed;
    margin-top: var(--spacing-xs);
    outline: none;
    box-sizing: border-box;
    opacity: 0;
    min-width: 200px;
    z-index: 2;
    color: var(--ink);
    font-weight: 400;
    height: fit-content !important;
    border: var(--border-dark);
    border-radius: var(--border-radius-m);
    transform: scale(0);
    transition: opacity 0.13s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1);
    overflow-y: auto;
    background: var(--background);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }

  .open {
    transform: scale(1);
    opacity: 1;
  }
</style>
