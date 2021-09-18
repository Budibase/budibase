<script>
  import { createEventDispatcher } from "svelte"
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { users } from "stores/portal"
  import { _ as t } from "svelte-i18n"

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
      notifications.success($t("password-reset"))
      dispatch("update")
    }
  }
</script>

<ModalContent
  onConfirm={resetPassword}
  size="M"
  title={$t("force-reset-user-password")}
  confirmText={$t("reset-password")}
  cancelText={$t("cancel")}
  showCloseIcon={false}
>
  <Body noPadding
    >{$t(
      "before-you-reset-the-users-password-do-not-forget-to-copy-the-new-password-the-user-will-need-this-to-login-once-the-user-has-logged-in-they-will-be-asked-to-create-a-new-password-that-is-more-secure"
    )}</Body
  >
  <Input disabled label={$t("password")} value={password} />
</ModalContent>
