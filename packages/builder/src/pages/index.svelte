<script>
  import { redirect } from "@roxi/routify"
  import { auth } from "@/stores/portal"
  import { onMount } from "svelte"
  import { notifications } from "@budibase/bbui"

  $redirect

  onMount(async () => {
    try {
      await auth.checkQueryString()
    } catch (error) {
      notifications.error("Error setting org")
    }
    $redirect(`./builder`)
  })
</script>
