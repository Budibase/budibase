<script>
  import { Page } from "@budibase/bbui"
  import { SideNav, SideNavItem, Content } from "components/portal/page"
  import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"
  import { isActive, url } from "@roxi/routify"

  $: wide = $isActive("./users/index") || $isActive("./groups/index")
</script>

<Page>
  <Content narrow={!wide}>
    <div slot="side-nav">
      <SideNav>
        <SideNavItem
          text="Users"
          url={$url("./users")}
          active={$isActive("./users")}
        />
        <!--{#if isEnabled(TENANT_FEATURE_FLAGS.USER_GROUPS)}-->
        <SideNavItem
          text="Groups"
          url={$url("./groups")}
          active={$isActive("./groups")}
        />
        <!--{/if}-->
      </SideNav>
    </div>
    <slot />
  </Content>
</Page>
