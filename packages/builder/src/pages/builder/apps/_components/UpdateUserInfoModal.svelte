<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { writable } from "svelte/store"
  import { auth } from "stores/backend"
  import { saveRow } from "components/backend/DataTable/api"
  import { TableNames } from "constants"

  const values = writable({
    firstName: $auth.user.firstName,
    lastName: $auth.user.lastName,
  })

  const updateInfo = async () => {
    const newUser = {
      ...$auth.user,
      firstName: $values.firstName,
      lastName: $values.lastName,
    }
    console.log(newUser)
    const response = await saveRow(newUser, TableNames.USERS)
    if (response.ok) {
      await auth.checkAuth()
      notifications.success("Information updated successfully")
    } else {
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
  <Input bind:value={$values.firstName} label="First name" />
  <Input bind:value={$values.lastName} label="Last name" />
</ModalContent>
