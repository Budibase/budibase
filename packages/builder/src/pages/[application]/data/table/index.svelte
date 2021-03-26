<script>
  import { tables } from 'stores/backend/'
  import { goto } from "@sveltech/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    $tables.list.length > 0 && $goto(`../${$tables.list[0]._id}`)
  })
</script>

{#if $tables.list.length === 0}
  <i>Create your first table to start building</i>
{:else}<i>Select a table to edit</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
