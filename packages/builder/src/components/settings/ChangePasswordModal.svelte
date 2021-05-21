<script>
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import { auth } from "stores/portal"

  let password
  let error

  const updatePassword = async () => {
    try {
      await auth.updateSelf({ ...$auth.user, password })
      notifications.success("Password changed successfully")
    } catch (error) {
      notifications.error("Failed to update password")
    }
  }
</script>

<ModalContent
  title="Update password"
  confirmText="Update password"
  onConfirm={updatePassword}
  disabled={error || !password}
>
  <Body size="S">Enter your new password below.</Body>
  <PasswordRepeatInput bind:password bind:error />
</ModalContent>
