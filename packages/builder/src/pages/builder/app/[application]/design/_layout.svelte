<script>
  import { IconSideNav, IconSideNavItem } from "@budibase/bbui"
  import { params, goto } from "@roxi/routify"
  import { DesignTabs } from "constants"
</script>

<!-- routify:options index=1 -->
<div class="design">
  <div class="side-nav">
    <IconSideNav>
      <IconSideNavItem
        icon="WebPage"
        tooltip="Screens"
        active={$params.tab === DesignTabs.SCREENS}
        on:click={() => $goto(`./${DesignTabs.SCREENS}`)}
      />
      <IconSideNavItem
        icon="ViewList"
        tooltip="Components"
        active={$params.tab === DesignTabs.COMPONENTS}
        on:click={() => $goto(`./${DesignTabs.COMPONENTS}`)}
      />
      <IconSideNavItem
        icon="Brush"
        tooltip="Theme"
        active={$params.tab === DesignTabs.THEME}
        on:click={() => $goto(`./${DesignTabs.THEME}`)}
      />
      <IconSideNavItem
        icon="Link"
        tooltip="Navigation"
        active={$params.tab === DesignTabs.NAVIGATION}
        on:click={() => $goto(`./${DesignTabs.NAVIGATION}`)}
      />
      <IconSideNavItem
        icon="Experience"
        tooltip="Layouts"
        active={$params.tab === DesignTabs.LAYOUTS}
        on:click={() => $goto(`./${DesignTabs.LAYOUTS}`)}
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
