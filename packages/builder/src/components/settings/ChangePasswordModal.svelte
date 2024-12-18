<script>
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import PasswordRepeatInput from "@/components/common/users/PasswordRepeatInput.svelte"
  import { auth } from "@/stores/portal"

  let password
  let error

  const updatePassword = async () => {
    try {
      await auth.updateSelf({ password })
      notifications.success("Password changed successfully")
    } catch (error) {
      notifications.error("Failed to update password")
    }
  }

  const handleKeydown = evt => {
    if (evt.key === "Enter" && !error && password) {
      updatePassword()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<ModalContent
  title="Update password"
  confirmText="Update password"
  onConfirm={updatePassword}
  disabled={error || !password}
>
  <Body size="S">Enter your new password below.</Body>
  <PasswordRepeatInput bind:password bind:error />
</ModalContent>
