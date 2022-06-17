<script>
  import { ModalContent, Input } from "@budibase/bbui"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { selectedAccessRole, allScreens } from "builderStore"
  import { get } from "svelte/store"

  export let onConfirm
  export let onCancel
  export let screenUrl
  export let confirmText = "Continue"

  let routeError
  let touched = false
  let screenAccessRole = $selectedAccessRole + ""

  const appPrefix = "/app"

  $: appUrl = screenUrl
    ? `${window.location.origin}${appPrefix}${screenUrl}`
    : `${window.location.origin}${appPrefix}`

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
  disabled={!screenAccessRole || !screenUrl || routeError || !touched}
>
  <Input
    label="Enter a URL for the new screen"
    error={routeError}
    bind:value={screenUrl}
    on:change={routeChanged}
  />
  <div class="app-server" title={appUrl}>
    {appUrl}
  </div>
</ModalContent>

<style>
  .app-server {
    color: var(--spectrum-global-color-gray-600);
    width: 320px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
