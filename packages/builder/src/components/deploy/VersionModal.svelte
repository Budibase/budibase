<script>
  import {
    Modal,
    notifications,
    ModalContent,
    Body,
    Button,
    StatusLight,
    Link,
  } from "@budibase/bbui"
  import { appStore, initialise } from "@/stores/builder"
  import { API } from "@/api"
  import { ChangelogURL } from "@/constants"

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
      await API.updateAppClientVersion(appId)

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `App updated successfully to version ${$appStore.upgradableVersion}`
      )
      onComplete()
    } catch (err) {
      notifications.error(err?.message || err || "Error updating app")
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
      notifications.error(err?.message || err || "Error reverting app")
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
        This app is currently using version <b>{$appStore.version}</b>, but
        version
        <b>{$appStore.upgradableVersion}</b> is available. Updates can contain new
        features, performance improvements and bug fixes.
      </Body>
    {:else}
      <Body size="S">
        This app is currently using version <b>{$appStore.version}</b> which is the
        latest version available.
      </Body>
    {/if}
    <Body size="S">
      Find the changelog for the latest release
      <Link href={ChangelogURL} target="_blank">here</Link>
    </Body>
    {#if revertAvailable}
      <Body size="S">
        You can revert this app to version
        <b>{$appStore.revertableVersion}</b>
        if you're experiencing issues with the current version.
      </Body>
    {/if}
  </ModalContent>
</Modal>
