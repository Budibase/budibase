<script>
  import {
    Icon,
    Modal,
    notifications,
    ModalContent,
    Body,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import api from "builderStore/api"
  import clientPackage from "@budibase/client/package.json"

  let updateModal

  $: appId = $store.appId
  $: updateAvailable = clientPackage.version !== $store.version

  const update = async () => {
    try {
      const response = await api.post(
        `/api/applications/${appId}/client/update`
      )
      const json = await response.json()
      if (response.status !== 200) {
        throw json.message
      }

      // Reset frontend state after revert
      const applicationPkg = await api.get(
        `/api/applications/${appId}/appPackage`
      )
      const pkg = await applicationPkg.json()
      if (applicationPkg.ok) {
        await store.actions.initialise(pkg)
      } else {
        throw new Error(pkg)
      }

      notifications.success(
        `App updated successfully to version ${clientPackage.version}`
      )
    } catch (err) {
      notifications.error(`Error updating app: ${err}`)
    }
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
    {#if updateAvailable}
      <Body size="S">
        This app is currently using version <b>{$store.version}</b>, but version
        <b>{clientPackage.version}</b> is available. Updates can contain new
        features, performance improvements and bug fixes.
        <br /><br />
        Would you like to update this app?
      </Body>
    {:else}
      <Body size="S">
        This app is currently using version <b>{$store.version}</b> which is the
        latest version available.
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
