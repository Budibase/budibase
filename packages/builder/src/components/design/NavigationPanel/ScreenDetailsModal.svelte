<script>
  import { ModalContent, Input } from "@budibase/bbui"
  import sanitizeUrl from "builderStore/store/screenTemplates/utils/sanitizeUrl"
  import { selectedAccessRole, allScreens } from "builderStore"

  export let screenName
  export let url
  export let chooseModal

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
  onCancel={() => chooseModal(0)}
  onConfirm={() => chooseModal(2)}
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
