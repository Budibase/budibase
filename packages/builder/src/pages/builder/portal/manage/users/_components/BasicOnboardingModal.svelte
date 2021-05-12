<script>
  import { ModalContent, Body, Input, notifications } from "@budibase/bbui"
  import { createValidationStore, emailValidator } from "helpers/validation"
  import { users } from "stores/portal"

  const [email, error, touched] = createValidationStore("", emailValidator)
  const password = generatePassword()

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

  async function createUser() {
    const res = await users.create({ email: $email, password })
    if (res.status) {
      notifications.error(res.message)
    } else {
      notifications.success("Succesfully created user")
    }
  }
</script>

<ModalContent
  onConfirm={createUser}
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
  <Input disabled label="Password" value={password} />
</ModalContent>
