<script>
import { TableNames } from "constants"
import { redirect } from "@roxi/routify"
import { datasources } from "stores/builder"

$: {
  if ($datasources.hasData) {
    $redirect(`./table/${TableNames.USERS}`)
  } else {
    $redirect("./new")
  }
}
</script>
