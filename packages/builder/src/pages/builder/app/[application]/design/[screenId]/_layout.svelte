<script>
  import { IconSideNav, IconSideNavItem } from "@budibase/bbui"
  import * as routify from "@roxi/routify"
  import AppPanel from "./_components/AppPanel.svelte"
  import { syncURLToState } from "helpers/urlStateSync"
  import { store, selectedScreen } from "builderStore"
  import { onDestroy } from "svelte"
  const { isActive, goto } = routify

  // Keep URL and state in sync for selected screen ID
  const stopSyncing = syncURLToState({
    urlParam: "screenId",
    stateKey: "selectedScreenId",
    validate: id => $store.screens.some(screen => screen._id === id),
    fallbackUrl: "../../design",
    store,
    routify,
  })

  onDestroy(stopSyncing)
</script>

<div class="design">
  <div class="icon-nav">
    <IconSideNav>
      <IconSideNavItem
        icon="WebPage"
        tooltip="Screens"
        active={$isActive("./screens")}
        on:click={() => $goto("./screens")}
      />
      <IconSideNavItem
        icon="ViewList"
        tooltip="Components"
        active={$isActive("./components")}
        on:click={() => $goto("./components")}
      />
      <IconSideNavItem
        icon="Brush"
        tooltip="Theme"
        active={$isActive("./theme")}
        on:click={() => $goto("./theme")}
      />
      <IconSideNavItem
        icon="Link"
        tooltip="Navigation"
        active={$isActive("./navigation")}
        on:click={() => $goto("./navigation")}
      />
      {#if $store.layouts?.length}
        <IconSideNavItem
          icon="Experience"
          tooltip="Layouts"
          active={$isActive("./layouts")}
          on:click={() => $goto("./layouts")}
        />
      {/if}
    </IconSideNav>
  </div>

  <div class="content">
    {#if $selectedScreen}
      <slot />
      <AppPanel />
    {/if}
  </div>
</div>

<style>
  .design {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: 0;
  }
  .icon-nav {
    background: var(--background);
    border-right: var(--border-light);
  }
  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
  }
  /*
    This is hacky, yes, but it's the only way to prevent routify from
    remounting the iframe on route changes.
  */
  .content :global(> *:last-child) {
    order: 1;
  }
  .content :global(> *:first-child) {
    order: 0;
  }
  .content :global(> *:nth-child(2)) {
    order: 2;
  }
</style>
