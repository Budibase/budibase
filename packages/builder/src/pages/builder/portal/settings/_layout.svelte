<script>
  import { url, isActive } from "@roxi/routify"
  import { Page } from "@budibase/bbui"
  import { Content, SideNav, SideNavItem } from "components/portal/page"
</script>

<Page narrow>
  <Content>
    <div slot="side-nav">
      <SideNav title="Settings">
        <SideNavItem
          text="API Key"
          url={$url("./api")}
          active={$isActive("./api")}
        />
        <SideNavItem
          text="Auth"
          url={$url("./auth")}
          active={$isActive("./auth")}
        />
        <SideNavItem
          text="Email"
          url={$url("./email")}
          active={$isActive("./email")}
        />
        <SideNavItem
          text="Organisation"
          url={$url("./organisation")}
          active={$isActive("./organisation")}
        />
        <SideNavItem
          text="Version"
          url={$url("./version")}
          active={$isActive("./version")}
        />
        <SideNavItem
          text="Theme"
          url={$url("./theme")}
          active={$isActive("./theme")}
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
