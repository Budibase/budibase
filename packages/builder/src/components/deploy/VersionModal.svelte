<script>
  import {
    Modal,
    notifications,
    ModalContent,
    Body,
    Button,
    StatusLight,
  } from "@budibase/bbui"
  import { appStore, initialise } from "stores/builder"
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

  $: appId = $appStore.appId
  $: updateAvailable =
    $appStore.upgradableVersion &&
    $appStore.version &&
    $appStore.upgradableVersion !== $appStore.version
  $: revertAvailable = $appStore.revertableVersion != null

  const refreshAppPackage = async () => {
    try {
      const pkg = await API.fetchAppPackage(appId)
      await initialise(pkg)
    } catch (error) {
      notifications.error("Error fetching app package")
    }
  }

  const update = async () => {
    try {
      console.log(1);
      await API.updateAppClientVersion(appId)

      console.log(2);
      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `App updated successfully to version ${$appStore.upgradableVersion}`
      )
      console.log(3);
      onComplete()
      console.log(4);
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
        `App reverted successfully to version ${$appStore.revertableVersion}`
      )
    } catch (err) {
      notifications.error(`Error reverting app: ${err}`)
    }
    updateModal.hide()
  }

  $: {
    console.log("am i ever here");
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
    showConfirmButton={true}
  >
    <div slot="footer">
        <Button quiet secondary on:click={revert}>Revert</Button>
    </div>
      <Body size="S">
        This app is currently using version <b>{$appStore.version}</b>, but
        version
        <b>{$appStore.upgradableVersion}</b> is available. Updates can contain new
        features, performance improvements and bug fixes.
      </Body>
      <Body size="S">
        You can revert this app to version
        <b>{$appStore.revertableVersion}</b>
        if you're experiencing issues with the current version.
      </Body>
  </ModalContent>
</Modal>
