<script>
  import { goto } from "@roxi/routify"
  import {
    Layout,
    Page,
    Button,
    ButtonGroup,
    Heading,
    Tab,
    Tabs,
    notifications,
    ProgressCircle,
  } from "@budibase/bbui"
  import OverviewTab from "../_components/OverviewTab.svelte"
  import SettingsTab from "../_components/SettingsTab.svelte"
  import { API } from "api"
  import { store } from "builderStore"
  import { apps, auth } from "stores/portal"
  import analytics, { Events, EventSource } from "analytics"
  import { AppStatus } from "constants"
  import AppLockModal from "components/common/AppLockModal.svelte"
  import EditableIcon from "components/common/EditableIcon.svelte"
  import HistoryTab from "components/portal/overview/HistoryTab.svelte"
  import { checkIncomingDeploymentStatus } from "components/deploy/utils"
  import { onDestroy, onMount } from "svelte"

  export let application

  let promise = getPackage()

  // App
  $: filteredApps = $apps.filter(app => app.devId === application)
  $: selectedApp = filteredApps?.length ? filteredApps[0] : null

  // Locking
  $: lockedBy = selectedApp?.lockedBy
  $: lockedByYou = $auth.user.email === lockedBy?.email
  $: lockIdentifer = `${
    lockedBy && Object.prototype.hasOwnProperty.call(lockedBy, "firstName")
      ? lockedBy?.firstName
      : lockedBy?.email
  }`

  // App deployments
  $: deployments = []
  $: latestDeployments = deployments
    .filter(
      deployment =>
        deployment.status === "SUCCESS" && application === deployment.appId
    )
    .sort((a, b) => a.updatedAt > b.updatedAt)

  $: isPublished =
    selectedApp?.status === AppStatus.DEPLOYED && latestDeployments?.length > 0

  $: appUrl = `${window.origin}/app${selectedApp?.url}`
  $: tabs = ["Overview", "Automation History", "Backups", "Settings"]
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

  async function getPackage() {
    try {
      const pkg = await API.fetchAppPackage(application)
      await store.actions.initialise(pkg)
      return pkg
    } catch (error) {
      notifications.error(`Error initialising app: ${error?.message}`)
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
      notifications.error("Error fetching deployment overview")
    }
  }

  const viewApp = () => {
    if (isPublished) {
      analytics.captureEvent(Events.APP.VIEW_PUBLISHED, {
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

  onDestroy(() => {
    store.actions.reset()
  })

  onMount(async () => {
    try {
      if (!apps.length) {
        await apps.load()
      }
      deployments = await fetchDeployments()
    } catch (error) {
      notifications.error("Error initialising app overview")
    }
  })
</script>

<Page wide>
  <Layout noPadding gap="XL">
    <span>
      <Button quiet secondary icon={"ChevronLeft"} on:click={backToAppList}>
        Back
      </Button>
    </span>
    {#await promise}
      <div class="loading">
        <ProgressCircle size="XL" />
      </div>
    {:then _}
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
        </div>
      </div>
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
          />
        </Tab>
        <Tab title="Automation History">
          <HistoryTab appId={selectedApp?._id} />
        </Tab>
        {#if false}
          <Tab title="Backups">
            <div class="container">Backups contents</div>
          </Tab>
        {/if}
        <Tab title="Settings">
          <SettingsTab app={selectedApp} />
        </Tab>
      </Tabs>
    {:catch error}
      <p>Something went wrong: {error.message}</p>
    {/await}
  </Layout>
</Page>

<style>
  .app-url {
    color: var(--spectrum-global-color-gray-600);
  }
  .loading {
    display: flex;
    justify-content: center;
  }
  .overview-header {
    display: flex;
    justify-content: space-between;
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
</style>
