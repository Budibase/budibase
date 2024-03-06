<script>
  import { sideBarCollapsed, enriched as enrichedApps } from "stores/portal"
  import { params, goto } from "@roxi/routify"
  import NavItem from "components/common/NavItem.svelte"
  import NavHeader from "components/common/NavHeader.svelte"
  import AppRowContext from "components/start/AppRowContext.svelte"
  import FavouriteAppButton from "../FavouriteAppButton.svelte"

  let searchString
  let opened

  $: filteredApps = $enrichedApps.filter(app => {
    return (
      !searchString ||
      app.name.toLowerCase().includes(searchString.toLowerCase())
    )
  })
</script>

<div class="side-bar" class:collapsed={$sideBarCollapsed}>
  <div class="side-bar-controls">
    <NavHeader
      title="Apps"
      placeholder="Search for apps"
      bind:value={searchString}
      onAdd={() => $goto("./create")}
    />
  </div>
  <div class="side-bar-nav">
    <NavItem
      icon="WebPages"
      text="All apps"
      on:click={() => $goto("./")}
      selected={!$params.appId}
    />
    {#each filteredApps as app}
      <span
        class="side-bar-app-entry"
        class:favourite={app.favourite}
        class:actionsOpen={opened == app.appId}
      >
        <NavItem
          text={app.name}
          icon={app.icon?.name || "Apps"}
          iconColor={app.icon?.color}
          selected={$params.appId === app.appId}
          highlighted={opened == app.appId}
          on:click={() => $goto(`./${app.appId}`)}
          withActions
          showActions
        >
          <div class="app-entry-actions">
            <AppRowContext
              {app}
              align="left"
              on:open={() => {
                opened = app.appId
              }}
              on:close={() => {
                opened = null
              }}
            />
          </div>
          <div class="favourite-icon">
            <FavouriteAppButton {app} size="XS" />
          </div>
        </NavItem>
      </span>
    {/each}
  </div>
</div>

<style>
  .side-bar {
    flex: 0 0 260px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-right: var(--border-light);
    background: var(--spectrum-global-color-gray-100);
    overflow: hidden;
    transition: margin-left 300ms ease-out;
  }
  .side-bar.collapsed {
    margin-left: -262px;
  }
  @media (max-width: 640px) {
    .side-bar {
      margin-left: -262px;
    }
  }

  .side-bar-controls {
    flex: 0 0 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
    padding: 0 var(--spacing-l);
  }
  .side-bar-controls :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-700);
  }

  .side-bar-nav {
    flex: 1 1 auto;
    overflow: auto;
    overflow-x: hidden;
  }

  .side-bar-app-entry :global(.nav-item-content .actions) {
    width: auto;
    display: flex;
    gap: var(--spacing-s);
  }

  .side-bar-app-entry:hover .app-entry-actions,
  .side-bar-app-entry:hover .favourite-icon,
  .side-bar-app-entry.favourite .favourite-icon,
  .side-bar-app-entry.actionsOpen .app-entry-actions,
  .side-bar-app-entry.actionsOpen .favourite-icon {
    opacity: 1;
  }

  .side-bar-app-entry .app-entry-actions,
  .side-bar-app-entry .favourite-icon {
    opacity: 0;
  }
</style>
