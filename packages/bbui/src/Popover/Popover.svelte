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
      class:open
      use:positionDropdown={{ anchor, align }}
      use:clickOutside={hide}
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
    padding: var(--spacing-xl);
    outline: none;
    box-sizing: border-box;
    opacity: 0;
    min-width: 400px;
    z-index: 2;
    color: var(--ink);
    height: fit-content !important;
    border: var(--border-dark);
    border-radius: var(--border-radius-m);
    transform: scale(0);
    transition: opacity 0.13s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1);
    overflow-y: auto;
    background-color: var(--background);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  }

  .open {
    transform: scale(1);
    opacity: 1;
  }
</style>
