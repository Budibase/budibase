<script>
  import "@spectrum-css/dialog/dist/index-vars.css"
  import "@spectrum-css/modal/dist/index-vars.css"
  import "@spectrum-css/underlay/dist/index-vars.css"
  import { createEventDispatcher, setContext } from "svelte"
  import { fade, fly } from "svelte/transition"
  import Portal from "svelte-portal"
  import Context from "../context"
  const dispatch = createEventDispatcher()

  let visible = false
  $: dispatch(visible ? "show" : "hide")

  export function show() {
    if (visible) {
      return
    }
    visible = true
  }

  export function hide() {
    if (!visible) {
      return
    }
    visible = false
  }

  function handleKey(e) {
    if (visible && e.key === "Escape") {
      hide()
    }
  }

  setContext(Context.Modal, { show, hide })
</script>

<svelte:window on:keydown={handleKey} />

{#if visible}
  <Portal target="modal-container">
    <div class="spectrum-Underlay is-open" transition:fade={{ duration: 200 }} on:click|self={hide}>
      <div class="spectrum-Modal-wrapper">
        <div class="spectrum-Modal is-open" transition:fly={{ y: 30, duration: 200 }}>
          <slot />
        </div>
      </div>
    </div>
  </Portal>
{/if}