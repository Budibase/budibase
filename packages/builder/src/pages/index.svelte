<script>
  import { redirect } from "@roxi/routify"
  import { auth } from "@/stores/portal"
  import { onMount } from "svelte"
  import { notifications } from "@budibase/bbui"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
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
