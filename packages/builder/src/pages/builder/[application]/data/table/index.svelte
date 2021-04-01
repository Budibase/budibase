<script>
<<<<<<< HEAD:packages/builder/src/pages/builder/[application]/data/table/index.svelte
  import { backendUiStore } from "builderStore"
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    $backendUiStore.tables.length > 0 &&
      $goto(`./${$backendUiStore.tables[0]._id}`)
=======
  import { tables } from 'stores/backend/'
  import { goto } from "@sveltech/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    $tables.list.length > 0 && $goto(`../${$tables.list[0]._id}`)
>>>>>>> d803aa0bd7a74220e432f4a1b338abdd7fbe9b7d:packages/builder/src/pages/[application]/data/table/index.svelte
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
