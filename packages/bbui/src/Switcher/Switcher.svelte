<script>
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let headings
  export let value
</script>

<section>
  <header>
    {#each headings as heading}
      <span
        class:selected={value === heading.key}
        on:click={() => {
          value = heading.key
          dispatch('change', { heading })
        }}>
        {heading.title}
      </span>
    {/each}
  </header>
  <slot />
</section>

<style>
  header {
    font-family: var(--font-sans);
    display: flex;
    margin-bottom: var(--spacing-l);
  }

  span {
    margin-right: var(--spacing-xl);
    font-size: var(--font-size-m);
    font-weight: 500;
    color: var(--grey-5);
  }

  span:hover {
    cursor: pointer;
  }

  .selected {
    color: var(--ink);
  }
</style>
