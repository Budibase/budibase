<script>
  import { redirect } from "@roxi/routify"
  import { auth } from "@/stores/portal"
  import { sdk } from "@budibase/shared-core"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $redirect

  auth.checkQueryString()

  $: {
    if (sdk.users.hasBuilderPermissions($auth.user)) {
      $redirect(`./portal`)
    } else if ($auth.user) {
      $redirect(`./apps`)
    }
  }
</script>
