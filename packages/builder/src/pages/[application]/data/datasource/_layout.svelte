<script>
  import { datasources } from 'builderStore/store/backend/'
  import { goto, leftover } from "@sveltech/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    // navigate to first datasource in list, if not already selected
    if (
      !$leftover &&
      $datasources.sources.length > 0 &&
      !$datasources.selected
    ) {
      $goto(`./${$datasources.sources[0]._id}`)
    }
  })
</script>

<slot />
