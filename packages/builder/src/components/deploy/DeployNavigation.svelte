<script>
  import {
    notifications,
    Popover,
    Layout,
    Heading,
    Body,
    Button,
    Icon,
  } from "@budibase/bbui"
  import { processStringSync } from "@budibase/string-templates"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import analytics, { Events, EventSource } from "analytics"
  import { checkIncomingDeploymentStatus } from "components/deploy/utils"
  import { API } from "api"
  import { onMount } from "svelte"
  import DeployModal from "components/deploy/DeployModal.svelte"
  import { apps } from "stores/portal"

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

<div class="deployment-top-nav">
  {#if isPublished}
    <div class="publish-popover">
      <div bind:this={publishPopoverAnchor}>
        <Icon
          size="M"
          hoverable
          name="Globe"
          tooltip="Your published app"
          on:click={publishPopover.show()}
        />
      </div>
      <Popover
        bind:this={publishPopover}
        align="right"
        disabled={!isPublished}
        dataCy="publish-popover-menu"
        showTip={true}
        anchor={publishPopoverAnchor}
      >
        <Layout gap="M">
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
      </Popover>
    </div>
  {/if}

  {#if !isPublished}
    <Icon
      size="M"
      name="GlobeStrike"
      disabled
      tooltip="Your app has not been published yet"
    />
  {/if}
</div>
<ConfirmDialog
  bind:this={unpublishModal}
  title="Confirm unpublish"
  okText="Unpublish app"
  onOk={confirmUnpublishApp}
  dataCy={"unpublish-modal"}
>
  Are you sure you want to unpublish the app <b>{selectedApp?.name}</b>?
</ConfirmDialog>

<div class="buttons">
  <Button on:click={previewApp} newStyles secondary>Preview</Button>
  <DeployModal onOk={completePublish} />
</div>

<style>
  .publish-popover-actions :global([data-cy="publish-popover-action"]) {
    margin-right: var(--spacing-s);
  }
  :global([data-cy="publish-popover-menu"]) {
    padding: 10px;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
