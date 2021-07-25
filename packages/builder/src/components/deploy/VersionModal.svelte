<script>
  import {
    Icon,
    Modal,
    notifications,
    ModalContent,
    Body,
    Button,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import clientPackage from "@budibase/client/package.json"

  let updateModal

  $: appId = $store.appId
  $: updateAvailable = clientPackage.version !== $store.version
  $: revertAvailable = $store.revertableVersion != null

  const refreshAppPackage = async () => {
    const applicationPkg = await api.get(
      `/api/applications/${appId}/appPackage`
    )
    const pkg = await applicationPkg.json()
    if (applicationPkg.ok) {
      await store.actions.initialise(pkg)
    } else {
      throw new Error(pkg)
    }
  }

  const update = async () => {
    try {
      const response = await api.post(
        `/api/applications/${appId}/client/update`
      )
      const json = await response.json()
      if (response.status !== 200) {
        throw json.message
      }

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `App updated successfully to version ${clientPackage.version}`
      )
    } catch (err) {
      notifications.error(`Error updating app: ${err}`)
    }
  }

  const revert = async () => {
    try {
      const revertableVersion = $store.revertableVersion
      const response = await api.post(
        `/api/applications/${appId}/client/revert`
      )
      const json = await response.json()
      if (response.status !== 200) {
        throw json.message
      }

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `App reverted successfully to version ${revertableVersion}`
      )
    } catch (err) {
      notifications.error(`Error reverting app: ${err}`)
    }
    updateModal.hide()
  }
</script>

<div class="icon-wrapper" class:highlight={updateAvailable}>
  <Icon name="Refresh" hoverable on:click={updateModal.show} />
</div>
<Modal bind:this={updateModal}>
  <ModalContent
    title="App version"
    confirmText="Update"
    cancelText={updateAvailable ? "Cancel" : "Close"}
    onConfirm={update}
    showConfirmButton={updateAvailable}
  >
    <div slot="footer">
      {#if revertAvailable}
        <Button quiet secondary on:click={revert}>Revert</Button>
      {/if}
    </div>
    {#if updateAvailable}
      <Body size="S">
        This app is currently using version <b>{$store.version}</b>, but version
        <b>{clientPackage.version}</b> is available. Updates can contain new features,
        performance improvements and bug fixes.
      </Body>
    {:else}
      <Body size="S">
        This app is currently using version <b>{$store.version}</b> which is the
        latest version available.
      </Body>
    {/if}
    {#if revertAvailable}
      <Body size="S">
        You can revert this app to version
        <b>{$store.revertableVersion}</b>
        if you're experiencing issues with the current version.
      </Body>
    {/if}
  </ModalContent>
</Modal>

<style>
  .icon-wrapper {
    display: contents;
  }
  .icon-wrapper.highlight :global(svg) {
    color: var(--spectrum-global-color-blue-600);
  }
</style>
