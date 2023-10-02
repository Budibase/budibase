<script>
  import { Button } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { auth, admin, licensing } from "stores/portal"
  import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"
  import { sdk } from "@budibase/shared-core"
</script>

{#if isEnabled(TENANT_FEATURE_FLAGS.LICENSING) && !$licensing.isEnterprisePlan}
  {#if $admin.cloud && $auth?.user?.accountPortalAccess}
    <Button
      cta
      size="S"
      on:click
      on:click={() => {
        window.open($admin.accountPortalUrl + "/portal/upgrade", "_blank")
      }}
    >
      Upgrade
    </Button>
  {:else if !$admin.cloud && sdk.users.isAdmin($auth.user)}
    <Button
      cta
      size="S"
      on:click={() => $goto("/builder/portal/account/upgrade")}
      on:click
    >
      Upgrade
    </Button>
  {/if}
{/if}
