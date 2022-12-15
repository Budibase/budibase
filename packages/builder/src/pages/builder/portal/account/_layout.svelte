<script>
  import { url, isActive } from "@roxi/routify"
  import { Page } from "@budibase/bbui"
  import { Content, SideNav, SideNavItem } from "components/portal/page"
</script>

<Page narrow>
  <Content>
    <div slot="side-nav">
      <SideNav>
        <SideNavItem
          text="Usage"
          url={$url("./usage")}
          active={$isActive("./usage")}
        />
        <SideNavItem
          text="Upgrade"
          url={$url("./upgrade")}
          active={$isActive("./upgrade")}
        />
      </SideNav>
    </div>
    <slot />
  </Content>
</Page>
