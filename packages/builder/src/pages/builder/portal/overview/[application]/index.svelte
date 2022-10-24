<script>
  import { goto } from "@roxi/routify"
  import {
    Layout,
    Page,
    Button,
    ActionButton,
    ButtonGroup,
    Heading,
    Tab,
    Tabs,
    notifications,
    ProgressCircle,
    Input,
    ActionMenu,
    MenuItem,
    Icon,
    Helpers,
    Modal,
  } from "@budibase/bbui"
  import OverviewTab from "../_components/OverviewTab.svelte"
  import SettingsTab from "../_components/SettingsTab.svelte"
  import AccessTab from "../_components/AccessTab.svelte"
  import { API } from "api"
  import { store } from "builderStore"
  import { apps, auth, groups } from "stores/portal"
  import analytics, { Events, EventSource } from "analytics"
  import { AppStatus } from "constants"
  import AppLockModal from "components/common/AppLockModal.svelte"
  import EditableIcon from "components/common/EditableIcon.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import HistoryTab from "components/portal/overview/automation/HistoryTab.svelte"
  import ExportAppModal from "components/start/ExportAppModal.svelte"
  import { checkIncomingDeploymentStatus } from "components/deploy/utils"
  import { onDestroy, onMount } from "svelte"
  import BackupsTab from "components/portal/overview/backups/BackupsTab.svelte"

  export let application

  let loaded = false
  let deletionModal
  let unpublishModal
  let exportModal
  let appName = ""
  let deployments = []
  let published

  // App
  $: filteredApps = $apps.filter(app => app.devId === application)
  $: selectedApp = filteredApps?.length ? filteredApps[0] : null
  $: loaded && !selectedApp && backToAppList()
  $: isPublished =
    selectedApp?.status === AppStatus.DEPLOYED && latestDeployments?.length > 0
  $: appUrl = `${window.origin}/app${selectedApp?.url}`

  // Locking
  $: lockedBy = selectedApp?.lockedBy
  $: lockedByYou = $auth.user.email === lockedBy?.email
  $: lockIdentifer = `${
    lockedBy && Object.prototype.hasOwnProperty.call(lockedBy, "firstName")
      ? lockedBy?.firstName
      : lockedBy?.email
  }`

  // App deployments
  $: latestDeployments = deployments
    .filter(x => x.status === "SUCCESS" && application === x.appId)
    .sort((a, b) => a.updatedAt > b.updatedAt)

  // Tabs
  $: tabs = ["Overview", "Automation History", "Backups", "Settings", "Access"]
  $: selectedTab = "Overview"

  const backToAppList = () => {
    $goto(`../../../portal/`)
  }

  const handleTabChange = tabKey => {
    if (tabKey === selectedTab) {
      return
    } else if (tabKey && tabs.indexOf(tabKey) > -1) {
      selectedTab = tabKey
    } else {
      notifications.error("Invalid tab key")
    }
  }

  const reviewPendingDeployments = (deployments, newDeployments) => {
    if (deployments.length > 0) {
      const pending = checkIncomingDeploymentStatus(deployments, newDeployments)
      if (pending.length) {
        notifications.warning(
          "Deployment has been queued and will be processed shortly"
        )
      }
    }
  }

  async function fetchDeployments() {
    try {
      const newDeployments = await API.getAppDeployments()
      reviewPendingDeployments(deployments, newDeployments)
      return newDeployments
    } catch (err) {
      notifications.error("Error fetching deployment history")
    }
  }

  const viewApp = () => {
    if (isPublished) {
      analytics.captureEvent(Events.APP_VIEW_PUBLISHED, {
        appId: $store.appId,
        eventSource: EventSource.PORTAL,
      })
      window.open(appUrl, "_blank")
    }
  }

  const editApp = app => {
    if (lockedBy && !lockedByYou) {
      notifications.warning(
        `App locked by ${lockIdentifer}. Please allow lock to expire or have them unlock this app.`
      )
      return
    }
    $goto(`../../../app/${app.devId}`)
  }

  const copyAppId = async app => {
    await Helpers.copyToClipboard(app.prodId)
    notifications.success("App ID copied to clipboard.")
  }

  const exportApp = opts => {
    published = opts.published
    exportModal.show()
  }

  const unpublishApp = app => {
    selectedApp = app
    unpublishModal.show()
  }

  const confirmUnpublishApp = async () => {
    if (!selectedApp) {
      return
    }
    try {
      await API.unpublishApp(selectedApp.prodId)
      await apps.load()
      notifications.success("App unpublished successfully")
    } catch (err) {
      notifications.error("Error unpublishing app")
    }
  }

  const deleteApp = app => {
    selectedApp = app
    deletionModal.show()
  }

  const confirmDeleteApp = async () => {
    if (!selectedApp) {
      return
    }
    try {
      await API.deleteApp(selectedApp?.devId)
      backToAppList()
      notifications.success("App deleted successfully")
    } catch (err) {
      notifications.error("Error deleting app")
    }
    selectedApp = null
    appName = null
  }

  onMount(async () => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("tab")) {
      selectedTab = params.get("tab")
    }

    // Check app exists
    try {
      const pkg = await API.fetchAppPackage(application)
      await store.actions.initialise(pkg)
    } catch (error) {
      // Swallow
      backToAppList()
    }

    // Initialise application
    try {
      await API.syncApp(application)
      deployments = await fetchDeployments()
      await groups.actions.init()
      if (!apps.length) {
        await apps.load()
      }
    } catch (error) {
      notifications.error("Error initialising app overview")
    }
    loaded = true
  })

  onDestroy(() => {
    store.actions.reset()
  })
