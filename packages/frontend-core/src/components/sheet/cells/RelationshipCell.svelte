<script>
  import { getColor } from "../utils"
  import { onMount } from "svelte"

  export let value
  export let api
  export let readonly
  export let selected

  let isOpen = false
  let searchResults

  $: editable = selected && !readonly
  $: {
    if (!selected) {
      close()
    }
  }
  $: orderedResults = orderResults(searchResults, value)

  const orderResults = () => {
    let results = []
    if (value?.length) {
      results = results.concat(value)
    }
    if (searchResults?.length) {
      results = results.concat(
        searchResults.filter(result => {
          return !value.some(x => x._id === result._id)
        })
      )
    }
    return results
  }

  const open = () => {
    isOpen = true
  }

  const close = () => {
    isOpen = false
  }

  const onKeyDown = () => {
    return isOpen
  }

  onMount(() => {
    api = {
      focus: open,
      blur: close,
      onKeyDown,
    }
  })
</script>

<div class="container" on:click={editable ? open : null} class:editable>
  {#each value || [] as relationship, idx}
    {#if relationship.primaryDisplay}
      <div class="badge" style="--color: {getColor(idx)}">
        {relationship.primaryDisplay}
      </div>
    {/if}
  {/each}
</div>

{#if isOpen}
  <div class="dropdown">
    {#each orderedResults as result, idx}
      <div class="badge" style="--color: {getColor(idx)}">
        {result.primaryDisplay}
      </div>
    {/each}
  </div>
{/if}

<style>
  .container {
    align-self: stretch;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 var(--cell-padding);
    flex: 1 1 auto;
    width: 0;
    gap: var(--cell-spacing);
    overflow: hidden;
  }
  .container.editable:hover {
    cursor: pointer;
  }
  .badge {
    flex: 0 0 auto;
    padding: 2px var(--cell-padding);
    background: var(--color);
    border-radius: var(--cell-padding);
    user-select: none;
  }
  .dropdown {
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: 300px;
    background: var(--cell-background);
    border: var(--cell-border);
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15);
    padding: var(--cell-padding);
    display: flex;
    flex-direction: column;
    gap: var(--cell-spacing);
    align-items: flex-start;
  }
</style>
