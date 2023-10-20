<script>
  import {
    Modal,
    notifications,
    ModalContent,
    Body,
    Button,
    StatusLight,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import { API } from "api"

  export function show() {
    updateModal.show()
  }

  export function hide() {
    updateModal.hide()
  }

  export let onComplete = () => {}
  export let hideIcon = false

  let updateModal

  $: appId = $store.appId
  $: updateAvailable =
    $store.upgradableVersion &&
    $store.version &&
    $store.upgradableVersion !== $store.version
  $: revertAvailable = $store.revertableVersion != null

  const refreshAppPackage = async () => {
    try {
      const pkg = await API.fetchAppPackage(appId)
      await store.actions.initialise(pkg)
    } catch (error) {
      notifications.error("Error fetching app package")
    }
  }

  const update = async () => {
    try {
      await API.updateAppClientVersion(appId)

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `App updated successfully to version ${$store.upgradableVersion}`
      )
      onComplete()
    } catch (err) {
      notifications.error(`Error updating app: ${err}`)
    }
    updateModal.hide()
  }

  const revert = async () => {
    try {
      await API.revertAppClientVersion(appId)

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `App reverted successfully to version ${$store.revertableVersion}`
      )
    } catch (err) {
      notifications.error(`Error reverting app: ${err}`)
    }
    updateModal.hide()
  }
</script>

{#if !hideIcon && updateAvailable}
  <StatusLight hoverable on:click={updateModal.show} notice>Update</StatusLight>
{/if}
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
        <b>{$store.upgradableVersion}</b> is available. Updates can contain new features,
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
