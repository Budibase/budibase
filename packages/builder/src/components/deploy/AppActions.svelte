<script>
  import {
    notifications,
    Popover,
    Layout,
    Heading,
    Body,
    Button,
    ActionButton,
  } from "@budibase/bbui"
  import RevertModal from "components/deploy/RevertModal.svelte"
  import VersionModal from "components/deploy/VersionModal.svelte"
  import { processStringSync } from "@budibase/string-templates"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import analytics, { Events, EventSource } from "analytics"
  import { checkIncomingDeploymentStatus } from "components/deploy/utils"
  import { API } from "api"
  import { onMount } from "svelte"
  import DeployModal from "components/deploy/DeployModal.svelte"
  import { apps } from "stores/portal"
  import { store } from "builderStore"
  import TourWrap from "components/portal/onboarding/TourWrap.svelte"
  import { TOUR_STEP_KEYS } from "components/portal/onboarding/tours.js"

  export let application

  let publishPopover
  let publishPopoverAnchor
  let unpublishModal

  $: filteredApps = $apps.filter(
    app => app.devId === application && app.status === "published"
  )
  $: selectedApp = filteredApps?.length ? filteredApps[0] : null

  $: deployments = []
  $: latestDeployments = deployments
    .filter(deployment => deployment.status === "SUCCESS")
    .sort((a, b) => a.updatedAt > b.updatedAt)

  $: isPublished = selectedApp && latestDeployments?.length > 0

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

  const previewApp = () => {
    store.update(state => ({
      ...state,
      showPreview: true,
    }))
  }

  const viewApp = () => {
    analytics.captureEvent(Events.APP_VIEW_PUBLISHED, {
      appId: selectedApp.appId,
      eventSource: EventSource.PORTAL,
    })
    if (selectedApp.url) {
      window.open(`/app${selectedApp.url}`)
    } else {
      window.open(`/${selectedApp.prodId}`)
    }
  }

  const unpublishApp = () => {
    publishPopover.hide()
    unpublishModal.show()
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

  const completePublish = async () => {
    try {
      await apps.load()
      deployments = await fetchDeployments()
    } catch (err) {
      notifications.error("Error refreshing app")
    }
  }

  onMount(async () => {
    if (!$apps.length) {
      await apps.load()
    }
    deployments = await fetchDeployments()
  })
</script>

{#if $store.hasLock}
  <div class="action-top-nav">
    <div class="action-buttons">
      <div class="version">
        <VersionModal />
      </div>
      <RevertModal />

      {#if isPublished}
        <div class="publish-popover">
          <div bind:this={publishPopoverAnchor}>
            <ActionButton
              quiet
              icon="Globe"
              size="M"
              tooltip="Your published app"
              on:click={publishPopover.show()}
            />
          </div>
          <Popover
            bind:this={publishPopover}
            align="right"
            disabled={!isPublished}
            anchor={publishPopoverAnchor}
            offset={10}
          >
            <div class="popover-content">
              <Layout noPadding gap="M">
                <Heading size="XS">Your published app</Heading>
                <Body size="S">
                  <span class="publish-popover-message">
                    {processStringSync(
                      "Last published {{ duration time 'millisecond' }} ago",
                      {
                        time:
                          new Date().getTime() -
                          new Date(latestDeployments[0].updatedAt).getTime(),
                      }
                    )}
                  </span>
                </Body>
                <div class="buttons">
                  <Button
                    warning={true}
                    icon="GlobeStrike"
                    disabled={!isPublished}
                    on:click={unpublishApp}
                  >
                    Unpublish
                  </Button>
                  <Button cta on:click={viewApp}>View app</Button>
                </div>
              </Layout>
            </div>
          </Popover>
        </div>
      {/if}

      {#if !isPublished}
        <ActionButton
          quiet
          icon="GlobeStrike"
          size="M"
          tooltip="Your app has not been published yet"
          disabled
        />
      {/if}

      <TourWrap
        tourStepKey={$store.onboarding
          ? TOUR_STEP_KEYS.BUILDER_USER_MANAGEMENT
          : TOUR_STEP_KEYS.FEATURE_USER_MANAGEMENT}
      >
        <span id="builder-app-users-button">
          <ActionButton
            quiet
            icon="UserGroup"
            size="M"
            on:click={() => {
              store.update(state => {
                state.builderSidePanel = true
                return state
              })
            }}
          >
            Users
          </ActionButton>
        </span>
      </TourWrap>
    </div>
  </div>

  <ConfirmDialog
    bind:this={unpublishModal}
    title="Confirm unpublish"
    okText="Unpublish app"
    onOk={confirmUnpublishApp}
  >
    Are you sure you want to unpublish the app <b>{selectedApp?.name}</b>?
  </ConfirmDialog>
{/if}

<div class="buttons">
  <Button on:click={previewApp} secondary>Preview</Button>
  {#if $store.hasLock}
    <DeployModal onOk={completePublish} />
  {/if}
</div>

<style>
  /* .banner-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  } */
  .popover-content {
    padding: var(--spacing-xl);
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-l);
  }
  .action-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    /* gap: var(--spacing-s); */
  }
  .version {
    margin-right: var(--spacing-s);
  }
  .action-top-nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
