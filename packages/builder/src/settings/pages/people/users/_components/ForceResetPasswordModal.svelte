<script>
  import { createEventDispatcher } from "svelte"
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { users } from "@/stores/portal"

  const dispatch = createEventDispatcher()

  export let user

  const generatePassword = length => {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(36).padStart(2, "0"))
      .join("")
      .slice(0, length)
  }

  const password = generatePassword(12)

  async function resetPassword() {
    try {
      await users.save({
        ...user,
        password,
        forceResetPassword: true,
      })
      notifications.success("Password reset successfully")
      dispatch("update")
    } catch (error) {
      notifications.error("Error resetting password")
    }
  }
</script>

<ModalContent
  onConfirm={resetPassword}
  size="M"
  title="Force Reset User Password"
  confirmText="Reset password"
  cancelText="Cancel"
  showCloseIcon={false}
>
  <Body noPadding
    >Before you reset the users password, do not forget to copy the new
    password. The user will need this to login. Once the user has logged in they
    will be asked to create a new password that is more secure.</Body
  >
  <Input disabled label="Password" value={password} />
</ModalContent>
