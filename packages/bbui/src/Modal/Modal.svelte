<script>
  import { createEventDispatcher, setContext } from "svelte"
  import { fade, fly } from "svelte/transition"
  import Portal from "svelte-portal"
  import Context from "../context"
  const dispatch = createEventDispatcher()

  export let padding = true
  export let width = undefined
  export let border = true

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
    <div class="overlay spectrum-Modal" transition:fade={{ duration: 200 }} on:click|self={hide}>
      <section
        class="spectrum-Dialog spectrum-Dialog--large spectrum-Dialog--dismissable" role="dialog" tabindex="-1" aria-modal="true">
        <div
          class="scroll-wrapper"
          on:click|self={hide}
          transition:fly={{ y: 30, duration: 200 }}>
          <div class="content-wrapper" on:click|self={hide}>
            <div
              class="modal {width ? width : ''}"
              class:padding
              class:border>
              <slot />
            </div>
          </div>
        </div>
      </section>
    </div>
  </Portal>
{/if}

<style>
  .overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
    z-index: 999;
  }

  .scroll-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    max-height: 100%;
  }

  .content-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 0;
  }

  .modal {
    background-color: var(--background);
    display: grid;
    align-items: stretch;
    position: relative;
    flex: 0 0 400px;
    margin: 2rem 0;
    border-radius: var(--border-radius-m);
    gap: var(--spacing-xl);
  }
  .modal.padding {
    padding: var(--spacing-xl);
  }
</style>
