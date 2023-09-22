<script>
  import {
    notifications,
    Popover,
    Layout,
    Body,
    Button,
    ActionButton,
    Icon,
    Link,
    Modal,
    StatusLight,
    AbsTooltip,
  } from "@budibase/bbui"
  import RevertModal from "components/deploy/RevertModal.svelte"
  import VersionModal from "components/deploy/VersionModal.svelte"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"
  import { processStringSync } from "@budibase/string-templates"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import analytics, { Events, EventSource } from "analytics"
  import { API } from "api"
  import { apps } from "stores/portal"
  import { deploymentStore, store, isOnlyUser } from "builderStore"
  import TourWrap from "components/portal/onboarding/TourWrap.svelte"
  import { TOUR_STEP_KEYS } from "components/portal/onboarding/tours.js"
  import { goto } from "@roxi/routify"

  export let application
  export let loaded

  let unpublishModal
  let updateAppModal
  let revertModal
  let versionModal
  let appActionPopover
  let appActionPopoverOpen = false
  let appActionPopoverAnchor
  let publishing = false

  $: filteredApps = $apps.filter(app => app.devId === application)
  $: selectedApp = filteredApps?.length ? filteredApps[0] : null
  $: latestDeployments = $deploymentStore
    .filter(deployment => deployment.status === "SUCCESS")
    .sort((a, b) => a.updatedAt > b.updatedAt)
  $: isPublished =
    selectedApp?.status === "published" && latestDeployments?.length > 0
  $: updateAvailable =
    $store.upgradableVersion &&
    $store.version &&
    $store.upgradableVersion !== $store.version
  $: canPublish = !publishing && loaded
  $: lastDeployed = getLastDeployedString($deploymentStore)

  const initialiseApp = async () => {
    const applicationPkg = await API.fetchAppPackage($store.devId)
    await store.actions.initialise(applicationPkg)
  }

  const getLastDeployedString = deployments => {
    return deployments?.length
      ? processStringSync("Published {{ duration time 'millisecond' }} ago", {
          time:
            new Date().getTime() - new Date(deployments[0].updatedAt).getTime(),
        })
      : ""
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

  async function publishApp() {
    try {
      publishing = true
      await API.publishAppChanges($store.appId)
      notifications.send("App published successfully", {
        type: "success",
        icon: "GlobeCheck",
      })
      await completePublish()
    } catch (error) {
      console.error(error)
      analytics.captureException(error)
      notifications.error("Error publishing app")
    }
    publishing = false
  }

  const unpublishApp = () => {
    appActionPopover.hide()
    unpublishModal.show()
  }

  const revertApp = () => {
    appActionPopover.hide()
    revertModal.show()
  }

  const confirmUnpublishApp = async () => {
    if (!application || !isPublished) {
      //confirm the app has loaded.
      return
    }
    try {
      await API.unpublishApp(selectedApp.prodId)
      await apps.load()
      notifications.send("App unpublished", {
        type: "success",
        icon: "GlobeStrike",
      })
    } catch (err) {
      notifications.error("Error unpublishing app")
    }
  }

  const completePublish = async () => {
    try {
      await apps.load()
      await deploymentStore.actions.load()
    } catch (err) {
      notifications.error("Error refreshing app")
    }
  }
</script>

<div class="action-top-nav">
  <div class="action-buttons">
    {#if updateAvailable && $isOnlyUser}
      <div class="app-action-button version" on:click={versionModal.show}>
        <div class="app-action">
          <ActionButton quiet>
            <StatusLight notice />
            Update
          </ActionButton>
        </div>
      </div>
    {/if}
    <TourWrap
      tourStepKey={$store.onboarding
        ? TOUR_STEP_KEYS.BUILDER_USER_MANAGEMENT
        : TOUR_STEP_KEYS.FEATURE_USER_MANAGEMENT}
    >
      <div class="app-action-button users">
        <div class="app-action" id="builder-app-users-button">
          <ActionButton
            quiet
            icon="UserGroup"
            on:click={() => {
              store.update(state => {
                state.builderSidePanel = true
                return state
              })
            }}
          >
            Users
          </ActionButton>
        </div>
      </div>
    </TourWrap>

    <div class="app-action-button preview">
      <div class="app-action">
        <ActionButton quiet icon="PlayCircle" on:click={previewApp}>
          Preview
        </ActionButton>
      </div>
    </div>

    <div
      class="app-action-button publish app-action-popover"
      on:click={() => {
        if (!appActionPopoverOpen) {
          appActionPopover.show()
        } else {
          appActionPopover.hide()
        }
      }}
    >
      <div bind:this={appActionPopoverAnchor}>
        <div class="app-action">
          <Icon name={isPublished ? "GlobeCheck" : "GlobeStrike"} />
          <TourWrap tourStepKey={TOUR_STEP_KEYS.BUILDER_APP_PUBLISH}>
            <span class="publish-open" id="builder-app-publish-button">
              Publish
              <Icon
                name={appActionPopoverOpen ? "ChevronUp" : "ChevronDown"}
                size="M"
              />
            </span>
          </TourWrap>
        </div>
      </div>
      <Popover
        bind:this={appActionPopover}
        align="right"
        disabled={!isPublished}
        anchor={appActionPopoverAnchor}
        offset={35}
        on:close={() => {
          appActionPopoverOpen = false
        }}
        on:open={() => {
          appActionPopoverOpen = true
        }}
      >
        <div class="app-action-popover-content">
          <Layout noPadding gap="M">
            <Body size="M">
              <span
                class="app-link"
                on:click={() => {
                  appActionPopover.hide()
                  if (isPublished) {
                    viewApp()
                  } else {
                    updateAppModal.show()
                  }
                }}
              >
                {$store.url}
                {#if isPublished}
                  <Icon size="S" name="LinkOut" />
                {:else}
                  <Icon size="S" name="Edit" />
                {/if}
              </span>
            </Body>

            <Body size="S">
              <span class="publish-popover-status">
                {#if isPublished}
                  <span class="status-text">
                    {lastDeployed}
                  </span>
                  <span class="unpublish-link">
                    <Link quiet on:click={unpublishApp}>Unpublish</Link>
                  </span>
                  <span class="revert-link">
                    <AbsTooltip
                      text={$isOnlyUser
                        ? null
                        : "Unavailable - another user is editing this app"}
                    >
                      <Link
                        disabled={!$isOnlyUser}
                        quiet
                        secondary
                        on:click={revertApp}
                      >
                        Revert
                      </Link>
                    </AbsTooltip>
                  </span>
                {:else}
                  <span class="status-text unpublished">Not published</span>
                {/if}
              </span>
            </Body>
            <div class="action-buttons">
              {#if isPublished}
                <ActionButton
                  quiet
                  icon="Code"
                  on:click={() => {
                    $goto("./settings/embed")
                    appActionPopover.hide()
                  }}
                >
                  Embed
                </ActionButton>
              {/if}
              <Button
                cta
                on:click={publishApp}
                id={"builder-app-publish-button"}
                disabled={!canPublish}
              >
                Publish
              </Button>
            </div>
          </Layout>
        </div>
      </Popover>
    </div>
  </div>
</div>

<!-- Modals -->
<ConfirmDialog
  bind:this={unpublishModal}
  title="Confirm unpublish"
  okText="Unpublish app"
  onOk={confirmUnpublishApp}
>
  Are you sure you want to unpublish the app <b>{selectedApp?.name}</b>?
</ConfirmDialog>

<Modal bind:this={updateAppModal} padding={false} width="600px">
  <UpdateAppModal
    app={{
      name: $store.name,
      url: $store.url,
      icon: $store.icon,
      appId: $store.appId,
    }}
    onUpdateComplete={async () => {
      await initialiseApp()
    }}
  />
</Modal>

<RevertModal bind:this={revertModal} />
<VersionModal hideIcon bind:this={versionModal} />

<style>
  .app-action-popover-content {
    padding: var(--spacing-xl);
    width: 360px;
  }

  .app-action-popover-content :global(.icon svg.spectrum-Icon) {
    height: 0.8em;
  }

  .action-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }

  .action-top-nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }
  .app-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    cursor: pointer;
  }
  .app-action-popover-content .status-text {
    color: var(--spectrum-global-color-green-500);
    border-right: 1px solid var(--spectrum-global-color-gray-500);
    padding-right: var(--spacing-m);
  }
  .app-action-popover-content .status-text.unpublished {
    color: var(--spectrum-global-color-gray-600);
    border-right: 0px;
    padding-right: 0px;
  }
  .app-action-popover-content .action-buttons {
    gap: var(--spacing-m);
  }
  .app-action-popover-content
    .publish-popover-status
    .unpublish-link
    :global(.spectrum-Link) {
    color: var(--spectrum-global-color-red-400);
  }
  .publish-popover-status {
    display: flex;
    gap: var(--spacing-m);
  }
  .app-action-popover .publish-open {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .app-action-button {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: var(--spacing-m);
  }

  .app-action-button.publish:hover {
    background-color: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }

  .app-action-button.publish {
    border-left: var(--border-light);
    padding: 0px var(--spacing-l);
  }

  .app-action-button.version :global(.spectrum-ActionButton-label) {
    display: flex;
    gap: var(--spectrum-actionbutton-icon-gap);
  }

  .app-action {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
</style>
