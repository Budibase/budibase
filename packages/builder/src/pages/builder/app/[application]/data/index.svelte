<script lang="ts">
  import { redirect } from "@roxi/routify"
  import { TableNames } from "@/constants"
  import { datasources } from "@/stores/builder"
  import { onMount } from "svelte"

  onMount(() => {
    // Get first valid table ID of first datasource
    let tableId: string = TableNames.USERS
    for (let ds of $datasources.list) {
      if (Array.isArray(ds.entities) && ds.entities.length > 0) {
        if (ds.entities[0]._id) {
          tableId = ds.entities[0]._id
          break
        }
      } else {
        const keys = Object.keys(ds.entities || {})
        if (keys.length > 0) {
          tableId = keys[0]
          break
        }
      }
    }
    if ($datasources.hasData) {
      $redirect(`./table/${tableId}`)
    } else {
      $redirect("./new")
    }
  })
</script>
