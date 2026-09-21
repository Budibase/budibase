<script lang="ts">
  import { FancyForm, FancyInput } from "@budibase/bbui"
  import {
    DEFAULT_PASSWORD_POLICY,
    validatePasswordPolicy,
  } from "@budibase/shared-core"
  import type { PasswordPolicy } from "@budibase/types"
  import { createValidationStore, requiredValidator } from "../utils/validation"

  export let passwordForm: FancyForm | undefined = undefined
  export let password: string
  export let error: string
  export let policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY
  export let labels: any = {}

  const validatePassword = (value: string | undefined) => {
    const result = validatePasswordPolicy({ password: value, policy })
    if (!result.valid) {
      if (!value || value.length < policy.minLength) {
        return (
          labels?.minLengthText?.replace(
            "{minLength}",
            policy.minLength.toString()
          ) || result.error
        )
      }
      return (
        result.error ||
        `Password must contain no more than ${policy.maxLength} characters.`
      )
    }
    return null
  }

  const [firstPassword, passwordError, firstTouched] = createValidationStore(
    "",
    requiredValidator
  )
  const [repeatPassword, _, repeatTouched] = createValidationStore(
    "",
    requiredValidator,
    validatePassword
  )

  $: password = $firstPassword
  $: firstPasswordError =
    ($firstTouched && $passwordError) ||
    ($repeatTouched && validatePassword(password))
  $: error =
    !$firstPassword ||
    !$firstTouched ||
    !$repeatTouched ||
    $firstPassword !== $repeatPassword ||
    firstPasswordError
</script>

<FancyForm bind:this={passwordForm}>
  <FancyInput
    label={labels?.passwordLabel ?? "Password"}
    type="password"
    error={firstPasswordError}
    bind:value={$firstPassword}
  />
  <FancyInput
    label={labels?.repeatLabel ?? "Repeat password"}
    type="password"
    error={$repeatTouched &&
      $firstPassword !== $repeatPassword &&
      (labels?.mismatchText ?? "Passwords must match")}
    bind:value={$repeatPassword}
  />
</FancyForm>
