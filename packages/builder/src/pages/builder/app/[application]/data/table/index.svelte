<script>
  import { onMount } from "svelte"
  import { tables } from "stores/backend"
  import { redirect } from "@roxi/routify"

  onMount(async () => {
    const { list, selected } = $tables
    if (selected) {
      $redirect(`./${selected?._id}`)
    } else if (list?.length) {
      $redirect(`./${list[0]._id}`)
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
