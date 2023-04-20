<script>
  import { Layout, Input } from "@budibase/bbui"
  import {
    createValidationStore,
    requiredValidator,
  } from "../../../helpers/validation"
  import { _ } from "../../../../lang/i18n"

  export let password
  export let error

  const [firstPassword, passwordError, firstTouched] = createValidationStore(
    "",
    requiredValidator
  )
  // eslint-disable-next-line no-unused-vars
  const [repeatPassword, repeatTouched] = createValidationStore(
    "",
    requiredValidator
  )

  $: password = $firstPassword
  $: error =
    !$firstPassword ||
    !$firstTouched ||
    !$repeatTouched ||
    $firstPassword !== $repeatPassword
</script>

<Layout gap="XS" noPadding>
  <Input
    label={$_("components.common.users.PasswordRepeatInput.Password")}
    type="password"
    error={$firstTouched && $passwordError}
    bind:value={$firstPassword}
  />
  <Input
    label={$_("components.common.users.PasswordRepeatInput.Repeat_Password")}
    type="password"
    error={$repeatTouched &&
      $firstPassword !== $repeatPassword &&
      $_("components.common.users.PasswordRepeatInput.Passwords_match")}
    bind:value={$repeatPassword}
  />
</Layout>
