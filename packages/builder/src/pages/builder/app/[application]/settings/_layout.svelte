<script lang="ts">
  import { Content, SideNav, SideNavItem } from "@/components/portal/page"
  import { Page, Layout } from "@budibase/bbui"
  import { url, isActive } from "@roxi/routify"
</script>

<!-- routify:options index=4 -->
<div class="settings">
  <Page>
    <Layout noPadding gap="L">
      <Content showMobileNav>
        <SideNav slot="side-nav">
          <SideNavItem
            text="General"
            url={$url("./general")}
            active={$isActive("./general")}
          />
          <SideNavItem
            text="Automations"
            url={$url("./automations")}
            active={$isActive("./automations")}
          />
          <SideNavItem
            text="Backups"
            url={$url("./backups")}
            active={$isActive("./backups")}
          />
          <SideNavItem
            text="Embed"
            url={$url("./embed")}
            active={$isActive("./embed")}
          />
          <SideNavItem
            text="Progressive web app"
            url={$url("./pwa")}
            active={$isActive("./pwa")}
          />
          <SideNavItem
            text="OAuth2"
            url={$url("./oauth2")}
            active={$isActive("./oauth2")}
          />
          <SideNavItem
            text="App scripts"
            url={$url("./scripts")}
            active={$isActive("./scripts")}
          />
        </SideNav>
        <slot />
      </Content>
    </Layout>
  </Page>
</div>

<style>
  .settings {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: 0;
  }
</style>
