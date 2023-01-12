<script>
  import { url, isActive } from "@roxi/routify"
  import { Page } from "@budibase/bbui"
  import { Content, SideNav, SideNavItem } from "components/portal/page"
  import { admin } from "stores/portal"

  $: wide = $isActive("./email/:template")
</script>

<Page>
  <Content narrow={!wide}>
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
          text="Environment"
          url={$url("./environment")}
          active={$isActive("./environment")}
        />
        {#if !$admin.cloud}
          <SideNavItem
            text="Version"
            url={$url("./version")}
            active={$isActive("./version")}
          />
        {/if}
      </SideNav>
    </div>
    <slot />
  </Content>
</Page>
