<script>
  import { redirect } from "@roxi/routify"
  import { auth } from "stores/portal"

  auth.checkQueryString()

  $: {
    if ($auth.user?.builder?.global) {
      $redirect(`./portal`)
    } else if ($auth.user) {
      $redirect(`./apps`)
    }
  }
</script>
