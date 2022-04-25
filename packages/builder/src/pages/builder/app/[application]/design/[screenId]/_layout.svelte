<script>
  import { IconSideNav, IconSideNavItem } from "@budibase/bbui"
  import { params, goto, redirect, isActive } from "@roxi/routify"
  import { store, allScreens } from "builderStore"
  import { syncURLToState } from "helpers/urlStateSync"
  import { onDestroy } from "svelte"

  // Keep URL and state in sync for selected screen ID
  const unsync = syncURLToState({
    keys: [
      {
        url: "screenId",
        state: "selectedScreenId",
        validate: screenId => $allScreens.some(x => x._id === screenId),
        fallbackUrl: "../",
      },
    ],
    store,
    params,
    goto,
    redirect,
  })

  onDestroy(unsync)
</script>

<!-- routify:options index=1 -->
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
      <IconSideNavItem
        icon="Experience"
        tooltip="Layouts"
        active={$isActive("./layouts")}
        on:click={() => $goto("./layouts")}
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
  .icon-nav {
    background: var(--background);
    border-right: var(--border-light);
  }
  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
