<script>
  import { Button } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { auth, admin, licensing } from "stores/portal"
  import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"
  import { _ } from "lang/i18n"
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
      {$_("pages.builder.portal._components.UpgradeButton.Upgrade")}
    </Button>
  {:else if !$admin.cloud && $auth.isAdmin}
    <Button
      cta
      size="S"
      on:click={() => $goto("/builder/portal/account/upgrade")}
      on:click
    >
      {$_("pages.builder.portal._components.UpgradeButton.Upgrade")}
    </Button>
  {/if}
{/if}
