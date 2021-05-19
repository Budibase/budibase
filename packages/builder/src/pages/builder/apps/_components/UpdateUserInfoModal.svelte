<script>
  import { ModalContent, Body, Input } from "@budibase/bbui"
  import { writable } from "svelte/store"
  import { auth } from "stores/backend"

  const values = writable({
    firstName: $auth.user.firstName,
    lastName: $auth.user.lastName,
  })

  const updateInfo = async () => {
    // Update name
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
  <Input bind:value={$values.firstName} label="First name" />
  <Input bind:value={$values.lastName} label="Last name" />
</ModalContent>
