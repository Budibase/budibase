<script lang="ts">
  import { API } from "@/api"
  import { CHANGELOG_URL } from "@/constants"
  import { appStore, initialise } from "@/stores/builder"
  import {
    Body,
    Link,
    Modal,
    ModalContent,
    notifications,
  } from "@budibase/bbui"

  let updateModal = $state<{ show: () => void; hide: () => void } | undefined>()

  export function show() {
    updateModal?.show()
  }

  export function hide() {
    updateModal?.hide()
  }

  let appId = $derived($appStore.appId)
  let updateAvailable = $derived(
    !!$appStore.upgradableVersion &&
      !!$appStore.version &&
      $appStore.upgradableVersion !== $appStore.version
  )

  const refreshAppPackage = async () => {
    if (!appId) {
      return
    }

    try {
      const pkg = await API.fetchAppPackage(appId)
      await initialise(pkg)
    } catch (_error) {
      notifications.error("Error fetching app package")
    }
  }

  const update = async () => {
    if (!appId) {
      notifications.error("Error updating app")
      return
    }

    try {
      await API.updateAppClientVersion(appId)
      refreshAppPackage()
      notifications.success(
        `App updated successfully to version ${$appStore.upgradableVersion}`
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error updating app"
      notifications.error(message)
    }
    updateModal?.hide()
  }
</script>

<Modal bind:this={updateModal}>
  <ModalContent
    title="Update required"
    confirmText="Update"
    cancelText={updateAvailable ? "Cancel" : "Close"}
    onConfirm={update}
    showConfirmButton={updateAvailable}
  >
    <Body size="S">Agent Chat requires a Client update.</Body>
    {#if updateAvailable}
      <Body size="S">
        This workspace is currently on version <b>{$appStore.version}</b>.
        Update to <b>{$appStore.upgradableVersion}</b> to deploy Agent Chat.
      </Body>
    {:else}
      <Body size="S">
        This workspace is currently on version <b>{$appStore.version}</b> and no
        newer client version is available on this instance.
      </Body>
    {/if}
    <Body size="S">
      Find the changelog for the latest release
      <Link href={CHANGELOG_URL} target="_blank">here</Link>.
    </Body>
  </ModalContent>
</Modal>
