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
  import clientPackage from "@budibase/client/package.json"
  import { _ } from "../../../lang/i18n"

  export function show() {
    updateModal.show()
  }

  export function hide() {
    updateModal.hide()
  }

  export let hideIcon = false

  let updateModal

  $: appId = $store.appId
  $: updateAvailable =
    clientPackage.version &&
    $store.version &&
    clientPackage.version !== $store.version
  $: revertAvailable = $store.revertableVersion != null

  const refreshAppPackage = async () => {
    try {
      const pkg = await API.fetchAppPackage(appId)
      await store.actions.initialise(pkg)
    } catch (error) {
      notifications.error($_("components.deploy.VersionModal.Error_fetching"))
    }
  }

  const update = async () => {
    try {
      await API.updateAppClientVersion(appId)

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `${$_("components.deploy.VersionModal.App_updated")} ${
          clientPackage.version
        }`
      )
    } catch (err) {
      notifications.error(
        `${$_("components.deploy.VersionModal.Error_updating")}: ${err}`
      )
    }
    updateModal.hide()
  }

  const revert = async () => {
    try {
      await API.revertAppClientVersion(appId)

      // Don't wait for the async refresh, since this causes modal flashing
      refreshAppPackage()
      notifications.success(
        `${$_("components.deploy.VersionModal.App_reverted")} ${
          $store.revertableVersion
        }`
      )
    } catch (err) {
      notifications.error(
        `${$_("components.deploy.VersionModal.Error_reverting")}: ${err}`
      )
    }
    updateModal.hide()
  }
</script>

{#if !hideIcon && updateAvailable}
  <StatusLight hoverable on:click={updateModal.show} notice>
    {$_("components.deploy.VersionModal.Update_available")}
  </StatusLight>
{/if}
<Modal bind:this={updateModal}>
  <ModalContent
    title={$_("components.deploy.VersionModal.App_version")}
    confirmText="Update"
    cancelText={updateAvailable
      ? $_("components.deploy.VersionModal.Cancel")
      : $_("components.deploy.VersionModal.Close")}
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
        {$_("components.deploy.VersionModal.app_using")}
        <b>{$store.version}</b>, {$_(
          "components.deploy.VersionModal.but_version"
        )}
        <b>{clientPackage.version}</b>
        {$_("components.deploy.VersionModal.Updates_features")}
        {$_("components.deploy.VersionModal.performance_improvements")}
      </Body>
    {:else}
      <Body size="S">
        {$_("components.deploy.VersionModal.app_using")} <b>{$store.version}</b>
        {$_("components.deploy.VersionModal.latest_version")}
      </Body>
    {/if}
    {#if revertAvailable}
      <Body size="S">
        {$_("components.deploy.VersionModal.revert_app")}
        <b>{$store.revertableVersion}</b>
        {$_("components.deploy.VersionModal.issues_varsion")}
      </Body>
    {/if}
  </ModalContent>
</Modal>
