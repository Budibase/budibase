<script lang="ts">
  import { ModalContent, Input, keepOpen } from "@budibase/bbui"
  import sanitizeUrl from "@/helpers/sanitizeUrl"
  import { get } from "svelte/store"
  import { screenStore } from "@/stores/builder"

  export let onConfirm: (_data: { route: string }) => Promise<void>
  export let onCancel: (() => Promise<void>) | undefined = undefined
  export let route: string = ""
  export let role: string | undefined = undefined
  export let confirmText = "Continue"

  const appPrefix = "/app"
  let touched = false
  let error: string | undefined
  let modal: ModalContent

  $: appUrl = route
    ? `${window.location.origin}${appPrefix}${route}`
    : `${window.location.origin}${appPrefix}`

  const routeChanged = (event: { detail: string }) => {
    if (!event.detail.startsWith("/")) {
      route = "/" + event.detail
    }
    touched = true
    route = sanitizeUrl(route)
    if (routeExists(route)) {
      error = "This URL is already taken for this access role"
    } else {
      error = undefined
    }
  }

  const routeExists = (url: string) => {
    if (!role) {
      return false
    }
    return get(screenStore).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === role
    )
  }
  $: disabled = !route || !!error || !touched

  const confirmScreenDetails = async () => {
    if (disabled) {
      return keepOpen
    }

    await onConfirm({
      route,
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
  {disabled}
>
  <form on:submit|preventDefault={() => modal.confirm()}>
    <Input
      label="Enter a URL for the new screen"
      {error}
      bind:value={route}
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
    margin-top: 4px;
  }
</style>
