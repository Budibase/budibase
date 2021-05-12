<script>
  import { ModalContent, Body, Input } from "@budibase/bbui"
  import { createValidationStore, emailValidator } from "helpers/validation"

  const [email, error, touched] = createValidationStore("", emailValidator)

  function generatePassword() {
    return Array(30)
      .fill(
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
      )
      .map(
        x =>
          x[
            Math.floor(
              (crypto.getRandomValues(new Uint32Array(1))[0] /
                (0xffffffff + 1)) *
                x.length
            )
          ]
      )
      .join("")
  }

  $: console.log("Error: ", $error)
  $: console.log("Touched: ", $touched)
</script>

<ModalContent
  size="M"
  title="Basic user onboarding"
  confirmText="Continue"
  cancelText="Cancel"
  disabled={$error}
  error={$touched && $error}
  showCloseIcon={false}
>
  <Body noPadding
    >Below you will find the user’s username and password. The password will not
    be accessible from this point. Please download the credentials.</Body
  >
  <Input
    type="email"
    label="Username"
    bind:value={$email}
    error={$touched && $error}
  />
  <Input disabled label="Password" value={generatePassword()} />
</ModalContent>
