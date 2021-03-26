<script>
  import { datasources } from 'stores/backend/'
  import { goto, leftover } from "@sveltech/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    // navigate to first datasource in list, if not already selected
    if (
      !$leftover &&
      $datasources.list.length > 0 &&
      !$datasources.selected
    ) {
      $goto(`./${$datasources.list[0]._id}`)
    }
  })
</script>

<slot />
