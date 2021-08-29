<script>
  import { Layout, Input } from "@budibase/bbui"
  import {
    createValidationStore,
    requiredValidator,
  } from "../../../helpers/validation"
  import { _ as t } from "svelte-i18n"

  export let password
  export let error

  const [firstPassword, passwordError, firstTouched] = createValidationStore(
    "",
    requiredValidator
  )
  // eslint-disable-next-line no-unused-vars
  const [repeatPassword, _, repeatTouched] = createValidationStore(
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
    label={$t("password")}
    type="password"
    error={$firstTouched && $passwordError}
    bind:value={$firstPassword}
  />
  <Input
    label={$t("repeat-password")}
    type="password"
    error={$repeatTouched &&
      $firstPassword !== $repeatPassword &&
      $t("passwords-must-match")}
    bind:value={$repeatPassword}
  />
</Layout>
