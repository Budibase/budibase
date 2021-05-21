<script>
  import { redirect } from "@roxi/routify"
  import { Page } from "@budibase/bbui"
  import { auth } from "../../../../../stores/portal"

  // only admins allowed here
  if (!$auth.isAdmin) {
    $redirect("../../../portal")
  }
</script>

<Page>
  <slot />
</Page>
