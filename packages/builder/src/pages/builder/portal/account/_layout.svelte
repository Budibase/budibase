<script>
  import { url, isActive } from "@roxi/routify"
  import { Page } from "@budibase/bbui"
  import { Content, SideNav, SideNavItem } from "components/portal/page"
  import { admin, auth } from "stores/portal"
</script>

<Page narrow>
  <Content>
    <div slot="side-nav">
      <SideNav>
        <!-- Always show usage in self-host or cloud if licensing enabled-->
        <SideNavItem
          text="Usage"
          url={$url("./usage")}
          active={$isActive("./usage")}
        />
        <!-- Show the relevant hosting upgrade page-->
        {#if $admin.cloud && $auth?.user?.accountPortalAccess}
          <SideNavItem
            text="Upgrade"
            url={$admin.accountPortalUrl + "/portal/upgrade"}
          />
        {:else if !$admin.cloud && admin}
          <SideNavItem
            text="Upgrade"
            url={$url("./upgrade")}
            active={$isActive("./upgrade")}
          />
        {/if}
        <!-- Show the billing page to licensed account holders in cloud -->
        {#if $auth?.user?.accountPortalAccess && $auth.user.account.stripeCustomerId}
          <SideNavItem
            text="Billing"
            url={$admin.accountPortalUrl + "/portal/billing"}
          />
        {/if}
      </SideNav>
    </div>
    <slot />
  </Content>
</Page>
