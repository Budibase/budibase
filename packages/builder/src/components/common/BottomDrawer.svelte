<script>
  import { slide } from "svelte/transition"
  import Portal from "svelte-portal"

  export let title
  export let onClose = () => {}
</script>

<Portal>
  <section class="drawer" transition:slide>
    <header>
      {title}
      <div class="controls">
        <slot name="buttons" />
        <i class="ri-close-fill close" on:click={onClose} />
      </div>
    </header>
    <slot name="body" />
  </section>
</Portal>

<style>
  .drawer {
    height: 50vh;
    position: absolute;
    bottom: 0;
    width: 100vw;
    background: var(--background);
    border-top: var(--border-light);
    z-index: 2;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: var(--border-light);
    padding: var(--spacing-s);
  }

  .controls {
    display: grid;
    grid-auto-flow: column;
    grid-gap: var(--spacing-m);
    align-items: center;
  }

  .close {
    font-size: var(--font-size-xl);
  }
</style>
