<script lang="ts">
  import { writable } from "svelte/store"
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import type { User, ContextUser } from "@budibase/types"
  import type { APIClient } from "@budibase/frontend-core"
  import { createEventDispatcher } from "svelte"

  export let user: User | ContextUser | undefined = undefined
  export let API: APIClient
  export let notifySuccess = notifications.success
  export let notifyError = notifications.error
  export let labels: any = {}

  const dispatch = createEventDispatcher()

  const values = writable({
    firstName: user?.firstName,
    lastName: user?.lastName,
  })

  const updateInfo = async () => {
    try {
      await API.updateSelf($values)
      notifySuccess("Information updated successfully")
      dispatch("save")
    } catch (error) {
      console.error(error)
      notifyError("Failed to update information")
    }
  }
</script>

<ModalContent
  title={labels?.title ?? "My profile"}
  confirmText={labels?.saveText ?? "Save"}
  cancelText={labels?.cancelText ?? "Cancel"}
  onConfirm={updateInfo}
>
  <Body size="S">
    {labels?.body ??
      "Personalise the platform by adding your first name and last name."}
  </Body>
  <Input
    disabled
    value={user?.email || ""}
    label={labels?.emailLabel ?? "Email"}
  />
  <Input
    bind:value={$values.firstName}
    label={labels?.firstNameLabel ?? "First name"}
  />
  <Input
    bind:value={$values.lastName}
    label={labels?.lastNameLabel ?? "Last name"}
  />
</ModalContent>
