<script>
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"
  import { datasources } from "stores/backend"

  $: hasData =
    $datasources.list.find(x => (x._id = "bb_internal"))?.entities?.length >
      1 || $datasources.list.length > 1

  onMount(() => {
    if (!hasData) {
      $redirect("./new")
    } else {
      $redirect("./table")
    }
  })
</script>
