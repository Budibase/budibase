<script>
  import { ModalContent, Input } from "@budibase/bbui"
  import sanitizeUrl from "helpers/sanitizeUrl"
  import { get } from "svelte/store"
  import { screenStore } from "stores/builder"

  export let onConfirm
  export let onCancel
  export let screenUrl
  export let screenRole
  export let confirmText = "Continue"

  const appPrefix = "/app"
  let touched = false
  let error
  let modal

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
    return get(screenStore).screens.some(
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
  bind:this={modal}
  size="M"
  title={"Screen details"}
  {confirmText}
  onConfirm={confirmScreenDetails}
  {onCancel}
  cancelText={"Back"}
  disabled={!screenUrl || error || !touched}
>
  <form on:submit|preventDefault={() => modal.confirm()}>
    <Input
      label="Enter a URL for the new screen"
      {error}
      bind:value={screenUrl}
      on:change={routeChanged}
    />
    <div class="app-server" title={appUrl}>
      {appUrl}
    </div>
  </form>
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
