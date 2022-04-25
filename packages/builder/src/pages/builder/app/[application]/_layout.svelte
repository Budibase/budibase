<script>
  import { store, automationStore } from "builderStore"
  import { roles, flags } from "stores/backend"
  import {
    Icon,
    Tabs,
    Tab,
    notifications,
    PopoverMenu,
    Layout,
    Button,
    Heading,
    Body,
  } from "@budibase/bbui"
  import DeployModal from "components/deploy/DeployModal.svelte"
  import RevertModal from "components/deploy/RevertModal.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { API } from "api"
  import { auth, apps } from "stores/portal"
  import { isActive, goto, layout, redirect } from "@roxi/routify"
  import { capitalise } from "helpers"
  import { onMount, onDestroy } from "svelte"
  import { processStringSync } from "@budibase/string-templates"
  import { checkIncomingDeploymentStatus } from "components/deploy/utils"
  import analytics, { Events, EventSource } from "analytics"

  export let application

  // Get Package and set store
  let promise = getPackage()
  let unpublishModal
  let publishPopover

  $: enrichedApps = enrichApps($apps, $auth.user)
  const enrichApps = (apps, user) => {
    const enrichedApps = apps
      .map(app => ({
        ...app,
        deployed: app.status === "published",
        lockedYou: app.lockedBy && app.lockedBy.email === user?.email,
        lockedOther: app.lockedBy && app.lockedBy.email !== user?.email,
      }))
      .filter(app => {
        return app.devId === application
      })

    return enrichedApps
  }

  $: selectedApp = enrichedApps.length > 0 ? enrichedApps[0] : {}

  $: deployments = []
  $: latestDeployments = deployments
    .filter(deployment => deployment.status === "SUCCESS")
    .sort((a, b) => a.updatedAt > b.updatedAt)

  $: isPublished =
    selectedApp.deployed && latestDeployments && latestDeployments?.length
      ? true
      : false

  // Sync once when you load the app
  let hasSynced = false

  $: selected = capitalise(
    $layout.children.find(layout => $isActive(layout.path))?.title ?? "data"
  )
  $: appInfo = $apps?.find(app => app.devId === application)
  $: published = appInfo?.status === "published"

  const previewApp = () => {
    window.open(`/${application}`)
  }

  const viewApp = () => {
    analytics.captureEvent(Events.APP.VIEW_PUBLISHED, {
      appId: selectedApp.appId,
      eventSource: EventSource.PORTAL,
    })
    if (selectedApp.url) {
      window.open(`/app${selectedApp.url}`)
    } else {
      window.open(`/${selectedApp.prodId}`)
    }
  }

  async function getPackage() {
    try {
      const pkg = await API.fetchAppPackage(application)
      await store.actions.initialise(pkg)
      await automationStore.actions.fetch()
      await roles.fetch()
      await flags.fetch()
      return pkg
    } catch (error) {
      notifications.error(`Error initialising app: ${error?.message}`)
      $redirect("../../")
    }
  }

  // Handles navigation between frontend, backend, automation.
  // This remembers your last place on each of the sections
  // e.g. if one of your screens is selected on front end, then
  // you browse to backend, when you click frontend, you will be
  // brought back to the same screen.
  const topItemNavigate = path => () => {
    const activeTopNav = $layout.children.find(c => $isActive(c.path))
    if (!activeTopNav) return
    store.update(state => {
      if (!state.previousTopNavPath) state.previousTopNavPath = {}
      state.previousTopNavPath[activeTopNav.path] = window.location.pathname
      $goto(state.previousTopNavPath[path] || path)
      return state
    })
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

  onMount(async () => {
    if (!hasSynced && application) {
      try {
        await API.syncApp(application)
        await apps.load()
      } catch (error) {
        notifications.error("Failed to sync with production database")
      }
      hasSynced = true
    }
    deployments = await fetchDeployments()
  })

  onDestroy(() => {
    store.actions.reset()
  })

  const unpublishApp = () => {
    publishPopover.hide()
    unpublishModal.show()
  }

  const completePublish = async () => {
    try {
      await apps.load()
      deployments = await fetchDeployments()
    } catch (err) {
      notifications.error("Error refreshing app")
    }
  }

  const confirmUnpublishApp = async () => {
    if (!application || !isPublished) {
      //confirm the app has loaded.
      return
    }
    try {
      analytics.captureEvent(Events.APP.UNPUBLISHED, {
        appId: selectedApp.appId,
      })
      await API.unpublishApp(selectedApp.prodId)
      await apps.load()
      notifications.success("App unpublished successfully")
    } catch (err) {
      notifications.error("Error unpublishing app")
    }
  }
</script>

{#await promise}
  <!-- This should probably be some kind of loading state? -->
  <div class="loading" />
{:then _}
  <div class="root">
    <div class="top-nav">
      <div class="topleftnav">
        <Icon
          size="M"
          name="ArrowLeft"
          hoverable
          on:click={() => $goto("../../portal/apps")}
        />
        <Heading size="S">{$store.name || "App"}</Heading>
      </div>
      <div class="topcenternav">
        <Tabs {selected} size="M">
          {#each $layout.children as { path, title }}
            <Tab
              quiet
              selected={$isActive(path)}
              on:click={topItemNavigate(path)}
              title={capitalise(title)}
            />
          {/each}
        </Tabs>
      </div>
      <div class="toprightnav">
        <RevertModal />
        <Icon
          name="Visibility"
          hoverable
          on:click={previewApp}
          tooltip="View app preview"
        />
        {#if isPublished}
          <PopoverMenu
            bind:this={publishPopover}
            align="right"
            disabled={!isPublished}
            dataCy="publish-popover-menu"
          >
            <div slot="control" class="icon app-status-icon">
              <Icon
                size="M"
                hoverable
                name="Globe"
                disabled={!isPublished}
                tooltip="Your published app"
              />
            </div>
            <Layout gap="M">
              <Heading size="XS">Your published app</Heading>
              <Body size="S">
                {#if isPublished}
                  {processStringSync(
                    "Last published {{ duration time 'millisecond' }} ago",
                    {
                      time:
                        new Date().getTime() -
                        new Date(latestDeployments[0].updatedAt).getTime(),
                    }
                  )}
                {/if}
              </Body>
              <div class="publish-popover-actions">
                <Button
                  warning={true}
                  icon="GlobeStrike"
                  disabled={!isPublished}
                  on:click={unpublishApp}
                  dataCy="publish-popover-action"
                >
                  Unpublish
                </Button>
                <Button cta on:click={viewApp}>View app</Button>
              </div>
            </Layout>
          </PopoverMenu>
        {/if}

        {#if !isPublished}
          <Icon
            size="M"
            name="GlobeStrike"
            disabled
            tooltip="Your app has not been published yet"
          />
        {/if}

        <DeployModal onOk={completePublish} />
      </div>
    </div>
    <slot />
    <ConfirmDialog
      bind:this={unpublishModal}
      title="Confirm unpublish"
      okText="Unpublish app"
      onOk={confirmUnpublishApp}
      dataCy={"unpublish-modal"}
    >
      Are you sure you want to unpublish the app <b>{selectedApp?.name}</b>?
    </ConfirmDialog>
  </div>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

<style>
  .publish-popover-actions :global([data-cy="publish-popover-action"]) {
    margin-right: var(--spacing-s);
  }
  .loading {
    min-height: 100%;
    height: 100%;
    width: 100%;
    background: var(--background);
  }
  .root {
    min-height: 100%;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .top-nav {
    flex: 0 0 60px;
    background: var(--background);
    padding: 0 var(--spacing-xl);
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: stretch;
    border-bottom: var(--border-light);
  }

  .topleftnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .topleftnav :global(.spectrum-Heading) {
    font-weight: 600;
  }

  .topcenternav {
    display: flex;
    position: relative;
    margin-bottom: -2px;
  }
  .topcenternav :global(.spectrum-Tabs-itemLabel) {
    font-weight: bold !important;
  }

  .toprightnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }
</style>
