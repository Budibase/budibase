<script>
import { sdk } from "@budibase/shared-core"
import { redirect } from "@roxi/routify"
import { auth } from "stores/portal"

auth.checkQueryString()

$: {
  if (sdk.users.hasBuilderPermissions($auth.user)) {
    $redirect(`./portal`)
  } else if ($auth.user) {
    $redirect(`./apps`)
  }
}
</script>
