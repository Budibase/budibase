<script>
  import { redirect } from "@roxi/routify"
  import { auth } from "stores/portal"

  auth.checkQueryString()

  $: {
    if (!$auth.user) {
      $redirect(`./auth`)
    } else if ($auth.user.builder?.global) {
      $redirect(`./portal`)
    } else {
      $redirect(`./apps`)
    }
  }
</script>
