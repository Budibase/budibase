<script>
  import { slide } from "svelte/transition"
  import Portal from "svelte-portal"

  export let title
  export let onClose
</script>

<Portal>
  <section class="drawer" transition:slide>
    {#if title}
      <heading>{title}</heading>
    {/if}
    <slot />
  </section>
</Portal>

<style>
  .drawer {
    height: 50vh;
    position: absolute;
    bottom: 0;
    width: 97%;
    background: var(--background);
    padding: var(--spacing-xl);
    border-top: var(--border-light);
    z-index: 2;
  }
</style>
