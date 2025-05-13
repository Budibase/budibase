<script>
  import {
    Layout,
    Divider,
    Heading,
    Body,
    Button,
    Modal,
    ActionButton,
    Icon,
    notifications,
    TooltipPosition,
    AbsTooltip,
    Link,
  } from "@budibase/bbui"
  import UpdateAppForm from "@/components/common/UpdateAppForm.svelte"
  import {
    isOnlyUser,
    appStore,
    appPublished,
    deploymentStore,
  } from "@/stores/builder"
  import VersionModal from "@/components/deploy/VersionModal.svelte"
  import { appsStore } from "@/stores/portal"
  import ExportAppModal from "@/components/start/ExportAppModal.svelte"
  import ImportAppModal from "@/components/start/ImportAppModal.svelte"
  import { processStringSync } from "@budibase/string-templates"
  import analytics, { Events, EventSource } from "@/analytics"
  import { API } from "@/api"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import RevertModal from "@/components/deploy/RevertModal.svelte"
  import DeleteModal from "@/components/deploy/DeleteModal.svelte"

  let versionModal
  let exportModal
  let importModal
  let exportPublishedVersion = false
  let unpublishModal
  let revertModal
  let deleteModal
  let publishing = false

  $: filteredApps = $appsStore.apps.filter(app => app.devId === $appStore.appId)
  $: selectedApp = filteredApps.length ? filteredApps[0] : {}
  $: lastDeployed = getLastDeployedString($deploymentStore)
  $: updateAvailable = $appStore.upgradableVersion !== $appStore.version

  const exportApp = opts => {
    exportPublishedVersion = !!opts?.published
    exportModal.show()
  }

  const importApp = () => {
    importModal.show()
  }

  const getLastDeployedString = deployments => {
    return deployments?.length
      ? processStringSync(
          "Your app was last published {{ duration time 'millisecond' }} ago",
          {
            time:
              new Date().getTime() -
              new Date(deployments[0].updatedAt).getTime(),
          }
        )
      : ""
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

  const confirmUnpublishApp = async () => {
    if (!selectedApp || !$appPublished) {
      //confirm the app has loaded.
      return
    }
    try {
      await API.unpublishApp(selectedApp.prodId)
      await appsStore.load()
      notifications.send("App unpublished", {
        type: "success",
        icon: "GlobeStrike",
      })
    } catch (err) {
      notifications.error("Error unpublishing app")
    }
  }

  async function publishApp() {
    try {
      publishing = true
      await API.publishAppChanges($appStore.appId)
      notifications.send("App published successfully", {
        type: "success",
        icon: "GlobeCheck",
      })
      await completePublish()
    } catch (error) {
      console.error(error)
      analytics.captureException(error)
      const baseMsg = "Error publishing app"
      const message = error.message
      if (message) {
        notifications.error(`${baseMsg} - ${message}`)
      } else {
        notifications.error(baseMsg)
      }
    }
    publishing = false
  }

  const completePublish = async () => {
    try {
      await appsStore.load()
      await deploymentStore.load()
    } catch (err) {
      notifications.error("Error refreshing app")
    }
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>General settings</Heading>
    <Body>Control app version, deployment and settings</Body>
  </Layout>
  <Divider />
  <Heading size="S">App info</Heading>
  <UpdateAppForm />
  <Divider />
  <Layout gap="XS" noPadding>
    <Heading size="S">App version</Heading>
    {#if updateAvailable}
      <Body>
        The app is currently using version <strong>{$appStore.version}</strong>
        but version <strong>{$appStore.upgradableVersion}</strong> is available.
        <br />
        Updates can contain new features, performance improvements and bug fixes.
      </Body>
      <div class="buttons">
        <Button
          cta
          on:click={versionModal.show}
          disabled={!$isOnlyUser}
          tooltip={$isOnlyUser
            ? null
            : "Unavailable - another user is editing this app"}
        >
          Update version
        </Button>
      </div>
    {:else}
      <Body>
        The app is currently using version <strong>{$appStore.version}</strong>.
        <br />
        You're running the latest!
      </Body>
      <div class="buttons">
        <Button
          secondary
          on:click={versionModal.show}
          tooltip={$isOnlyUser
            ? null
            : "Unavailable - another user is editing this app"}
        >
          Revert version
        </Button>
      </div>
    {/if}
  </Layout>
  <Divider />
  <Heading size="S">Deployment</Heading>
  {#if $appPublished}
    <div class="row top">
      <Icon
        name="CheckmarkCircle"
        color="var(--spectrum-global-color-green-400)"
        size="XL"
      />
      <Body>
        {lastDeployed}
        <br />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="link" on:click={viewApp}>View app</div>
      </Body>
    </div>
    <div class="row">
      <Button warning on:click={unpublishModal?.show}>Unpublish</Button>
      <Button secondary on:click={revertModal?.show}>Revert changes</Button>
    </div>
  {:else}
    <div class="row">
      <Icon
        name="Alert"
        color="var(--spectrum-global-color-yellow-400)"
        size="L"
      />
      <Body>
        Your app hasn't been published yet and isn't available to users
      </Body>
    </div>
    <div class="row">
      <Button cta disabled={publishing} on:click={publishApp}>Publish</Button>
    </div>
  {/if}
  <Divider />
  <Layout noPadding gap="XS">
    <Heading size="S">Export</Heading>
    <Body>Export your app for backup or to share it with someone else</Body>
  </Layout>
  <div class="row">
    <Button secondary on:click={() => exportApp({ published: false })}>
      Export latest edited app
    </Button>
    <Button
      secondary
      disabled={!$appPublished}
      on:click={() => exportApp({ published: true })}
    >
      Export latest published app
    </Button>
  </div>
  <Divider />
  <Layout noPadding gap="XS">
    <Heading size="S">Import</Heading>
    <Body>Import an app export bundle to update this app</Body>
  </Layout>
  <div class="row">
    <Button secondary on:click={() => importApp()}>Import app</Button>
  </div>
  <Divider />
  <Heading size="S">Danger zone</Heading>
  <div class="row">
    <AbsTooltip
      position={TooltipPosition.Bottom}
      text={$isOnlyUser
        ? undefined
        : "Unavailable - another user is editing this app"}
    >
      <Button
        warning
        disabled={!$isOnlyUser}
        on:click={() => {
          deleteModal.show()
        }}>Delete app</Button
      >
    </AbsTooltip>
  </div>
</Layout>

<VersionModal bind:this={versionModal} hideIcon={true} />

<Modal bind:this={exportModal} padding={false}>
  <ExportAppModal app={selectedApp} published={exportPublishedVersion} />
</Modal>

<Modal bind:this={importModal} padding={false}>
  <ImportAppModal app={selectedApp} />
</Modal>

<ConfirmDialog
  bind:this={unpublishModal}
  title="Confirm unpublish"
  okText="Unpublish app"
  onOk={confirmUnpublishApp}
>
  Are you sure you want to unpublish the app <b>{selectedApp?.name}</b>?
</ConfirmDialog>

<RevertModal bind:this={revertModal} />

<DeleteModal
  bind:this={deleteModal}
  appId={$appStore.appId}
  appName={$appStore.name}
/>

<style>
  .link {
    text-decoration: underline;
    color: var(--spectrum-global-color-gray-900);
  }
  .link:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
  .row {
    display: flex;
    gap: var(--spacing-m);
  }
  .row.top {
    align-items: flex-start;
  }
  .buttons {
    margin-top: var(--spacing-xl);
  }
</style>
