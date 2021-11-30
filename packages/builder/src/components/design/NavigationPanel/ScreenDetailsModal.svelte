<script>
  import { ModalContent, Input, ProgressCircle } from "@budibase/bbui"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { selectedAccessRole, allScreens } from "builderStore"
  import { onDestroy } from "svelte"

  export let screenName
  export let url
  export let chooseModal
  export let save
  export let showProgressCircle = false

  let routeError
  let roleId = $selectedAccessRole || "BASIC"

  const routeChanged = event => {
    if (!event.detail.startsWith("/")) {
      url = "/" + event.detail
    }
    url = sanitizeUrl(url)

    if (routeExists(url, roleId)) {
      routeError = "This URL is already taken for this access role"
    } else {
      routeError = ""
    }
  }

  const routeExists = (url, roleId) => {
    return $allScreens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  onDestroy(() => {
    screenName = ""
    url = ""
  })
</script>

<ModalContent
  size="M"
  title={"Enter details"}
  confirmText={"Continue"}
  onCancel={() => chooseModal(0)}
  onConfirm={() => save()}
  cancelText={"Back"}
  disabled={!screenName || !url || routeError}
>
  <Input label="Name" bind:value={screenName} />
  <Input
    label="URL"
    error={routeError}
    bind:value={url}
    on:change={routeChanged}
  />
  <div slot="footer">
    {#if showProgressCircle}
      <div class="footer-progress"><ProgressCircle size="S" /></div>
    {/if}
  </div>
</ModalContent>

<style>
  .footer-progress {
    margin-top: var(--spacing-s);
  }
</style>
