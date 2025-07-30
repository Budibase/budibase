<script lang="ts">
  import {
    contextMenuStore,
    workspaceAppStore,
    workspaceDeploymentStore,
  } from "@/stores/builder"
  import {
    type PublishStatusResource,
    type WorkspaceApp,
  } from "@budibase/types"
  import {
    AbsTooltip,
    ActionButton,
    Button,
    Helpers,
    Icon,
    notifications,
  } from "@budibase/bbui"
  import HeroBanner from "@/components/common/HeroBanner.svelte"
  import AppsHero from "assets/apps-hero-x1.png"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import WorkspaceAppModal from "@/pages/builder/app/[application]/design/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte"
  import { capitalise, confirm, durationFromNow } from "@/helpers"
  import TopBar from "@/components/common/TopBar.svelte"
  import { BannerType } from "@/constants/banners"

  enum Filter {
    All = "All apps",
    Published = "Published",
    Drafts = "Drafts",
  }

  let showHighlight = false
  let filter = Filter.All
  let selectedWorkspaceApp: WorkspaceApp | undefined = undefined
  let workspaceAppModal: WorkspaceAppModal

  const onDelete = async (workspaceApp: WorkspaceApp) => {
    contextMenuStore.close()
    await confirm({
      title: "Confirm Deletion",
      body: `Deleting "${workspaceApp.name}" cannot be undone. Are you sure?`,
      okText: "Delete app",
      warning: true,
      onConfirm: async () => {
        try {
          await workspaceAppStore.delete(workspaceApp._id!, workspaceApp._rev!)
          notifications.success(
            `App '${workspaceApp.name}' deleted successfully`
          )
        } catch (e: any) {
          let message = "Error deleting app"
          if (e.message) {
            message += ` - ${e.message}`
          }
          notifications.error(message)
        }
      },
    })
  }

  const getContextMenuOptions = (workspaceApp: WorkspaceApp) => {
    return [
      {
        icon: "pencil",
        name: "Edit",
        visible: true,
        callback: () => workspaceAppModal.show(),
      },
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
        callback: () => onDelete(workspaceApp),
      },
    ]
  }

  const openContextMenu = (e: MouseEvent, workspaceApp: WorkspaceApp) => {
    e.preventDefault()
    e.stopPropagation()
    selectedWorkspaceApp = workspaceApp
    showHighlight = true
    contextMenuStore.open(
      "workspace-app",
      getContextMenuOptions(workspaceApp),
      {
        x: e.clientX,
        y: e.clientY,
      },
      () => {
        showHighlight = false
      }
    )
  }

  const createApp = () => {
    selectedWorkspaceApp = undefined
    workspaceAppModal.show()
  }

  const findDeployment = (
    deployments: Record<string, PublishStatusResource>,
    app: WorkspaceApp
  ): PublishStatusResource => {
    return deployments[app._id!]
  }
</script>

<div class="apps-index">
  <HeroBanner
    key={BannerType.APPS}
    title="Build modern apps and forms to power your workflows"
    linkTitle="App building 101"
    linkHref="https://docs.budibase.com/docs/quickstart"
    image={AppsHero}
    color="#732B00"
  >
    Transform internal workflows with modern apps and forms. Connect SQL, REST
    APIs, or your Budibase automations, and create beautiful interfaces with
    pre-built components in minutes.
  </HeroBanner>

  <TopBar icon="layout" breadcrumbs={[{ text: "Apps" }]} showPublish={false}>
    <Button icon="lightbulb" secondary>Learn</Button>
    <Button cta icon="layout" on:click={createApp}>New app</Button>
  </TopBar>
  <div class="filter">
    {#each Object.values(Filter) as option}
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
    <span>Last updated</span>
    <span></span>
  </div>
  {#each $workspaceAppStore.workspaceApps as app}
    <a
      class="app"
      href={`./design/${app.screens[0]?._id}`}
      on:contextmenu={e => openContextMenu(e, app)}
      class:active={showHighlight && selectedWorkspaceApp === app}
    >
      <div>{app.name}</div>
      <div>
        <PublishStatusBadge
          status={findDeployment($workspaceDeploymentStore.workspaceApps, app)
            .state}
        />
      </div>
      <AbsTooltip text={Helpers.getDateDisplayValue(app.updatedAt)}>
        <span>
          {capitalise(durationFromNow(app.updatedAt || ""))}
        </span>
      </AbsTooltip>
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

<WorkspaceAppModal
  bind:this={workspaceAppModal}
  workspaceApp={selectedWorkspaceApp}
  on:hide={() => (selectedWorkspaceApp = undefined)}
/>

<style>
  .apps-index {
    background: var(--background);
    flex: 1 1 auto;
    --border: 1px solid var(--spectrum-global-color-gray-200);
    overflow: auto;
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
