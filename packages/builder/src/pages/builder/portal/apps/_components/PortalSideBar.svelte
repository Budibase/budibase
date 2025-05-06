<script>
  import { sideBarCollapsed, enrichedApps, agentsStore } from "@/stores/portal"
  import { params, goto, page } from "@roxi/routify"
  import NavItem from "@/components/common/NavItem.svelte"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import AppNavItem from "./AppNavItem.svelte"

  let searchString
  let onAgents = $page.path.endsWith("/agents")
  let openedApp

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
      on:click={() => {
        onAgents = false
        $goto("./")
      }}
      selected={!$params.appId && !onAgents}
    />
    {#each filteredApps as app}
      <span
        class="side-bar-app-entry"
        class:favourite={app.favourite}
        class:actionsOpen={openedApp == app.appId}
      >
        <AppNavItem {app} />
      </span>
    {/each}
  </div>
  <div class="side-bar-controls">
    <NavHeader
      title="Chats"
      placeholder="Search for agent chats"
      bind:value={searchString}
      onAdd={() => $goto("./create")}
    />
  </div>
  <div class="side-bar-nav">
    <NavItem
      icon="Algorithm"
      text="All chats"
      on:click={() => {
        openedApp = undefined
        onAgents = true
        agentsStore.clearCurrentHistoryId()
        $goto("./agents")
      }}
      selected={!$params.appId &&
        !openedApp &&
        !$agentsStore.currentHistoryId &&
        onAgents}
    />
    {#each $agentsStore.history as history}
      {@const selected = $agentsStore.currentHistoryId === history._id}
      <span class="side-bar-app-entry" class:actionsOpen={selected}>
        <NavItem
          icon="Branch1"
          text={history.title}
          on:click={() => {
            onAgents = true
            openedApp = undefined
            agentsStore.setCurrentHistoryId(history._id)
            $goto("./agents")
          }}
          {selected}
        />
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
    flex: 0 1 auto;
    overflow: auto;
    overflow-x: hidden;
  }

  .side-bar-app-entry :global(.nav-item-content .actions) {
    width: auto;
    display: flex;
    gap: var(--spacing-s);
  }
</style>
