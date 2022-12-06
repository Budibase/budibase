<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { writable } from "svelte/store"
  import { auth } from "stores/portal"

  const values = writable({
    firstName: $auth.user.firstName,
    lastName: $auth.user.lastName,
  })

  const updateInfo = async () => {
    try {
      await auth.updateSelf($values)
      notifications.success("Information updated successfully")
    } catch (error) {
      notifications.error("Failed to update information")
    }
  }
</script>

<ModalContent
  title="Update user information"
  confirmText="Update information"
  onConfirm={updateInfo}
>
  <Body size="S">
    Personalise the platform by adding your first name and last name.
  </Body>
  <Input disabled bind:value={$auth.user.email} label="Email" />
  <Input
    bind:value={$values.firstName}
    label="First name"
    dataCy="user-first-name"
  />
  <Input
    bind:value={$values.lastName}
    label="Last name"
    dataCy="user-last-name"
  />
</ModalContent>
