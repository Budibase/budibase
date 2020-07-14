<script>
  import Modal from "svelte-simple-modal"
  import { onMount } from "svelte"
  import { Router, basepath } from "@sveltech/routify"
  import { routes } from "../routify/routes"
  import { store, initialise } from "builderStore"
  import NotificationDisplay from "components/common/Notification/NotificationDisplay.svelte"
  import { notifier } from "builderStore/store/notifications"

  function showErrorBanner() {
    notifier.danger(
      "Whoops! Looks like we're having trouble. Please refresh the page."
    )
  }

  onMount(async () => {
    // window.addEventListener("error", showErrorBanner)
    // window.addEventListener("unhandledrejection", showErrorBanner)
    await initialise()
  })

  $basepath = "/_builder"
</script>

<NotificationDisplay />
<Router {routes} />
