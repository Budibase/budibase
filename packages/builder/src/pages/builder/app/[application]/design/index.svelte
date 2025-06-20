<script lang="ts">
  import {
    componentStore,
    contextMenuStore,
    screenStore,
    workspaceAppStore,
  } from "@/stores/builder"
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag, type WorkspaceApp } from "@budibase/types"
  import { redirect } from "@roxi/routify"
  import { ActionButton, Button, Icon } from "@budibase/bbui"
  import HeroBanner from "@/components/common/HeroBanner.svelte"
  import AppsHero from "assets/apps-hero.png"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"

  enum AppFilter {
    AllApps = "All apps",
    Published = "Published",
    Drafts = "Drafts",
  }

  const ContextMenuItems = [
    {
      icon: "copy",
      name: "Duplicate",
      visible: true,
      disabled: false,
      callback: () => console.log("Duplicate"),
    },
    {
      icon: "pause-circle",
      name: "Unpublish",
      visible: true,
      disabled: false,
      callback: () => console.log("Unpublish"),
    },
    {
      icon: "trash",
      name: "Delete",
      visible: true,
      disabled: false,
      callback: () => console.log("Delete"),
    },
  ]

  let filter = AppFilter.AllApps
  let selectedApp: WorkspaceApp | undefined = undefined

  $: {
    if (!$featureFlags[FeatureFlag.WORKSPACE_APPS]) {
      if ($screenStore.screens.length > 0) {
        $redirect(`./${$screenStore.screens[0]._id}`)
      } else {
        $redirect("./new")
      }
    }
  }

  const openContextMenu = (e: MouseEvent, workspaceApp: WorkspaceApp) => {
    e.preventDefault()
    e.stopPropagation()
    selectedApp = workspaceApp
    contextMenuStore.open(
      "workspace-app",
      ContextMenuItems,
      {
        x: e.clientX,
        y: e.clientY,
      },
      () => {
        selectedApp = undefined
      }
    )
  }
</script>

{#if $featureFlags[FeatureFlag.WORKSPACE_APPS]}
  <div class="apps-index">
    <div class="hero-wrapper">
      <HeroBanner title="Apps" linkTitle="App building 101" image={AppsHero}>
        Create powerful apps and workflows from any datasource and securely
        deploy professional-grade solutions, such as forms, portals and more,
        across your teams.
      </HeroBanner>
    </div>
    <div class="header">
      <Icon name="WebPage"></Icon>
      <h3>Apps</h3>
      <Button icon="Light" secondary>Learn</Button>
      <Button cta icon="WebPage">New app</Button>
    </div>
    <div class="filter">
      {#each Object.values(AppFilter) as option}
        <ActionButton
          quiet
          selected={option === filter}
          on:click={() => (filter = option)}>{option}</ActionButton
        >
      {/each}
    </div>

    <div class="table-header">
      <span>Name</span>
      <span>Status</span>
      <span>Created by</span>
      <span>Last published</span>
      <span></span>
    </div>
    {#each $workspaceAppStore.workspaceApps as app, idx}
      <a
        class="app"
        href={`./design/${app.screens[0]?._id}`}
        on:contextmenu={e => openContextMenu(e, app)}
        class:active={selectedApp === app}
      >
        <div>{app.name}</div>
        <div>
          <PublishStatusBadge status={idx % 2 === 0 ? "published" : "draft"} />
        </div>
        <span>Joe Johnston</span>
        <span>This week</span>
        <div class="actions">
          <Icon
            name="More"
            size="M"
            hoverable
            on:click={e => openContextMenu(e, app)}
          />
        </div>
      </a>
    {/each}
  </div>
{/if}

<style>
  .apps-index {
    background: var(--background);
    flex: 1 1 auto;
    --border: 1px solid var(--spectrum-global-color-gray-200);
  }
  .hero-wrapper {
    margin: 12px 12px 0 12px;
  }
  .header {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 8px;
    align-items: center;
    padding: 10px 10px 10px 20px;
    border-bottom: var(--border);
  }
  h3 {
    font-weight: 510;
    font-size: 18px;
    margin: 0;
  }
  .filter {
    padding: 10px 12px;
    border-bottom: var(--border);
    display: flex;
    gap: 10px;
  }
  .filter :global(.spectrum-ActionButton) {
    border-radius: 8px;
    transition:
      border-color 130ms ease-out,
      background 130ms ease-out;
    border: 1px solid transparent;
    padding: 3px 10px;
    height: auto;

    &.is-selected {
      background: var(--spectrum-global-color-gray-200);
      border-color: var(--spectrum-global-color-gray-300);
    }
  }
  .app,
  .table-header {
    display: grid;
    grid-template-columns: 1fr 200px 200px 200px 50px;
    border-bottom: var(--border);
    align-items: center;
  }
  .table-header {
    padding: 5px 12px;
    color: var(--spectrum-global-color-gray-700);
  }
  .app {
    padding: 9px 12px;
    color: var(--text-color);
    transition: background 130ms ease-out;

    &:hover,
    &.active {
      background: var(--spectrum-global-color-gray-200);

      & .actions {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
  .actions {
    justify-content: flex-end;
    display: flex;
    opacity: 0;
    pointer-events: none;
    transition: opacity 130ms ease-out;
  }
</style>
