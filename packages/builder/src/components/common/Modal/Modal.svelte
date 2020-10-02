<script>
  import { createEventDispatcher } from "svelte"
  import { fade, fly } from "svelte/transition"
  import { portal } from "./portal"
  const dispatch = createEventDispatcher()

  export let visible = false
  export let cancelText = "Cancel"
  export let confirmText = "Confirm"
  export let showCancelButton = true
  export let showConfirmButton = true

  export function show() {
    console.log("show")
    if (visible) {
      return
    }
    visible = true
    dispatch("show")
  }

  export function hide() {
    if (!visible) {
      return
    }
    visible = false
    dispatch("hide")
  }
</script>

{#if visible}
  <div class="portal-wrapper" use:portal={'#modal-container'}>
    <div
      class="overlay"
      on:click|self={hide}
      transition:fade={{ duration: 200 }}>
      <div
        class="scroll-wrapper"
        on:click|self={hide}
        transition:fly={{ y: 100 }}>
        <div class="content-wrapper" on:click|self={hide}>
          <div class="content">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .portal-wrapper {
    display: none;
  }

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

  .content {
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    box-shadow: 0 0 2.4rem 1.5rem rgba(0, 0, 0, 0.15);
    position: relative;
    flex: 0 0 400px;
    margin: 2rem 0;
    border-radius: var(--border-radius-m);
  }
</style>
