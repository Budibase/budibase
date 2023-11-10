<script>
  import { redirect } from "@roxi/routify"
  import { TableNames } from "constants"
  import { datasources } from "stores/backend"

  $: {
    if ($datasources.hasData) {
      $redirect(`./table/${TableNames.USERS}`)
    } else {
      $redirect("./new")
    }
  }
</script>
