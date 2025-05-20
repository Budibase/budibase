<script lang="ts">
  import { Context, Icon } from "@budibase/bbui"
  import { createLocalStorageStore } from "@budibase/frontend-core"
  import { url } from "@roxi/routify"
  import BBLogo from "assets/bb-emblem.svg"
  import { appStore, builderStore } from "@/stores/builder"
  import { featureFlags } from "@/stores/portal"
  import SideNavLink from "./SideNavLink.svelte"
  import SideNavUserSettings from "./SideNavUserSettings.svelte"
  import { onDestroy, setContext } from "svelte"

  setContext(Context.PopoverRoot, ".nav > .popover-container")

  const pinned = createLocalStorageStore("builder-nav-pinned", true)

  let ignoreFocus = false
  let focused = false
  let timeout: ReturnType<typeof setTimeout> | undefined

  $: collapsed = !focused && !$pinned

  // When unpinning, we need to temporarily ignore pointer events, as otherwise
  // we would keep the menu open due to immediately triggering a mouseenter
  $: updateTimeout($pinned)

  const updateTimeout = (pinned: boolean) => {
    if (!pinned) {
      ignoreFocus = true
      focused = false
      timeout = setTimeout(() => {
        ignoreFocus = false
      }, 130)
    }
  }

  const setFocused = (nextFocused: boolean) => {
    if (ignoreFocus) {
      return
    }
    focused = nextFocused
  }

  onDestroy(() => {
    clearTimeout(timeout)
  })
</script>

<div class="nav_wrapper">
  <div class="nav_spacer" class:pinned={$pinned} />
  <div
    class="nav"
    class:pinned={$pinned}
    class:focused
    role="tooltip"
    on:mouseenter={() => setFocused(true)}
    on:mouseleave={() => setFocused(false)}
  >
    <div class="nav_header">
      <img src={BBLogo} alt="Budibase logo" />
      <div class="nav_title">
        <h1>{$appStore.name}</h1>
        <Icon name="ChevronDown" size="XS" />
      </div>
      <Icon
        name="MarginLeft"
        newStyles
        hoverable
        on:click={() => pinned.set(!$pinned)}
      />
    </div>

    <div class="nav_body">
      <div class="links">
        {#if $featureFlags.AI_AGENTS || true}
          <SideNavLink
            icon="Algorithm"
            text="Agent"
            url={$url("./agent")}
            {collapsed}
          />
        {/if}
        <SideNavLink
          icon="RailLeft"
          text="Apps"
          url={$url("./design")}
          {collapsed}
        />
        <SideNavLink
          icon="Workflow"
          text="Automations"
          url={$url("./automation")}
          {collapsed}
        />
        <SideNavLink icon="Data" text="Data" url={$url("./data")} {collapsed} />
      </div>
    </div>

    <div class="links">
      <SideNavLink
        icon="User"
        text="Users"
        on:click={() => {
          builderStore.showBuilderSidePanel()
        }}
        {collapsed}
      />
      <SideNavLink
        icon="Settings"
        text="Settings"
        url={$url("./settings")}
        {collapsed}
      />
      <SideNavUserSettings {collapsed} />
    </div>

    <div class="popover-container"></div>
  </div>
</div>

<style>
  .nav_wrapper {
    display: contents;
    --nav-logo-width: 20px;
    --nav-padding: 12px;
    --nav-collapsed-width: calc(var(--nav-logo-width) + var(--nav-padding) * 2);
    --nav-width: 240px;
    --nav-border: 1px solid var(--spectrum-global-color-gray-200);
  }
  /* Spacer to allow nav to always be absolutely positioned */
  .nav_spacer {
    flex: 0 0 var(--nav-collapsed-width);
  }
  .nav_spacer.pinned {
    display: none;
  }

  /* Main nav*/
  .nav {
    background: var(--background-alt);
    position: absolute;
    width: var(--nav-collapsed-width);
    top: 0;
    left: 0;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-right: var(--nav-border);
    transition: width 130ms ease-out;
    overflow: hidden;
    gap: var(--nav-padding);
    padding-bottom: var(--nav-padding);
    box-sizing: border-box;
  }
  .nav:not(.pinned).focused {
    width: var(--nav-width);
  }
  .nav.pinned {
    position: relative;
    flex: 0 0 var(--nav-width);
    width: var(--nav-width);
  }

  /* Header */
  .nav_header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: 0 0 50px;
    padding: 0 var(--nav-padding);
    gap: var(--spacing-m);
    border-bottom: var(--nav-border);
    color: var(--spectrum-global-color-gray-800);
  }
  .nav_header img {
    width: var(--nav-logo-width);
    filter: grayscale(100%) brightness(1.5);
  }
  .nav_title {
    width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    transition: color 130ms ease-out;
  }
  .nav_title:hover {
    cursor: pointer;
    color: var(--spectrum-global-color-gray-900);
  }
  .nav_title h1 {
    font-size: 18px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  /* Body */
  .nav_body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    flex: 1 1 auto;
    gap: 12px;
  }

  /* Popover container */
  .popover-container {
    position: absolute;
  }

  /*  Links */
  .links {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0 calc(var(--nav-padding) / 2);
    gap: 2px;
  }
</style>
