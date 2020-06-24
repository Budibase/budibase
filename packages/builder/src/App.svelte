<script>
  import Modal from "svelte-simple-modal"
  import { onMount } from "svelte"
  import { Router, basepath } from "@sveltech/routify"
  import { routes } from "../routify/routes"
  import { store, initialise } from "builderStore"
  import NotificationDisplay from "components/common/Notification.svelte";

  $basepath = "/_builder"
</script>


<NotificationDisplay />
<Router {routes} />
