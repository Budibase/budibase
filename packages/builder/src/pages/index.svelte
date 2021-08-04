<script>
  import { redirect } from "@roxi/routify"
  import { auth } from "../stores/portal"
  import { onMount } from "svelte"

  auth.checkQueryString()

  onMount(() => {
    $redirect(`./builder`)
  })
</script>
