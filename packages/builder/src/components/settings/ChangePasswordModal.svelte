<script>
  import { _ } from "../../../lang/i18n"
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import { auth } from "stores/portal"

  let password
  let error

  const updatePassword = async () => {
    try {
      await auth.updateSelf({ password })
      notifications.success(
        $_("components.settings.ChangePassword.Password_changed")
      )
    } catch (error) {
      notifications.error($_("components.settings.ChangePassword.Failed"))
    }
  }
</script>

<ModalContent
  title={$_("components.settings.ChangePassword.Update_password")}
  confirmText={$_("components.settings.ChangePassword.Update_password")}
  onConfirm={updatePassword}
  disabled={error || !password}
>
  <Body size="S">{$_("components.settings.ChangePassword.Enter")}.</Body>
  <PasswordRepeatInput bind:password bind:error />
</ModalContent>
