<script lang="ts">
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import UpdateAppForm from "@/components/common/UpdateAppForm.svelte"
  import DeleteModal from "@/components/deploy/DeleteModal.svelte"
  import RevertModal from "@/components/deploy/RevertModal.svelte"
  import VersionModal from "@/components/deploy/VersionModal.svelte"
  import ExportAppModal from "@/components/start/ExportAppModal.svelte"
  import ImportAppModal from "@/components/start/ImportAppModal.svelte"
  import {
    appStore,
    deploymentStore,
    isOnlyUser,
    recaptchaStore,
  } from "@/stores/builder"
  import { admin, licensing } from "@/stores/portal"
  import {
    Body,
    Button,
    Divider,
    Heading,
    Icon,
    Layout,
    Modal,
    notifications,
  } from "@budibase/bbui"

  let versionModal: VersionModal
  let exportModal: Modal
  let importModal: Modal
  let exportPublishedVersion: boolean = false
  let unpublishModal: ConfirmDialog
  let revertModal: RevertModal
  let deleteModal: DeleteModal

  $: updateAvailable = $appStore.upgradableVersion !== $appStore.version
  $: revertAvailable = $appStore.revertableVersion != null
  $: appRecaptchaEnabled = $recaptchaStore.enabled

  const exportApp = (opts: { published: any }) => {
    exportPublishedVersion = !!opts?.published
    exportModal.show()
  }

  const updateRecaptcha = async () => {
    try {
      const newState = !appRecaptchaEnabled
      await recaptchaStore.setState(newState)
      notifications.success(`Recaptcha ${newState ? "enabled" : "disabled"}`)
    } catch (err: any) {
      notifications.error(`Failed to set recaptcha state: ${err.message}`)
    }
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>General settings</Heading>
    <Body>Control client version, workspace deployment and settings</Body>
  </Layout>
  <Divider />
  <Heading size="S">Workspace info</Heading>
  <UpdateAppForm />
  {#if $deploymentStore.isPublished}
    <Divider />
    <Heading size="S">Deployment</Heading>
    <div class="row top">
      <Icon
        name="check-circle"
        color="var(--spectrum-global-color-green-400)"
        size="L"
      />
      <Body size="S">
        {$deploymentStore.lastPublished}
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
        You haven't published yet, so your apps and automations are not
        available to users
      </Body>
    </div>
    <div class="row">
      <Button
        icon="arrow-circle-up"
        primary
        disabled={$deploymentStore.isPublishing}
        on:click={() => deploymentStore.publishApp()}
      >
        Publish
      </Button>
    </div>
  {/if}
  <Divider id="version" />
  <Layout gap="XS" noPadding>
    <Heading size="S">Client version</Heading>
    {#if $admin.usingLocalComponentLibs}
      <Body size="S">
        You're running the latest client version from your file system, as
        you're in developer mode.
        <br />
        Use the env var DEV_USE_CLIENT_FROM_STORAGE to load from minio instead.
      </Body>
    {:else if updateAvailable}
      <Body size="S">
        The workspace is currently using version
        <strong>{$appStore.version}</strong>
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
      <Body size="S">
        The workspace is currently using version
        <strong>{$appStore.version}</strong>.
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
              : "Unavailable - another user is editing this app"}
          >
            Revert version
          </Button>
        </div>
      {/if}
    {/if}
  </Layout>
  <Divider />
  <Layout noPadding gap="XS">
    <Heading size="S">Export</Heading>
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
  <Divider />
  <Layout noPadding gap="XS">
    <Heading size="S">Import</Heading>
    <Body size="S">Import an export bundle to update this workspace</Body>
  </Layout>
  <div class="row">
    <Button secondary on:click={importModal?.show}>Import workspace</Button>
  </div>
  <Divider />
  <Layout noPadding gap="XS">
    <div class="row">
      <Heading size="S">Recaptcha</Heading>
      {#if !$licensing.recaptchaEnabled}
        <Icon name="lock" />
      {/if}
    </div>
    {#if !$licensing.recaptchaEnabled}
      <Body size="S"
        >Recaptcha support is included with enterprise licenses</Body
      >
    {:else if !$recaptchaStore.available}
      <Body size="S"
        >Please configure Recaptcha keys to enable this protection</Body
      >
    {:else}
      <Body size="S">Enable recaptcha protection for all pages</Body>
    {/if}
  </Layout>
  <div>
    {#if $licensing.recaptchaEnabled && $recaptchaStore.available}
      <Button secondary on:click={updateRecaptcha}
        >{appRecaptchaEnabled ? "Disable" : "Enable"}</Button
      >
    {/if}
  </div>
  <Divider />
  <Heading size="S">Danger zone</Heading>
  <div class="row">
    <Button
      warning
      disabled={!$isOnlyUser}
      on:click={() => {
        deleteModal.show()
      }}
      tooltip={$isOnlyUser
        ? undefined
        : "Unavailable - another user is editing this app"}
    >
      Delete workspace
    </Button>
  </div>
</Layout>

<VersionModal bind:this={versionModal} hideIcon={true} />

<Modal bind:this={exportModal}>
  <ExportAppModal appId={$appStore.appId} published={exportPublishedVersion} />
</Modal>

<Modal bind:this={importModal}>
  <ImportAppModal app={$appStore} />
</Modal>

<ConfirmDialog
  bind:this={unpublishModal}
  title="Confirm unpublish"
  okText="Unpublish"
  onOk={deploymentStore.unpublishApp}
>
  Are you sure you want to unpublish the workspace
  <b>{$appStore.name}</b>?

  <p>This will make all apps and automations in this workspace unavailable</p>
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
