<script lang="ts">
  import { FancyForm, FancyInput } from "@budibase/bbui"
  import { createValidationStore, requiredValidator } from "../utils/validation"

  export let passwordForm: FancyForm | undefined = undefined
  export let password: string
  export let error: string
  export let minLength = "12"
  export let labels: any = {}

  const validatePassword = (value: string | undefined) => {
    if (!value || value.length < parseInt(minLength)) {
      return (
        labels?.minLengthText?.replace("{minLength}", minLength) ||
        `Please enter at least ${minLength} characters. We recommend using machine generated or random passwords.`
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
