<script lang="ts">
  import {
    sideBarCollapsed,
    enrichedApps,
    agentsStore,
    featureFlags,
    appCreationStore,
    licensing,
  } from "@/stores/portal"
  import { params, goto, page } from "@roxi/routify"
  import NavItem from "@/components/common/NavItem.svelte"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import AppNavItem from "./AppNavItem.svelte"
  import AppLimitModal from "@/components/portal/licensing/AppLimitModal.svelte"
  import { Helpers } from "@budibase/bbui"

  let searchString: string
  let onAgents: boolean = $page.path.endsWith("/agents")
  let openedApp: string | undefined
  let appLimitModal: AppLimitModal

  $: filteredApps = $enrichedApps.filter(app => {
    return (
      !searchString ||
      app.name.toLowerCase().includes(searchString.toLowerCase())
    )
  })

  $: appsOrWorkspaces = $featureFlags.WORKSPACE_APPS ? "workspaces" : "apps"

  const handleAppCreation = () => {
    if ($licensing?.usageMetrics?.apps && $licensing.usageMetrics.apps >= 100) {
      appLimitModal.show()
    } else {
      appCreationStore.showCreateModal()
    }
  }
</script>

<div class="side-bar" class:collapsed={$sideBarCollapsed}>
  <div class="side-bar-controls">
    <NavHeader
      title={Helpers.capitalise(appsOrWorkspaces)}
      placeholder={`Search for ${appsOrWorkspaces}`}
      bind:value={searchString}
      onAdd={handleAppCreation}
    />
  </div>
  <div class="side-bar-nav">
    <NavItem
      icon="browser"
      text={`All ${appsOrWorkspaces}`}
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
  {#if $featureFlags.AI_AGENTS}
    <div class="side-bar-controls">
      <NavHeader
        title="Chats"
        placeholder="Search for agent chats"
        bind:value={searchString}
        onAdd={() => $goto("./agents")}
      />
    </div>
    <div class="side-bar-nav">
      <NavItem
        icon="flow-arrow"
        text="All chats"
        on:click={() => {
          openedApp = undefined
          onAgents = true
          agentsStore.clearCurrentChatId()
          $goto("./agents")
        }}
        selected={!$params.appId &&
          !openedApp &&
          !$agentsStore.currentChatId &&
          onAgents}
      />
      {#each $agentsStore.chats as chat}
        {@const selected = $agentsStore.currentChatId === chat._id}
        <span class="side-bar-app-entry" class:actionsOpen={selected}>
          <NavItem
            icon="git-branch"
            text={chat.title}
            on:click={() => {
              onAgents = true
              openedApp = undefined
              agentsStore.setCurrentChatId(chat._id || "")
              $goto("./agents")
            }}
            {selected}
          />
        </span>
      {/each}
    </div>
  {/if}
</div>

<AppLimitModal bind:this={appLimitModal} />

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
  .side-bar-controls :global(i) {
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
