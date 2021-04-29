<script>
  import { slide } from "svelte/transition"
  import Portal from "svelte-portal"
  import clickOutside from "../Actions/click_outside"

  export let title

  let visible = false

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
</script>

<svelte:window on:keydown={handleKey} />

{#if visible}
  <Portal>
    <section class="drawer" transition:slide>
      <header>
        <div class="text">
          <div class="title">{title}</div>
          <slot name="description" />
        </div>
        <div class="controls">
          <slot name="buttons" />
          <i class="ri-close-fill close" on:click={hide} />
        </div>
      </header>
      <slot name="body" />
    </section>
  </Portal>
{/if}

<style>
  .drawer {
    position: absolute;
    bottom: 0;
    left: 260px;
    width: calc(100% - 520px);
    background: var(--background);
    border: var(--border-light);
    z-index: 2;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: var(--border-light);
    padding: var(--spacing-m);
  }

  .controls {
    display: grid;
    grid-auto-flow: column;
    grid-gap: var(--spacing-m);
    align-items: center;
  }

  .close {
    font-size: var(--font-size-xl);
    cursor: pointer;
  }
  .title {
    font-weight: bold;
    margin-right: var(--spacing-m);
  }
  .text {
    display: flex;
  }
</style>
