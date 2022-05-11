<script>
  import { Select, ModalContent } from "@budibase/bbui"
  import analytics, { Events } from "analytics"
  import { RoleUtils } from "@budibase/frontend-core"
  import { roles } from "stores/backend"
  import { get } from "svelte/store"
  import { store } from "builderStore"
  import { onMount } from "svelte"

  export let onConfirm
  export let onCancel
  export let screenUrl
  export let screenAccessRole

  let error

  const onChangeRole = e => {
    const roleId = e.detail
    analytics.captureEvent(Events.SCREEN.CREATE_ROLE_UPDATED, {
      screenAccessRole: roleId,
    })
    if (routeExists(screenUrl, roleId)) {
      error = "This URL is already taken for this access role"
    } else {
      error = null
    }
  }

  const routeExists = (url, role) => {
    if (!url || !role) {
      return false
    }
    return get(store).screens.some(
      screen =>
        screen.routing.route.toLowerCase() === url.toLowerCase() &&
        screen.routing.roleId === role
    )
  }

  onMount(() => {
    // Validate the initial role
    onChangeRole({ detail: screenAccessRole })
  })
</script>

<ModalContent
  title={"Create CRUD Screens"}
  confirmText={"Done"}
  cancelText={"Back"}
  {onConfirm}
  {onCancel}
  disabled={!!error}
>
  Select which level of access you want your screens to have
  <Select
    bind:value={screenAccessRole}
    on:change={onChangeRole}
    label="Access"
    {error}
    getOptionLabel={role => role.name}
    getOptionValue={role => role._id}
    getOptionColour={role => RoleUtils.getRoleColour(role._id)}
    options={$roles}
    placeholder={null}
  />
</ModalContent>
