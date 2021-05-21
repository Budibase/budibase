<script>
  import { createEventDispatcher } from "svelte"
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { users } from "stores/portal"

  const dispatch = createEventDispatcher()

  export let user

  const password = Math.random().toString(36).substr(2, 20)

  async function resetPassword() {
    const res = await users.save({
      ...user,
      password,
      forceResetPassword: true,
    })
    if (res.status) {
      notifications.error(res.message)
    } else {
      notifications.success("Password reset.")
      dispatch("update")
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
