<script>
  import { ModalContent, Input } from "@budibase/bbui"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { selectedAccessRole, allScreens } from "builderStore"

  export let modal
  export let navigationSelectionModal
  export let screenName
  export let url

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
</script>

<ModalContent
  size="M"
  title={"Enter details"}
  confirmText={"Continue"}
  onCancel={() => modal.show()}
  onConfirm={() => navigationSelectionModal.show()}
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
</ModalContent>
