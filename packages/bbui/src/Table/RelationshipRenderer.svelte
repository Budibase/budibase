<script lang="ts">
  import "@spectrum-css/label/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import Badge from "../Badge/Badge.svelte"

  export let row: { tableId: string; _id: string }
  export let value: { primaryDisplay?: string }[] | undefined
  export let schema: { name?: string }

  const dispatch = createEventDispatcher()
  const displayLimit = 5

  $: relationships = value?.slice(0, displayLimit) ?? []
  $: leftover = (value?.length ?? 0) - relationships.length

  const onClick = (e: MouseEvent) => {
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
    <Badge hoverable grey on:click={onClick}>
      {relationship.primaryDisplay}
    </Badge>
  {/if}
{/each}
{#if leftover}
  <div>+{leftover} more</div>
{/if}
