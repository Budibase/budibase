<script>
  import { appStore, initialise } from "@/stores/builder"
  import {
    Body,
    Button,
    Link,
    Modal,
    ModalContent,
    notifications,
    ProgressCircle,
    StatusLight,
  } from "@budibase/bbui"

  import { API } from "@/api"
  import { CHANGELOG_URL } from "@/constants"
  import { admin } from "@/stores/portal"

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
    ($appStore.upgradableVersion &&
      $appStore.version &&
      $appStore.upgradableVersion !== $appStore.version) ||
    $admin.isDev
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

  let reverting = false
  const revert = async () => {
    reverting = true
    try {
      await API.revertAppClientVersion(appId)

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `Workspace reverted successfully to version ${$appStore.revertableVersion}`
      )
    } catch (err) {
      notifications.error(err?.message || err || "Error reverting app")
    } finally {
      reverting = false
    }
    updateModal.hide()
  }
</script>

{#if !hideIcon && updateAvailable}
  <StatusLight hoverable on:click={updateModal.show} notice>Update</StatusLight>
{/if}
<Modal bind:this={updateModal}>
  <ModalContent
    title={"Client version"}
    confirmText="Update"
    cancelText={updateAvailable ? "Cancel" : "Close"}
    onConfirm={update}
    showConfirmButton={updateAvailable}
  >
    <div slot="footer">
      {#if revertAvailable}
        <Button quiet secondary on:click={revert} disabled={reverting}>
          {#if reverting}
            <ProgressCircle overBackground={true} size="S" />
          {:else}
            Revert
          {/if}
        </Button>
      {/if}
    </div>
    {#if updateAvailable}
      <Body size="S">
        This workspace is currently using version
        <b>{$appStore.version}</b>, but version
        <b>{$appStore.upgradableVersion}</b> is available. Updates can contain new
        features, performance improvements and bug fixes.
      </Body>
    {:else}
      <Body size="S">
        This workspace is currently using version
        <b>{$appStore.version}</b> which is the latest version available.
      </Body>
    {/if}
    <Body size="S">
      Find the changelog for the latest release
      <Link href={CHANGELOG_URL} target="_blank">here</Link>
    </Body>
    {#if revertAvailable}
      <Body size="S">
        You can revert this workspace to client version
        <b>{$appStore.revertableVersion}</b>
        if you're experiencing issues with the current version.
      </Body>
    {/if}
  </ModalContent>
</Modal>
