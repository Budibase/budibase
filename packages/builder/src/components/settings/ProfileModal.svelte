<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { writable } from "svelte/store"
  import { auth } from "@/stores/portal"

  const values = writable({
    firstName: $auth.user.firstName,
    lastName: $auth.user.lastName,
  })

  const updateInfo = async () => {
    try {
      await auth.updateSelf($values)
      notifications.success("Information updated successfully")
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
  <Input disabled bind:value={$auth.user.email} label="Email" />
  <Input bind:value={$values.firstName} label="First name" />
  <Input bind:value={$values.lastName} label="Last name" />
</ModalContent>
