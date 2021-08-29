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
  import { _ as t } from "svelte-i18n"

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
        $t("app-updated-successfully-to-version") + ` ${clientPackage.version}`
      )
    } catch (err) {
      notifications.error($t("error-updating-app") + `: ${err}`)
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
        $t("app-reverted-successfully-to-version") + ` ${revertableVersion}`
      )
    } catch (err) {
      notifications.error($t("error-reverting-app") + `: ${err}`)
    }
    updateModal.hide()
  }
</script>

<div class="icon-wrapper" class:highlight={updateAvailable}>
  <Icon name="Refresh" hoverable on:click={updateModal.show} />
</div>
<Modal bind:this={updateModal}>
  <ModalContent
    title={$t("app-version")}
    confirmText={$t("update")}
    cancelText={updateAvailable ? $t("cancel") : $t("close")}
    onConfirm={update}
    showConfirmButton={updateAvailable}
  >
    <div slot="footer">
      {#if revertAvailable}
        <Button quiet secondary on:click={revert}>{$t("revert")}</Button>
      {/if}
    </div>
    {#if updateAvailable}
      <Body size="S">
        {$t("this-app-is-currently-using-version")} <b>{$store.version}</b>, {$t(
          "but-version"
        )}
        <b>{clientPackage.version}</b>
        {$t(
          "is-available-updates-can-contain-new-features-performance-improvements-and-bug-fixes"
        )}
      </Body>
    {:else}
      <Body size="S">
        {$t("this-app-is-currently-using-version")} <b>{$store.version}</b>
        {$t("which-is-the-latest-version-available")}
      </Body>
    {/if}
    {#if revertAvailable}
      <Body size="S">
        {$t("you-can-revert-this-app-to-version")}
        <b>{$store.revertableVersion}</b>
        {$t("if-youre-experiencing-issues-with-the-current-version")}
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
