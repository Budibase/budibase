<script>
  import { apps, sideBarCollapsed, auth } from "stores/portal"
  import { params, goto } from "@roxi/routify"
  import NavItem from "components/common/NavItem.svelte"
  import NavHeader from "components/common/NavHeader.svelte"
  import AppRowContext from "components/start/AppRowContext.svelte"
  import { AppStatus } from "constants"
  import { sdk } from "@budibase/shared-core"

  let searchString
  let opened

  $: filteredApps = $apps
    .filter(app => {
      return (
        !searchString ||
        app.name.toLowerCase().includes(searchString.toLowerCase())
      )
    })
    .map(app => {
      return {
        ...app,
        deployed: app.status === AppStatus.DEPLOYED,
      }
    })
    .sort((a, b) => {
      const lowerA = a.name.toLowerCase()
      const lowerB = b.name.toLowerCase()
      return lowerA > lowerB ? 1 : -1
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
      <NavItem
        text={app.name}
        icon={app.icon?.name || "Apps"}
        iconColor={app.icon?.color}
        selected={$params.appId === app.appId}
        highlighted={opened == app.appId}
        on:click={() => $goto(`./${app.appId}`)}
      >
        {#if sdk.users.isBuilder($auth.user, app?.devId)}
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
        {/if}
      </NavItem>
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
</style>
