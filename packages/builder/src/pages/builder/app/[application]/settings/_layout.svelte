<script>
  import { Content, SideNav, SideNavItem } from "components/portal/page"
  import { Page, Layout } from "@budibase/bbui"
  import { url, isActive } from "@roxi/routify"
  import DeleteModal from "components/deploy/DeleteModal.svelte"

  let deleteModal
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
            text="Export"
            url={$url("./export")}
            active={$isActive("./export")}
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
          <div class="delete-action">
            <SideNavItem
              text="Delete app"
              on:click={() => {
                deleteModal.show()
              }}
            />
          </div>
        </SideNav>
        <slot />
      </Content>
    </Layout>
  </Page>
</div>

<DeleteModal bind:this={deleteModal} />

<style>
  .delete-action :global(span) {
    color: var(--spectrum-global-color-red-400);
  }
  .delete-action {
    display: contents;
  }
  .settings {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: 0;
  }
</style>
