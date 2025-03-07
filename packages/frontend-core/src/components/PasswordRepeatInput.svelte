<script>
  import { FancyForm, FancyInput } from "@budibase/bbui"
  import { createValidationStore, requiredValidator } from "../utils/validation"

  export let password
  export let error
  export let minLength = 12

  const validatePassword = value => {
    if (!value || value.length < minLength) {
      return `Please enter at least ${minLength} characters. We recommend using machine generated or random passwords.`
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

<FancyForm>
  <FancyInput
    label="Password"
    type="password"
    error={firstPasswordError}
    bind:value={$firstPassword}
  />
  <FancyInput
    label="Repeat password"
    type="password"
    error={$repeatTouched &&
      $firstPassword !== $repeatPassword &&
      "Passwords must match"}
    bind:value={$repeatPassword}
  />
</FancyForm>
