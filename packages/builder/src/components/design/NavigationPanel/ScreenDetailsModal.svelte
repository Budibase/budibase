<script>
  import { ModalContent, Input, ProgressCircle } from "@budibase/bbui"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { selectedAccessRole, allScreens } from "builderStore"
  import { get } from "svelte/store"

  export let onConfirm
  export let onCancel
  export let showProgressCircle = false
  export let screenName
  export let screenUrl
  export let confirmText = "Continue"

  let routeError
  let touched = false

  const routeChanged = event => {
    if (!event.detail.startsWith("/")) {
      screenUrl = "/" + event.detail
    }
    touched = true
    screenUrl = sanitizeUrl(screenUrl)
    if (routeExists(screenUrl)) {
      routeError = "This URL is already taken for this access role"
    } else {
      routeError = null
    }
  }

  const routeExists = url => {
    const roleId = get(selectedAccessRole) || "BASIC"
    return get(allScreens).some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === roleId
    )
  }

  const confirmScreenDetails = async () => {
    await onConfirm({
      screenName,
      screenUrl,
    })
  }
</script>

<ModalContent
  size="M"
  title={"Enter details"}
  {confirmText}
  onConfirm={confirmScreenDetails}
  {onCancel}
  cancelText={"Back"}
  disabled={!screenName || !screenUrl || routeError || !touched}
>
  <Input label="Name" bind:value={screenName} />
  <Input
    label="URL"
    error={routeError}
    bind:value={screenUrl}
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
