<script>
  import { onMount } from "svelte"
  import { datasources, tables } from "@/stores/builder"
  import { redirect } from "@roxi/routify"
  import { TableNames } from "@/constants"

  onMount(() => {
    if ($tables.selected) {
      $redirect(`./${$tables.selected._id}`)
    } else if ($datasources.hasData) {
      $redirect(`./${TableNames.USERS}`)
    } else {
      $redirect("../new")
    }
  })
</script>

{#if !$tables.list?.length}
  <i>Create your first table to start building</i>
{:else}<i>Select a table to edit</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
