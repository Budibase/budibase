<script>
  import { Button } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { auth, admin } from "stores/portal"
</script>

{#if $admin.cloud && $auth?.user?.accountPortalAccess}
  <Button
    cta
    on:click
    on:click={() => {
      $goto($admin.accountPortalUrl + "/portal/upgrade")
    }}
  >
    Upgrade
  </Button>
{:else if !$admin.cloud && $auth.isAdmin}
  <Button
    cta
    on:click={() => $goto("/builder/portal/account/upgrade")}
    on:click
  >
    Upgrade
  </Button>
{/if}
