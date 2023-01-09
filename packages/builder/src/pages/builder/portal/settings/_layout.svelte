<script>
  import { url, isActive } from "@roxi/routify"
  import { Page } from "@budibase/bbui"
  import { Content, SideNav, SideNavItem } from "components/portal/page"

  $: narrow = !$isActive("./users/index") && !$isActive("./groups/index")
</script>

<Page narrow>
  <Content>
    <div slot="side-nav">
      <SideNav>
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
      </SideNav>
    </div>
    <slot />
  </Content>
</Page>
