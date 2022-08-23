<script>
  import { datasources } from "stores/backend"
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    // navigate to first table in list, if not already selected
    $datasources.list.length > 0 && $redirect(`./${$datasources.list[0]._id}`)
  })
</script>

{#if $datasources.list.length === 0}
  <i>Connect your first datasource to start building.</i>
{:else}<i>Select a datasource to edit</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
