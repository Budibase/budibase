<script>
  import { ModalContent, Input } from "@budibase/bbui"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { get } from "svelte/store"
  import { store } from "builderStore"

  export let onConfirm
  export let onCancel
  export let screenUrl
  export let screenRole
  export let confirmText = "Continue"

  const appPrefix = "/app"
  let touched = false
  let error

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
      error = "This URL is already taken for this access role"
    } else {
      error = null
    }
  }

  const routeExists = url => {
    if (!screenRole) {
      return false
    }
    return get(store).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === screenRole
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
  title={"Screen details"}
  {confirmText}
  onConfirm={confirmScreenDetails}
  {onCancel}
  cancelText={"Back"}
  disabled={!screenUrl || error || !touched}
>
  <Input
    label="Enter a URL for the new screen"
    {error}
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
