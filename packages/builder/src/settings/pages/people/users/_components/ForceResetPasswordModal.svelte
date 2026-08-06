<script lang="ts">
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { users } from "@/stores/portal/users"
  import type { User } from "@budibase/types"

  interface Props {
    user?: User
    onupdate?: () => void
  }

  let { user, onupdate }: Props = $props()

  const generatePassword = (length: number) => {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(36).padStart(2, "0"))
      .join("")
      .slice(0, length)
  }

  const password = generatePassword(12)

  async function resetPassword() {
    if (!user) {
      notifications.error("Error resetting password")
      return
    }
    try {
      await users.save({
        ...user,
        password,
        forceResetPassword: true,
      })
      notifications.success("Password reset successfully")
      onupdate?.()
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
  <Body
    >Before you reset the users password, do not forget to copy the new
    password. The user will need this to login. Once the user has logged in they
    will be asked to create a new password that is more secure.</Body
  >
  <Input disabled label="Password" value={password} />
</ModalContent>
