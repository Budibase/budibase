<script>
  import { redirect } from "@roxi/routify"
  import { auth } from "../stores/portal"
  import { onMount } from "svelte"
  import { notifications } from "@budibase/bbui"

  import { _ } from "../../lang/i18n"

  onMount(async () => {
    try {
      await auth.checkQueryString()
    } catch (error) {
      notifications.error($_("pages.index.Error_setting_org"))
    }
    $redirect(`./builder`)
  })
</script>
