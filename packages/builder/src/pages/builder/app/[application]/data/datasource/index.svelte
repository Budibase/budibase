<script>
  import { datasources } from "stores/backend"
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    const { list, selected, hasData } = $datasources
    if (selected) {
      $redirect(`./${selected?._id}`)
    } else if (hasData && list?.length) {
      $redirect(`./${list[0]._id}`)
    } else {
      $redirect("../new")
    }
  })
</script>

{#if !$datasources.list?.length}
  <i>Connect your first datasource to start building.</i>
{:else}<i>Select a datasource to edit</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
