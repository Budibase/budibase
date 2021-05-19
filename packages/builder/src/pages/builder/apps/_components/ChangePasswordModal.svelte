<script>
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"

  let password
  let error

  const updatePassword = async () => {
    // Update password
  }
</script>

<ModalContent
  title="Change password"
  confirmText="Update password"
  onConfirm={updatePassword}
  disabled={error}
>
  <Body size="S">Enter your new password below.</Body>
  <PasswordRepeatInput bind:password bind:error />
</ModalContent>
