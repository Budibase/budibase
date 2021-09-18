<script>
  import {
    ModalContent,
    Body,
    Input,
    notifications,
    Toggle,
    Label,
  } from "@budibase/bbui"
  import { createValidationStore, emailValidator } from "helpers/validation"
  import { users } from "stores/portal"
  import { _ as t } from "svelte-i18n"

  const [email, error, touched] = createValidationStore("", emailValidator)
  const password = Math.random().toString(36).substr(2, 20)
  let builder = false,
    admin = false

  async function createUser() {
    const res = await users.create({ email: $email, password, builder, admin })
    if (res.status) {
      notifications.error(res.message)
    } else {
      notifications.success($t("successfully-created-user"))
    }
  }
</script>

<ModalContent
  onConfirm={createUser}
  size="M"
  title={$t("basic-user-onboarding")}
  confirmText={$t("continue")}
  cancelText={$t("cancel")}
  disabled={$error}
  error={$touched && $error}
  showCloseIcon={false}
>
  <Body size="S">
    {$t(
      "below-you-will-find-the-users-username-and-password-the-password-will-not-be-accessible-from-this-point-please-save-the-credentials"
    )}
  </Body>
  <Input
    type="email"
    label={$t("username")}
    bind:value={$email}
    error={$touched && $error}
  />
  <Input disabled label={$t("password")} value={password} />
  <div>
    <div class="toggle">
      <Label size="L">{$t("development-access")}</Label>
      <Toggle text="" bind:value={builder} />
    </div>
    <div class="toggle">
      <Label size="L">{$t("administration-access")}</Label>
      <Toggle text="" bind:value={admin} />
    </div>
  </div>
</ModalContent>

<style>
  .toggle {
    display: grid;
    grid-template-columns: 78% 1fr;
    align-items: center;
    width: 50%;
  }
</style>
