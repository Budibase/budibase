<script>
  import { store, automationStore, allScreens } from "builderStore"
  import { roles, flags } from "stores/backend"
  import {
    Icon,
    ActionGroup,
    Tabs,
    Tab,
    notifications,
    PopoverMenu,
    Layout,
    Button,
    Heading,
  } from "@budibase/bbui"
  import DeployModal from "components/deploy/DeployModal.svelte"
  import RevertModal from "components/deploy/RevertModal.svelte"
  import VersionModal from "components/deploy/VersionModal.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { API } from "api"
  import { auth, admin, apps } from "stores/portal"
  import { isActive, goto, layout, redirect } from "@roxi/routify"
  import Logo from "assets/bb-emblem.svg"
  import { capitalise } from "helpers"
  import UpgradeModal from "components/upgrade/UpgradeModal.svelte"
  import { onMount, onDestroy } from "svelte"
  import { processStringSync } from "@budibase/string-templates"
  import { checkIncomingDeploymentStatus } from "components/deploy/utils"

  export let application

  // Get Package and set store
  let promise = getPackage()
  let unpublishModal
  let publishPopover
  let notPublishedPopover

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

  $: console.log("Deployments ", deployments)
  $: console.log("Latest Deployments ", latestDeployments)

  $: isPublished =
    selectedApp.deployed && latestDeployments && latestDeployments?.length
      ? true
      : false

  // Sync once when you load the app
  let hasSynced = false
  $: selected = capitalise(
    $layout.children.find(layout => $isActive(layout.path))?.title ?? "data"
  )

  const previewApp = () => {
    window.open(`/${application}`)
  }

  const viewApp = () => {
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
        <button class="home-logo">
          <img
            src={Logo}
            alt="budibase icon"
            on:click={() => $goto(`../../portal/`)}
          />
        </button>

        <div class="tabs">
          <Tabs {selected}>
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

        <!-- This gets all indexable subroutes and sticks them in the top nav. -->
        <ActionGroup />
      </div>
      <div class="toprightnav">
        {#if $admin.cloud && $auth.user.account}
          <UpgradeModal />
        {/if}
        <VersionModal />
        <RevertModal />
        <Icon name="Play" hoverable on:click={previewApp} />

        <PopoverMenu
          bind:this={publishPopover}
          align="right"
          disabled={!isPublished}
        >
          <div slot="control" class="icon">
            <Icon
              size="M"
              hoverable
              name={isPublished ? "Globe" : "GlobeStrike"}
              disabled={!isPublished}
            />
          </div>
          <Layout gap="M">
            <Heading size="XS">Your app is live!</Heading>
            <div class="publish-popover-message">
              {#if isPublished}
                {processStringSync(
                  "Last Published: {{ duration time 'millisecond' }} ago",
                  {
                    time:
                      new Date().getTime() -
                      new Date(latestDeployments[0].updatedAt).getTime(),
                  }
                )}
              {/if}
            </div>
            <div class="publish-popover-actions">
              <Button
                warning={true}
                icon="Globe"
                disabled={!isPublished}
                on:click={unpublishApp}
                dataCy="publish-popover-action"
              >
                Unpublish
              </Button>
              <Button cta on:click={viewApp}>View App</Button>
            </div>
          </Layout>
        </PopoverMenu>

        <DeployModal onOk={completePublish} />
      </div>
    </div>
    <slot />
    <ConfirmDialog
      bind:this={unpublishModal}
      title="Confirm unpublish"
      okText="Unpublish app"
      onOk={confirmUnpublishApp}
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
    flex: 0 0 auto;
    background: var(--background);
    padding: 0 var(--spacing-xl);
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    border-bottom: var(--border-light);
  }

  .toprightnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .topleftnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .tabs {
    display: flex;
    position: relative;
    margin-bottom: -1px;
  }

  .home-logo {
    border-style: none;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    outline: none;
    padding: 0 10px 0 0;
    align-items: center;
    height: 32px;
  }

  .home-logo:active {
    outline: none;
  }

  .home-logo img {
    height: 30px;
  }
</style>
