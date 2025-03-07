<script lang="ts">
  import { writable } from "svelte/store"
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import type { User, ContextUser } from "@budibase/types"
  import type { APIClient } from "@budibase/frontend-core"
  import { createEventDispatcher } from "svelte"

  export let user: User | ContextUser | undefined = undefined
  export let API: APIClient

  const dispatch = createEventDispatcher()

  const values = writable({
    firstName: user?.firstName,
    lastName: user?.lastName,
  })

  const updateInfo = async () => {
    try {
      await API.updateSelf($values)
      notifications.success("Information updated successfully")
      dispatch("save")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to update information")
    }
  }
</script>

<ModalContent title="My profile" confirmText="Save" onConfirm={updateInfo}>
  <Body size="S">
    Personalise the platform by adding your first name and last name.
  </Body>
  <Input disabled value={user?.email || ""} label="Email" />
  <Input bind:value={$values.firstName} label="First name" />
  <Input bind:value={$values.lastName} label="Last name" />
</ModalContent>
