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
  import { _ } from "../../../lang/i18n"

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
          $_("components.deploy.AppAction.Deployment_queued")
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
      notifications.error($_("components.deploy.AppAction.Error_fetching"))
    }
  }

  const previewApp = () => {
    window.open(`/${application}`)
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
      notifications.success($_("components.deploy.AppAction.App_unpublished"))
    } catch (err) {
      notifications.error($_("components.deploy.AppAction.Error_unpublishing"))
    }
  }

  const completePublish = async () => {
    try {
      await apps.load()
      deployments = await fetchDeployments()
    } catch (err) {
      notifications.error($_("components.deploy.AppAction.Error_refreshing"))
    }
  }

  onMount(async () => {
    if (!$apps.length) {
      await apps.load()
    }
    deployments = await fetchDeployments()
  })
</script>

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
            tooltip={$_("components.deploy.AppAction.Your_app")}
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
              <Heading size="XS"
                >{$_("components.deploy.AppAction.Your_app")}</Heading
              >
              <Body size="S">
                <span class="publish-popover-message">
                  {processStringSync(
                    `${$_(
                      "components.deploy.AppAction.Last_published"
                    )} {{ duration time 'millisecond' }} ${$_(
                      "components.deploy.AppAction.ago"
                    )}`,
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
                  {$_("components.deploy.AppAction.Unpublish")}
                </Button>
                <Button cta on:click={viewApp}
                  >{$_("components.deploy.AppAction.View_app")}</Button
                >
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
        tooltip={$_("components.deploy.AppAction.app_published")}
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
          {$_("components.deploy.AppAction.Users")}
        </ActionButton>
      </span>
    </TourWrap>
  </div>
</div>

<ConfirmDialog
  bind:this={unpublishModal}
  title={$_("components.deploy.AppAction.Confirm_unpublish")}
  okText={$_("components.deploy.AppAction.Unpublish_app")}
  onOk={confirmUnpublishApp}
>
  {$_("components.deploy.AppAction.you want_unpublish")}
  <b>{selectedApp?.name}</b>?
</ConfirmDialog>

<div class="buttons">
  <Button on:click={previewApp} secondary
    >{$_("components.deploy.AppAction.Preview")}</Button
  >
  <DeployModal onOk={completePublish} />
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
