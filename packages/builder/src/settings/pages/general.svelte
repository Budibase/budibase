<script>
  import {
    Layout,
    Divider,
    Heading,
    Body,
    Button,
    Modal,
    Icon,
  } from "@budibase/bbui"
  import UpdateAppForm from "@/components/common/UpdateAppForm.svelte"
  import { isOnlyUser, appStore, deploymentStore } from "@/stores/builder"
  import VersionModal from "@/components/deploy/VersionModal.svelte"
  import { appsStore, admin } from "@/stores/portal"
  import ExportAppModal from "@/components/start/ExportAppModal.svelte"
  import ImportAppModal from "@/components/start/ImportAppModal.svelte"
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

  $: filteredApps = $appsStore.apps.filter(app => app.devId === $appStore.appId)
  $: selectedApp = filteredApps.length ? filteredApps[0] : {}
  $: updateAvailable = $appStore.upgradableVersion !== $appStore.version
  $: revertAvailable = $appStore.revertableVersion != null

  const exportApp = opts => {
    exportPublishedVersion = !!opts?.published
    exportModal.show()
  }
</script>

<Layout gap="M" noPadding>
  <Heading size="XS">Workspace info</Heading>
  <UpdateAppForm />
  {#if $deploymentStore.isPublished}
    <Divider noMargin />
    <Heading size="S">Deployment</Heading>
    <div class="row top">
      <Icon
        name="check-circle"
        color="var(--spectrum-global-color-green-400)"
        size="L"
      />
      <Body size="S">
        {$deploymentStore.lastPublished}
        <br />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="link" on:click={deploymentStore.viewPublishedApp}>
          View workspace
        </div>
      </Body>
    </div>
    <div class="row">
      <Button warning on:click={unpublishModal?.show}>Unpublish</Button>
      <Button secondary on:click={revertModal?.show}>Revert changes</Button>
    </div>
  {:else}
    <div class="row">
      <Icon
        name="warning"
        color="var(--spectrum-global-color-yellow-400)"
        size="M"
      />
      <Body size="S">
        Your workspace hasn't been published yet and isn't available to users
      </Body>
    </div>
    <div class="row">
      <Button
        cta
        disabled={$deploymentStore.isPublishing}
        on:click={deploymentStore.publishApp}
      >
        Publish
      </Button>
    </div>
  {/if}
  <Divider noMargin id="version" />
  <Layout gap="XS" noPadding>
    <Heading size="XS">Workspace version</Heading>
    {#if $admin.isDev}
      <Body size="S">
        You're running the latest client version from your file system, as
        you're in developer mode.
      </Body>
    {:else if updateAvailable}
      <Body size="S">
        The workspace is currently using version <strong
          >{$appStore.version}</strong
        >
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
            : "Unavailable - another user is editing this workspace"}
        >
          Update version
        </Button>
      </div>
    {:else}
      <Body size="S">
        The workspace is currently using version <strong
          >{$appStore.version}</strong
        >.
        <br />
        You're running the latest!
      </Body>
      {#if revertAvailable}
        <div class="buttons">
          <Button
            secondary
            on:click={versionModal.show}
            disabled={!$isOnlyUser}
            tooltip={$isOnlyUser
              ? null
              : "Unavailable - another user is editing this workspace"}
          >
            Revert version
          </Button>
        </div>
      {/if}
    {/if}
  </Layout>
  <Divider noMargin />
  <Layout noPadding gap="XS">
    <Heading size="XS">Export</Heading>
    <Body size="S">
      Export your workspace for backup or to share it with someone else
    </Body>
  </Layout>
  <div class="row">
    <Button secondary on:click={() => exportApp({ published: false })}>
      Export latest edited workspace
    </Button>
    <Button
      secondary
      disabled={!$deploymentStore.isPublished}
      on:click={() => exportApp({ published: true })}
    >
      Export latest published workspace
    </Button>
  </div>
  <Divider noMargin />
  <Layout noPadding gap="XS">
    <Heading size="XS">Import</Heading>
    <Body size="S"
      >Import a workspace export bundle to update this workspace</Body
    >
  </Layout>
  <div class="row">
    <Button secondary on:click={importModal?.show}>Import workspace</Button>
  </div>
  <Divider noMargin />
  <Heading size="XS">Danger zone</Heading>
  <div class="row">
    <Button
      warning
      disabled={!$isOnlyUser}
      on:click={() => {
        deleteModal.show()
      }}
      tooltip={$isOnlyUser
        ? undefined
        : "Unavailable - another user is editing this workspace"}
    >
      Delete workspace
    </Button>
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
  okText="Unpublish workspace"
  onOk={deploymentStore.unpublishApp}
>
  Are you sure you want to unpublish the workspace <b>{selectedApp?.name}</b>?
</ConfirmDialog>

<RevertModal bind:this={revertModal} />

<DeleteModal
  bind:this={deleteModal}
  appId={$appStore.appId}
  appName={$appStore.name}
/>

<style>
  .row {
    display: flex;
    gap: var(--spacing-m);
  }
  .buttons {
    margin-top: var(--spacing-xl);
  }
</style>
