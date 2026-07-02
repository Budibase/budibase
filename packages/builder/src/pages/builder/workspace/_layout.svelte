<script>
  import { auth } from "@/stores/portal"
  import { redirect } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"

  $redirect

  $: if ($auth.user && !sdk.users.hasBuilderPermissions($auth.user)) {
    $redirect("../apps")
  }
</script>

{#if $auth.user && sdk.users.hasBuilderPermissions($auth.user)}
  <slot />
{/if}
