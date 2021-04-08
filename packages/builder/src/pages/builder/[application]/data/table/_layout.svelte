<script>
  import { tables } from "stores/backend"
  import { goto, leftover } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    // navigate to first table in list, if not already selected
    // and this is the final url (i.e. no selectedTable)
    if (
      !$leftover &&
      $tables.list.length > 0 &&
      (!$tables.selected || !$tables.selected._id)
    ) {
      $goto(`./${$tables.list[0]._id}`)
    }
  })
</script>

<slot />
