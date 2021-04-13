<script>
  import "@spectrum-css/label/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let row
  export let value
  export let schema

  const dispatch = createEventDispatcher()
  const displayLimit = 5

  $: relationships = value?.slice(0, displayLimit) ?? []
  $: leftover = (value?.length ?? 0) - relationships.length

  const onClick = e => {
    e.stopPropagation()
    dispatch("clickrelationship", {
      tableId: row.tableId,
      rowId: row._id,
      fieldName: schema?.name,
    })
  }
</script>

{#each relationships as relationship}
  {#if relationship?.primaryDisplay}
    <span class="spectrum-Label spectrum-Label--grey" on:click={onClick}>
      {relationship.primaryDisplay}
    </span>
  {/if}
{/each}
{#if leftover}
  <div>+{leftover} more</div>
{/if}

<style>
  span:hover {
    cursor: pointer;
  }
</style>
