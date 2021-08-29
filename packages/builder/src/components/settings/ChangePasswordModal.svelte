<script>
  import { ModalContent, Body, notifications } from "@budibase/bbui"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import { auth } from "stores/portal"
  import { _ as t } from "svelte-i18n"

  let password
  let error

  const updatePassword = async () => {
    try {
      await auth.updateSelf({ password })
      notifications.success($t("password-changed-successfully"))
    } catch (error) {
      notifications.error($t("failed-to-update-password"))
    }
  }
</script>

<ModalContent
  title={$t("update-password")}
  confirmText={$t("update-password")}
  onConfirm={updatePassword}
  disabled={error || !password}
>
  <Body size="S">{$t("enter-your-new-password-below")}</Body>
  <PasswordRepeatInput bind:password bind:error />
</ModalContent>
