<script>
  import { IconSideNav, IconSideNavItem } from "@budibase/bbui"
  import { params, goto } from "@roxi/routify"
  import { DesignTabs } from "constants"
  import { store } from "builderStore"
  import { syncURLToState } from "helpers/urlStateSync"
  import { onDestroy } from "svelte"

  const updateTab = tab => {
    store.update(state => {
      state.selectedDesignTab = tab
      return state
    })
  }

  const unsync = syncURLToState({
    keys: [
      {
        url: "tab",
        state: "selectedDesignTab",
      },
    ],
    store,
    params,
    goto,
  })

  onDestroy(unsync)
</script>

<!-- routify:options index=1 -->
<div class="design">
  <div class="side-nav">
    <IconSideNav>
      <IconSideNavItem
        icon="WebPage"
        tooltip="Screens"
        active={$store.selectedDesignTab === DesignTabs.SCREENS}
        on:click={() => updateTab(DesignTabs.SCREENS)}
      />
      <IconSideNavItem
        icon="ViewList"
        tooltip="Components"
        active={$store.selectedDesignTab === DesignTabs.COMPONENTS}
        on:click={() => updateTab(DesignTabs.COMPONENTS)}
      />
      <IconSideNavItem
        icon="Brush"
        tooltip="Theme"
        active={$store.selectedDesignTab === DesignTabs.THEME}
        on:click={() => updateTab(DesignTabs.THEME)}
      />
      <IconSideNavItem
        icon="Link"
        tooltip="Navigation"
        active={$store.selectedDesignTab === DesignTabs.NAVIGATION}
        on:click={() => updateTab(DesignTabs.NAVIGATION)}
      />
      <IconSideNavItem
        icon="Experience"
        tooltip="Layouts"
        active={$store.selectedDesignTab === DesignTabs.LAYOUTS}
        on:click={() => updateTab(DesignTabs.LAYOUTS)}
      />
    </IconSideNav>
  </div>

  <div class="content">
    <slot />
  </div>
</div>

<style>
  .design {
    flex: 1 1 auto;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: stretch;
  }
  .side-nav {
    background: var(--background);
    border-right: var(--border-light);
  }
  .content {
    display: flex;
    flex-direction: column;
  }
</style>
