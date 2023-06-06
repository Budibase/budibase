<script>
  import {
    Content,
    SideNav,
    SideNavItem,
    Breadcrumbs,
    Breadcrumb,
    Header,
  } from "components/portal/page"
  import {
    Page,
    Layout,
    Button,
    Icon,
    ActionMenu,
    MenuItem,
    Helpers,
    Input,
    Modal,
    notifications,
  } from "@budibase/bbui"
  import EditableIcon from "components/common/EditableIcon.svelte"
  import { url, isActive, goto } from "@roxi/routify"
  import { apps } from "stores/portal"
</script>

<!-- routify:options index=4 -->
<div class="settings">
  <Page>
    <Layout noPadding gap="L">
      <Content showMobileNav>
        <SideNav slot="side-nav">
          <SideNavItem
            text="Automation History"
            url={$url("./automation-history")}
            active={$isActive("./automation-history")}
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
            text="Name and URL"
            url={$url("./name-and-url")}
            active={$isActive("./name-and-url")}
          />
          <SideNavItem
            text="Version"
            url={$url("./version")}
            active={$isActive("./version")}
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
