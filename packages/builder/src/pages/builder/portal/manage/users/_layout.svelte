<script>
  import { Page } from "@budibase/bbui"
  import { auth } from "../../../../../stores/portal"
  import { redirect } from "@roxi/routify"

  // only admins allowed here
  if (!$auth.isAdmin) {
    $redirect("../../../portal")
  }
</script>

<Page>
  <slot />
</Page>