</script>

<Modal bind:this={exportModal} padding={false} width="600px">
  <ExportAppModal app={selectedApp} {published} />
</Modal>

<span class="overview-wrap">
  <Page wide noPadding>
    {#if !loaded || !selectedApp}
      <div class="loading">
        <ProgressCircle size="XL" />
      </div>
    {:else}
      <Layout paddingX="XXL" paddingY="XL" gap="L">
        <span class="page-header" class:loaded>
          <ActionButton secondary icon={"ArrowLeft"} on:click={backToAppList}>
            Back
          </ActionButton>
        </span>
        <div class="overview-header">
          <div class="app-title">
            <div class="app-logo">
              <div
                class="app-icon"
                style="color: {selectedApp?.icon?.color || ''}"
              >
                <EditableIcon
                  app={selectedApp}
                  size="XL"
                  name={selectedApp?.icon?.name || "Apps"}
                />
              </div>
            </div>
            <div class="app-details">
              <Heading size="M">{selectedApp?.name}</Heading>
              <div class="app-url">{appUrl}</div>
            </div>
          </div>
          <div class="header-right">
            <AppLockModal app={selectedApp} />
            <ButtonGroup gap="XS">
              <Button
                size="M"
                quiet
                secondary
                icon="Globe"
                disabled={!isPublished}
                on:click={viewApp}
                dataCy="view-app"
              >
                View app
              </Button>
              <Button
                size="M"
                cta
                icon="Edit"
                disabled={lockedBy && !lockedByYou}
                on:click={() => {
                  editApp(selectedApp)
                }}
              >
                <span>Edit</span>
              </Button>
            </ButtonGroup>
            <ActionMenu align="right" dataCy="app-overview-menu-popover">
              <span slot="control" class="app-overview-actions-icon">
                <Icon hoverable name="More" />
              </span>
              <MenuItem
                on:click={() => exportApp({ published: false })}
                icon="DownloadFromCloud"
              >
                Export latest
              </MenuItem>
              {#if isPublished}
                <MenuItem
                  on:click={() => exportApp({ published: true })}
                  icon="DownloadFromCloudOutline"
                >
                  Export published
                </MenuItem>
                <MenuItem on:click={() => copyAppId(selectedApp)} icon="Copy">
                  Copy app ID
                </MenuItem>
              {/if}
              {#if !isPublished}
                <MenuItem on:click={() => deleteApp(selectedApp)} icon="Delete">
                  Delete
                </MenuItem>
              {/if}
            </ActionMenu>
          </div>
        </div>
      </Layout>
      <div class="tab-wrap">
        <Tabs
          selected={selectedTab}
          noPadding
          on:select={e => {
            selectedTab = e.detail
          }}
        >
          <Tab title="Overview">
            <OverviewTab
              app={selectedApp}
              deployments={latestDeployments}
              navigateTab={handleTabChange}
              on:unpublish={e => unpublishApp(e.detail)}
            />
          </Tab>
          <Tab title="Access">
            <AccessTab app={selectedApp} />
          </Tab>
          <Tab title="Automation History">
            <HistoryTab app={selectedApp} />
          </Tab>
          <Tab title="Backups">
            <BackupsTab app={selectedApp} />
          </Tab>
          <Tab title="Settings">
            <SettingsTab app={selectedApp} />
          </Tab>
        </Tabs>
      </div>
      <ConfirmDialog
        bind:this={deletionModal}
        title="Confirm deletion"
        okText="Delete app"
        onOk={confirmDeleteApp}
        onCancel={() => (appName = null)}
        disabled={appName !== selectedApp?.name}
      >
        Are you sure you want to delete the app <b>{selectedApp?.name}</b>?

        <p>Please enter the app name below to confirm.</p>
        <Input
          bind:value={appName}
          data-cy="delete-app-confirmation"
          placeholder={selectedApp?.name}
        />
      </ConfirmDialog>
      <ConfirmDialog
        bind:this={unpublishModal}
        title="Confirm unpublish"
        okText="Unpublish app"
        onOk={confirmUnpublishApp}
        dataCy={"unpublish-modal"}
      >
        Are you sure you want to unpublish the app <b>{selectedApp?.name}</b>?
      </ConfirmDialog>
    {/if}
  </Page>
</span>

<style>
  .app-url {
    color: var(--spectrum-global-color-gray-600);
  }
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  .overview-header {
    display: flex;
    justify-content: space-between;
  }

  .page-header.loaded {
    padding: 0px;
  }

  .overview-wrap :global(> div > .container),
  .tab-wrap :global(.spectrum-Tabs) {
    background-color: var(--background);
    background-clip: padding-box;
  }

  @media (max-width: 1000px) {
    .overview-header {
      flex-direction: column;
      gap: var(--spacing-l);
    }
  }
  @media (max-width: 640px) {
    .overview-wrap :global(.content > *) {
      padding: calc(var(--spacing-xl) * 1.5) !important;
    }
  }
  .app-title {
    display: flex;
    gap: var(--spacing-m);
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .app-details :global(.spectrum-Heading) {
    line-height: 1em;
    margin-bottom: var(--spacing-s);
  }
  .tab-wrap :global(> .spectrum-Tabs) {
    padding-left: var(--spectrum-alias-grid-gutter-large);
    padding-right: var(--spectrum-alias-grid-gutter-large);
  }
  .page-header {
    padding-left: var(--spectrum-alias-grid-gutter-large);
    padding-right: var(--spectrum-alias-grid-gutter-large);
    padding-top: var(--spectrum-alias-grid-gutter-large);
  }
</style>
