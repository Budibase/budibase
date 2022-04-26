<script>
  import { IconSideNav, IconSideNavItem } from "@budibase/bbui"
  import { goto, isActive } from "@roxi/routify"
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
</style>
