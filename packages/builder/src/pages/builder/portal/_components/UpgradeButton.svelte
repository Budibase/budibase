<script>
import { Button } from "@budibase/bbui"
import { sdk } from "@budibase/shared-core"
import { goto } from "@roxi/routify"
import { TENANT_FEATURE_FLAGS, isEnabled } from "helpers/featureFlags"
import { admin, auth, licensing } from "stores/portal"
</script>

{#if isEnabled(TENANT_FEATURE_FLAGS.LICENSING) && !$licensing.isEnterprisePlan && !$licensing.isEnterpriseTrial}
  {#if $admin.cloud && $auth?.user?.accountPortalAccess}
    <Button
      cta
      size="M"
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
      size="M"
      on:click={() => $goto("/builder/portal/account/upgrade")}
      on:click
    >
      Upgrade
    </Button>
  {/if}
{/if}
