<svelte:options runes={true} />

<script>
  import { goto as gotoStore } from "@roxi/routify"
  import { Body, ModalContent, notifications } from "@budibase/bbui"
  import { users } from "@/stores/portal/users"

  let { user } = $props()
  const goto = $derived($gotoStore)

  async function deleteUser() {
    try {
      await users.delete(user._id)
      notifications.success(`User ${user?.email} deleted.`)
      goto("./")
    } catch (error) {
      notifications.error("Error deleting user")
    }
  }
</script>

<ModalContent
  warning
  onConfirm={deleteUser}
  title="Delete User"
  confirmText="Delete user"
  cancelText="Cancel"
  showCloseIcon={false}
>
  <Body>
    Are you sure you want to delete <strong>{user?.email}</strong>
  </Body>
</ModalContent>
