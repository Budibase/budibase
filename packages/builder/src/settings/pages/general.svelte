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
  import { appsStore } from "@/stores/portal"
  import { licensing } from "@/stores/portal/licensing"
  import {
    Body,
    Button,
    Divider,
    Heading,
    Icon,
    Layout,
    Label,
    Modal,
    notifications,
    RadioGroup,
    TooltipPosition,
  } from "@budibase/bbui"
  import CloneResourcesModal from "../_components/CloneResourcesModal.svelte"

  let versionModal: VersionModal
  let exportModal: Modal
  let importModal: Modal
  let exportPublishedVersion: boolean = false
  let unpublishModal: ConfirmDialog
  let revertModal: RevertModal
  let deleteModal: DeleteModal
  let cloneResourcesModal: CloneResourcesModal
  let selectedClientVersionPolicy: "pinned" | "auto_latest" = "pinned"
  let savingClientVersionPolicy = false

  let clientVersionPolicyOptions: {
    label: string
    subtitle: string
    value: string
    disabled: boolean
  }[] = []

  $: updateAvailable =
    !!$appStore.upgradableVersion &&
    !!$appStore.version &&
    $appStore.upgradableVersion !== $appStore.version
  $: pinnedVersion = $appStore.version || "-"
  $: effectiveClientVersionPolicy =
    $appStore.effectiveClientVersionPolicy || "pinned"
  $: displayClientVersionPolicy =
    selectedClientVersionPolicy || effectiveClientVersionPolicy
  $: canEditClientVersionPolicy = $isOnlyUser && !savingClientVersionPolicy
  $: clientVersionPolicyOptions = [
    {
      label: `Pinned (${pinnedVersion})`,
      subtitle: "Use this workspace version and update manually",
      value: "pinned",
      disabled: !canEditClientVersionPolicy,
    },
    {
      label: "Auto latest",
      subtitle: "Always follow the latest client version automatically",
      value: "auto_latest",
      disabled: !canEditClientVersionPolicy,
    },
  ]
  $: revertAvailable = $appStore.revertableVersion != null
  $: appRecaptchaEnabled = $recaptchaStore.enabled
  $: hasOnlyOneWorkspace = $appsStore.apps.length <= 1
  $: disableDeleteWorkspace = !$isOnlyUser || hasOnlyOneWorkspace
  $: deleteWorkspaceTooltip = hasOnlyOneWorkspace
    ? "At least one workspace is required."
    : !$isOnlyUser
      ? "Unavailable - another user is editing this workspace"
      : undefined
  $: if (!savingClientVersionPolicy) {
    selectedClientVersionPolicy = effectiveClientVersionPolicy
  }

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

  const saveClientVersionPolicy = async (policy: "pinned" | "auto_latest") => {
    if (policy === effectiveClientVersionPolicy) {
      return
    }

    savingClientVersionPolicy = true
    try {
      await appStore.updateClientPolicy(policy)
      notifications.success("Client update mode saved")
    } catch (err: any) {
      notifications.error(
        `Failed to save client update mode: ${err?.message || err}`
      )
    } finally {
      savingClientVersionPolicy = false
    }
  }

  const updateClientVersionPolicy = async (
    event: CustomEvent<"pinned" | "auto_latest">
  ) => {
    await saveClientVersionPolicy(event.detail)
  }
</script>

<Layout noPadding>
  <Heading size="S">Workspace info</Heading>
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
  <Divider noMargin id="version" />
  <Layout gap="XS" noPadding>
    <Heading size="S">Client version</Heading>
    <div class="policy-controls">
      <div class="policy-mode-select">
        <Label size="L">Client update mode</Label>
        <RadioGroup
          bind:value={selectedClientVersionPolicy}
          options={clientVersionPolicyOptions}
          getOptionLabel={option => option.label}
          getOptionSubtitle={option => option.subtitle}
          getOptionValue={option => option.value}
          getOptionDisabled={option => option.disabled}
          on:change={updateClientVersionPolicy}
        />
      </div>
    </div>
    {#if displayClientVersionPolicy !== "auto_latest" && updateAvailable}
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
    {:else if displayClientVersionPolicy !== "auto_latest"}
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
    <Heading size="S">Import</Heading>
    <Body size="S">Import an export bundle to update this workspace</Body>
  </Layout>
  <div class="row">
    <Button secondary on:click={importModal?.show}>Import workspace</Button>
  </div>
  <Divider noMargin />
  <Layout noPadding gap="XS">
    <Heading size="XS">Copy resources</Heading>
    <Body size="S">Copy resources from this workspace to another one</Body>
  </Layout>
  <div class="row">
    <Button secondary on:click={() => cloneResourcesModal.show()}>
      Copy resources
    </Button>
    <CloneResourcesModal bind:this={cloneResourcesModal} />
  </div>
  <Divider noMargin />
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
  <Divider noMargin />
  <Heading size="XS">Danger zone</Heading>
  <div class="row">
    <Button
      warning
      disabled={disableDeleteWorkspace}
      on:click={() => {
        deleteModal.show()
      }}
      tooltip={deleteWorkspaceTooltip}
      tooltipPosition={TooltipPosition.Right}
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
  .policy-controls {
    display: flex;
    gap: var(--spacing-m);
    align-items: flex-end;
  }
  .policy-mode-select {
    width: 260px;
  }
</style>
