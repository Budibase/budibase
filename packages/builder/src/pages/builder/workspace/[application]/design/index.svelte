<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import HeroBanner from "@/components/common/HeroBanner.svelte"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import VersionModal from "@/components/deploy/VersionModal.svelte"
  import { BannerType } from "@/constants/banners"
  import { capitalise, durationFromNow } from "@/helpers"
  import FavouriteResourceButton from "@/pages/builder/portal/_components/FavouriteResourceButton.svelte"
  import WorkspaceAppModal from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/_components/WorkspaceApp/WorkspaceAppModal.svelte"
  import {
    appStore,
    contextMenuStore,
    isOnlyUser,
    workspaceAppStore,
    workspaceFavouriteStore,
  } from "@/stores/builder"
  import { admin } from "@/stores/portal"
  import {
    AbsTooltip,
    ActionButton,
    Body,
    Button,
    Helpers,
    Icon,
    notifications,
    StatusLight,
    TooltipPosition,
  } from "@budibase/bbui"
  import {
    PublishResourceState,
    WorkspaceResource,
    type UIWorkspaceApp,
  } from "@budibase/types"
  import AppsHero from "assets/apps-hero-x1.png"
  import NoResults from "../_components/NoResults.svelte"

  type ShowUI = { show: () => void }

  let showHighlight = false
  let filter: PublishResourceState | undefined
  let selectedWorkspaceApp: UIWorkspaceApp | undefined = undefined
  let workspaceAppModal: WorkspaceAppModal
  let confirmDeleteDialog: ConfirmDialog
  let appChangingStatus: string | undefined = undefined
  let versionModal: ShowUI

  $: favourites = workspaceFavouriteStore.lookup
  $: updateAvailable =
    $appStore.upgradableVersion &&
    $appStore.version &&
    $appStore.upgradableVersion !== $appStore.version

  const filters: {
    label: string
    filterValue: PublishResourceState | undefined
  }[] = [
    {
      label: "All apps",
      filterValue: undefined,
    },
    {
      label: "Live",
      filterValue: PublishResourceState.PUBLISHED,
    },
    {
      label: "Off",
      filterValue: PublishResourceState.DISABLED,
    },
  ]

  const deleteWorkspaceApp = async () => {
    if (!selectedWorkspaceApp) {
      return
    }

    try {
      await workspaceAppStore.delete(
        selectedWorkspaceApp._id!,
        selectedWorkspaceApp._rev!
      )

      notifications.success(
        `App '${selectedWorkspaceApp.name}' deleted successfully`
      )
    } catch (e: any) {
      let message = "Error deleting app"
      if (e.message) {
        message += ` - ${e.message}`
      }
      notifications.error(message)
    }
  }

  const getContextMenuOptions = (workspaceApp: UIWorkspaceApp) => {
    const pause = {
      icon: workspaceApp.disabled ? "play-circle" : "pause-circle",
      name: workspaceApp.disabled ? "Switch on" : "Switch off",
      visible: true,
      callback: async () => {
        try {
          appChangingStatus = workspaceApp._id
          await workspaceAppStore.toggleDisabled(
            workspaceApp._id!,
            !workspaceApp.disabled
          )
        } finally {
          appChangingStatus = undefined
        }
      },
    }

    return [
      {
        icon: "pencil",
        name: "Edit",
        visible: true,
        callback: () => workspaceAppModal.show(),
      },
      pause,
      {
        icon: "trash",
        name: "Delete",
        visible: true,
        callback: () => confirmDeleteDialog.show(),
      },
    ]
  }

  const openContextMenu = (e: MouseEvent, workspaceApp: UIWorkspaceApp) => {
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

  $: workspaceApps = $workspaceAppStore.workspaceApps
  $: filteredWorkspaceApps = workspaceApps
    .filter(a => {
      if (!filter) {
        return true
      }

      return a.publishStatus.state === filter
    })
    .map(app => {
      return {
        ...app,
        favourite: $favourites?.[app._id!] ?? {
          resourceType: WorkspaceResource.WORKSPACE_APP,
          resourceId: app._id!,
        },
      }
    })
    .sort((a, b) => {
      const aIsFav = !!a.favourite._id
      const bIsFav = !!b.favourite._id

      // Group by favourite status
      if (aIsFav !== bIsFav) {
        return bIsFav ? 1 : -1
      }

      // Within same group, sort by updatedAt
      return b.updatedAt!.localeCompare(a.updatedAt!)
    })
</script>

<div class="apps-index">
  <HeroBanner
    key={BannerType.APPS}
    title="Build modern apps and forms to power your workflows"
    linkTitle="App building 101"
    linkHref="https://docs.budibase.com/docs/app-building-101"
    image={AppsHero}
    color="#732B00"
  >
    Transform internal workflows with modern apps and forms. Connect SQL, REST
    APIs, or your Budibase automations, and create beautiful interfaces with
    pre-built components in minutes.
  </HeroBanner>

  <TopBar icon="browser" breadcrumbs={[{ text: "Apps" }]} showPublish={false}>
    {#if updateAvailable && $isOnlyUser && !$admin.usingLocalComponentLibs}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="update-version" on:click={versionModal.show}>
        <ActionButton quiet>
          <StatusLight notice />
          Update
        </ActionButton>
      </div>
    {/if}
  </TopBar>
  <div class="secondary-bar">
    <div class="filter">
      {#each filters as option}
        <ActionButton
          quiet
          selected={option.filterValue === filter}
          on:click={() => (filter = option.filterValue)}
          >{option.label}</ActionButton
        >
      {/each}
    </div>

    <div class="action-buttons">
      <Button
        icon="squares-four"
        secondary
        on:click={() => {
          window.open("/builder/apps", "_blank")
        }}
      >
        View app portal
      </Button>
      <Button
        icon="lightbulb"
        secondary
        on:click={() => {
          window.open(
            "https://docs.budibase.com/docs/app-building-101",
            "_blank"
          )
        }}
      >
        Learn
      </Button>
      <Button cta icon="plus" on:click={createApp}>New app</Button>
    </div>
  </div>

  <div class="table-header">
    <span>Name</span>
    <span>Status</span>
    <span>Last updated</span>
    <span></span>
  </div>
  {#each filteredWorkspaceApps as app}
    <a
      class="app"
      class:favourite={app.favourite?._id}
      href={`./design/${app._id}`}
      on:contextmenu={e => openContextMenu(e, app)}
      class:active={showHighlight && selectedWorkspaceApp === app}
    >
      <Body size="S" color="var(--spectrum-global-color-gray-900)"
        >{app.name}</Body
      >
      <div>
        <PublishStatusBadge
          status={app.publishStatus.state}
          loading={appChangingStatus === app._id}
        />
      </div>
      <AbsTooltip text={Helpers.getDateDisplayValue(app.updatedAt)}>
        <span>
          {capitalise(durationFromNow(app.updatedAt || ""))}
        </span>
      </AbsTooltip>
      <div class="actions">
        <div class="ctx-btn">
          <Icon
            name="More"
            size="M"
            hoverable
            on:click={e => openContextMenu(e, app)}
          />
        </div>

        <span class="favourite-btn">
          <FavouriteResourceButton
            favourite={app.favourite}
            position={TooltipPosition.Left}
            noWrap
          />
        </span>
      </div>
    </a>
  {/each}
  {#if !workspaceApps.length}
    <NoResults
      ctaText="Create your first app"
      onCtaClick={createApp}
      resourceType="app"
    >
      No apps yet! Build your first app to get started.
    </NoResults>
  {/if}
</div>

<WorkspaceAppModal
  bind:this={workspaceAppModal}
  workspaceApp={selectedWorkspaceApp}
  on:hide={() => (selectedWorkspaceApp = undefined)}
/>

{#if selectedWorkspaceApp}
  <ConfirmDialog
    bind:this={confirmDeleteDialog}
    okText="Delete App"
    onOk={deleteWorkspaceApp}
    title="Confirm Deletion"
  >
    Deleting <b>{selectedWorkspaceApp.name}</b> cannot be undone. Are you sure?
  </ConfirmDialog>
{/if}

<VersionModal hideIcon bind:this={versionModal} />

<style>
  .apps-index {
    background: var(--background);
    flex: 1 1 auto;
    --border: 1px solid var(--spectrum-global-color-gray-200);
    overflow: auto;
  }
  .secondary-bar {
    padding: 10px 12px;
    border-bottom: var(--border);
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  .filter {
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
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  .app,
  .table-header {
    display: grid;
    grid-template-columns: 1fr 200px 200px 50px;
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

      & .actions > * {
        opacity: 1;
        pointer-events: all;
      }
    }
    &.favourite {
      & .actions .favourite-btn {
        opacity: 1;
      }
    }
  }
  .actions {
    justify-content: flex-end;
    display: flex;
    align-items: center;
    pointer-events: none;
    gap: var(--spacing-xs);
  }

  .actions > * {
    opacity: 0;
    transition: opacity 130ms ease-out;
  }

  .actions .favourite-btn {
    pointer-events: all;
  }

  .update-version :global(.spectrum-ActionButton-label) {
    display: flex;
    gap: var(--spacing-s);
  }
</style>
