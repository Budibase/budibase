<script lang="ts">
  import { Content, SideNav, SideNavItem } from "@/components/portal/page"
  import { Page, Layout, AbsTooltip, TooltipPosition } from "@budibase/bbui"
  import { url, isActive } from "@roxi/routify"
  import DeleteModal from "@/components/deploy/DeleteModal.svelte"
  import { isOnlyUser, appStore } from "@/stores/builder"
  import { featureFlag } from "@/helpers"
  import { FeatureFlag } from "@budibase/types"

  let deleteModal: DeleteModal

  $: oauth2Enabled = featureFlag.isEnabled(FeatureFlag.OAUTH2_CONFIG)
</script>

<!-- routify:options index=4 -->
<div class="settings">
  <Page>
    <Layout noPadding gap="L">
      <Content showMobileNav>
        <SideNav slot="side-nav">
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
            text="Export/Import"
            url={$url("./exportImport")}
            active={$isActive("./exportImport")}
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
          {#if oauth2Enabled}
            <SideNavItem
              text="OAuth2"
              url={$url("./oauth2")}
              active={$isActive("./oauth2")}
            />
          {/if}
          <SideNavItem
            text="App scripts"
            url={$url("./scripts")}
            active={$isActive("./scripts")}
          />
          <div class="delete-action">
            <AbsTooltip
              position={TooltipPosition.Bottom}
              text={$isOnlyUser
                ? undefined
                : "Unavailable - another user is editing this app"}
            >
              <SideNavItem
                text="Delete app"
                disabled={!$isOnlyUser}
                on:click={() => {
                  deleteModal.show()
                }}
              />
            </AbsTooltip>
          </div>
        </SideNav>
        <slot />
      </Content>
    </Layout>
  </Page>
</div>

<DeleteModal
  bind:this={deleteModal}
  appId={$appStore.appId}
  appName={$appStore.name}
/>

<style>
  .delete-action :global(.text) {
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
