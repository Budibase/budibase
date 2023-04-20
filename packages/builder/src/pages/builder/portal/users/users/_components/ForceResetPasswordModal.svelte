<script>
  import { createEventDispatcher } from "svelte"
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { users } from "stores/portal"

  import { _ } from "../../../../../../../lang/i18n"

  const dispatch = createEventDispatcher()

  export let user

  const password = Math.random().toString(36).slice(2, 20)

  async function resetPassword() {
    try {
      await users.save({
        ...user,
        password,
        forceResetPassword: true,
      })
      notifications.success(
        $_(
          "pages.builder.portal.users.users._components.ForceReserPasswordModal.Password_reset"
        )
      )
      dispatch("update")
    } catch (error) {
      notifications.error(
        $_(
          "pages.builder.portal.users.users._components.ForceReserPasswordModal.Error_resetting"
        )
      )
    }
  }
</script>

<ModalContent
  onConfirm={resetPassword}
  size="M"
  title={$_(
    "pages.builder.portal.users.users._components.ForceReserPasswordModal.Force_Reset"
  )}
  confirmText={$_(
    "pages.builder.portal.users.users._components.ForceReserPasswordModal.Reset_password"
  )}
  cancelText={$_(
    "pages.builder.portal.users.users._components.ForceReserPasswordModal.Cancel"
  )}
  showCloseIcon={false}
>
  <Body noPadding
    >{$_(
      "pages.builder.portal.users.users._components.ForceReserPasswordModal.Before_reset"
    )}</Body
  >
  <Input disabled label="Password" value={password} />
</ModalContent>
