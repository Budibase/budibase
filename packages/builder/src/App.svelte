<script>
  import Modal from "svelte-simple-modal"
  import { onMount } from "svelte"
  import { Router, basepath } from "@sveltech/routify"
  import { routes } from "../routify/routes"
  import { store, initialise } from "builderStore"
  import AppNotification, {
    showAppNotification,
  } from "components/common/AppNotification.svelte"

  function showErrorBanner() {
    showAppNotification({
      status: "danger",
      message:
        "Whoops! Looks like we're having trouble. Please refresh the page.",
    })
  }

  onMount(async () => {
    window.addEventListener("error", showErrorBanner)
    window.addEventListener("unhandledrejection", showErrorBanner)
  })

  $basepath = "/_builder"
</script>

<AppNotification />

<Router {routes} />
