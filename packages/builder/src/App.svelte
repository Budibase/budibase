<script>
  import { onMount } from "svelte"
  import { Router } from "@sveltech/routify"
  import { routes } from "@sveltech/routify/tmp/routes"
  import { store, initialise } from "builderStore"
  import AppNotification, {
    showAppNotification,
  } from "components/common/AppNotification.svelte"

  let init = initialise()

  function showErrorBanner() {
    showAppNotification({
      status: "danger",
      message:
        "Whoops! Looks like we're having trouble. Please refresh the page.",
    })
  }

  onMount(() => {
    window.addEventListener("error", showErrorBanner)
    window.addEventListener("unhandledrejection", showErrorBanner)
  })
</script>

<AppNotification />

<Router {routes} />
