<script>
  import { Button } from "@budibase/bbui"
  import { auth, admin, licensing } from "@/stores/portal"
  import { sdk } from "@budibase/shared-core"
  import { bb } from "@/stores/bb"
</script>

{#if !$licensing.isEnterprisePlan && !$licensing.isEnterpriseTrial}
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
    <Button cta size="M" on:click={() => bb.settings("/upgrade")} on:click>
      Upgrade
    </Button>
  {/if}
{/if}
