<script>
  import { admin } from "@/stores/portal"
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
  import RevertModalVersionSelect from "./RevertModalVersionSelect.svelte"
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
  $: revertAvailable =
    $appStore.revertableVersion != null ||
    ($admin.isDev && $appStore.version === "0.0.0")

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
        $appStore.revertableVersion
          ? `App reverted successfully to version ${$appStore.revertableVersion}`
          : "App reverted successfully"
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
        {#if $admin.isDev}
          <RevertModalVersionSelect
            revertableVersion={$appStore.revertableVersion}
          />
        {:else}
          <b>{$appStore.revertableVersion}</b>
        {/if}
        if you're experiencing issues with the current version.
      </Body>
    {/if}
  </ModalContent>
</Modal>
