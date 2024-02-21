<script>
  import { onMount } from "svelte"
  import { Button } from "@budibase/bbui"
  import { API } from "api"

  onMount(() => {
    API.prompt()
  })
</script>

<div>
  Yeet
</div>